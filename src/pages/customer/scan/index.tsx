import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { tableService } from "../../../services/table.service";
import { useCartStore } from "../../../states/cart.store";

const ScanPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { setTableId, clearCart } = useCartStore();

  const {
    data: table,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["table", tableId],
    queryFn: () => tableService.getPublicInfo(tableId!),
    enabled: !!tableId,
  });

  useEffect(() => {
    if (table) {
      // Clear previous cart and set new table
      clearCart();
      setTableId(table.id);

      // Redirect to menu
      setTimeout(() => {
        navigate("/customer/menu", { replace: true });
      }, 1500);
    }
  }, [table, setTableId, clearCart, navigate]);

  useEffect(() => {
    if (error) {
      message.error("Meja tidak ditemukan");
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-purple-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6">
        {isLoading ? (
          <>
            <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
              <span className="text-white font-bold text-4xl font-display">
                P
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 font-display mb-2">
              Memverifikasi Meja...
            </h1>
            <Spin size="large" className="mt-4" />
          </>
        ) : table ? (
          <>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
              <span className="text-white font-bold text-3xl">
                {table.table_number}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 font-display mb-2">
              Selamat Datang! 🎉
            </h1>
            <p className="text-gray-600 mb-4">
              Anda berada di{" "}
              <span className="font-semibold">Meja {table.table_number}</span>
            </p>
            <p className="text-sm text-gray-500">Mengalihkan ke menu...</p>
            <div className="mt-6">
              <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full gradient-primary animate-pulse"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ScanPage;
