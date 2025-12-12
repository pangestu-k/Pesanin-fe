import React from "react";
import { Spin, Empty } from "antd";
import type { Order } from "../../types";
import OrderCard from "../molecules/OrderCard";

interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  onOrderClick?: (order: Order) => void;
  showTable?: boolean;
  emptyText?: string;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading = false,
  onOrderClick,
  showTable = true,
  emptyText = "Tidak ada pesanan",
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div
          key={order.id}
          className="animate-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <OrderCard
            order={order}
            onClick={onOrderClick}
            showTable={showTable}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderList;
