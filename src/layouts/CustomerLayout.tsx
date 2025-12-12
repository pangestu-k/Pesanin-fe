import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Badge } from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useCartStore } from "../states/cart.store";

const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { getItemCount, tableId } = useCartStore();
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-purple-300/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card backdrop-blur-xl bg-white/80 border-b border-white/20">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient font-display">
                  Pesanin
                </h1>
                {tableId && (
                  <p className="text-xs text-gray-500">
                    Meja #{tableId.slice(-4)}
                  </p>
                )}
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => navigate("/customer/cart")}
              className="relative p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Badge count={itemCount} size="small" offset={[-2, 2]}>
                <ShoppingCartOutlined className="text-xl text-primary-600" />
              </Badge>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card bg-white/90 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => navigate("/customer/menu")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <HomeOutlined className="text-xl" />
              <span className="text-xs font-medium">Menu</span>
            </button>

            <button
              onClick={() => navigate("/customer/cart")}
              className="relative -mt-8"
            >
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Badge count={itemCount} size="small" offset={[-5, 5]}>
                  <ShoppingCartOutlined className="text-2xl text-white" />
                </Badge>
              </div>
            </button>

            <button
              onClick={() => navigate("/customer/orders")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FileTextOutlined className="text-xl" />
              <span className="text-xs font-medium">Pesanan</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CustomerLayout;
