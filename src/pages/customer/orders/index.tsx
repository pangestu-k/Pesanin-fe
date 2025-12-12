import React from "react";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../../services/order.service";
import { useCartStore } from "../../../states/cart.store";
import OrderList from "../../../components/organisms/OrderList";

const CustomerOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { tableId } = useCartStore();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["customerOrders", tableId],
    queryFn: () => orderService.getByTableId(tableId!),
    enabled: !!tableId,
    refetchInterval: 10000,
  });

  if (!tableId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Empty description="Silakan scan QR code meja terlebih dahulu" />
        <button onClick={() => navigate("/")} className="mt-6 btn-primary">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 font-display">
          Pesanan Saya 📋
        </h1>
        <p className="text-gray-500 mt-1">Lihat status pesanan Anda</p>
      </div>

      {/* Orders List */}
      <OrderList
        orders={orders || []}
        loading={isLoading}
        onOrderClick={(order) => navigate(`/customer/order-status/${order.id}`)}
        showTable={false}
        emptyText="Belum ada pesanan"
      />
    </div>
  );
};

export default CustomerOrdersPage;
