import React from "react";
import { Tag } from "antd";
import { ClockCircleOutlined, TableOutlined } from "@ant-design/icons";
import { Order } from "../../types";
import {
  APP_CONFIG,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../configs/api";

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
  showTable?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onClick,
  showTable = true,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString(APP_CONFIG.LOCALE, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(APP_CONFIG.LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return (
      ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] ||
      "default"
    );
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-card p-4 card-hover cursor-pointer border border-gray-100"
      onClick={() => onClick?.(order)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {showTable && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <TableOutlined className="text-primary-500" />
                <span className="font-medium">
                  Meja {order.table?.table_number}
                </span>
              </div>
            )}
          </div>
        </div>
        <Tag color={getStatusColor(order.status)} className="font-medium">
          {ORDER_STATUS_LABELS[
            order.status as keyof typeof ORDER_STATUS_LABELS
          ] || order.status}
        </Tag>
      </div>

      {/* Items Preview */}
      <div className="space-y-2 py-3 border-y border-gray-100">
        {order.order_items?.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600 truncate flex-1">
              {item.quantity}x {item.menu?.name || "Item"}
            </span>
            <span className="text-gray-800 font-medium ml-2">
              {formatPrice(item.subtotal)}
            </span>
          </div>
        ))}
        {order.order_items && order.order_items.length > 3 && (
          <p className="text-xs text-gray-400">
            +{order.order_items.length - 3} item lainnya
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <ClockCircleOutlined />
          <span>{formatTime(order.created_at)}</span>
          <span>•</span>
          <span>{formatDate(order.created_at)}</span>
        </div>
        <p className="text-lg font-bold text-primary-600">
          {formatPrice(order.total)}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
