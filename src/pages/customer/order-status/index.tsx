import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Tag, Timeline, Empty } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../../services/order.service";
import {
  APP_CONFIG,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../../configs/api";

const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orderStatus", orderId],
    queryFn: () => orderService.getStatus(orderId!),
    enabled: !!orderId,
    refetchInterval: 5000, // Auto refresh every 5 seconds
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined className="text-yellow-500" />;
      case "paid":
        return <DollarOutlined className="text-blue-500" />;
      case "cooking":
        return <FireOutlined className="text-orange-500" />;
      case "done":
        return <CheckCircleOutlined className="text-green-500" />;
      case "cancelled":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getTimelineItems = () => {
    const statuses = ["pending", "paid", "cooking", "done"];
    const currentIndex = statuses.indexOf(order?.status || "pending");

    if (order?.status === "cancelled") {
      return [
        {
          color: "red",
          dot: <CloseCircleOutlined className="text-red-500" />,
          children: (
            <div>
              <p className="font-medium text-red-600">Pesanan Dibatalkan</p>
              <p className="text-sm text-gray-500">Pesanan telah dibatalkan</p>
            </div>
          ),
        },
      ];
    }

    return [
      {
        color: currentIndex >= 0 ? "orange" : "gray",
        dot:
          currentIndex >= 0 ? (
            <ClockCircleOutlined className="text-yellow-500" />
          ) : undefined,
        children: (
          <div className={currentIndex >= 0 ? "" : "opacity-50"}>
            <p className="font-medium">Pesanan Diterima</p>
            <p className="text-sm text-gray-500">Menunggu pembayaran</p>
          </div>
        ),
      },
      {
        color: currentIndex >= 1 ? "blue" : "gray",
        dot:
          currentIndex >= 1 ? (
            <DollarOutlined className="text-blue-500" />
          ) : undefined,
        children: (
          <div className={currentIndex >= 1 ? "" : "opacity-50"}>
            <p className="font-medium">Pembayaran Diterima</p>
            <p className="text-sm text-gray-500">Pesanan sedang diproses</p>
          </div>
        ),
      },
      {
        color: currentIndex >= 2 ? "orange" : "gray",
        dot:
          currentIndex >= 2 ? (
            <FireOutlined className="text-orange-500" />
          ) : undefined,
        children: (
          <div className={currentIndex >= 2 ? "" : "opacity-50"}>
            <p className="font-medium">Sedang Dimasak</p>
            <p className="text-sm text-gray-500">
              Chef sedang menyiapkan pesanan Anda
            </p>
          </div>
        ),
      },
      {
        color: currentIndex >= 3 ? "green" : "gray",
        dot:
          currentIndex >= 3 ? (
            <CheckCircleOutlined className="text-green-500" />
          ) : undefined,
        children: (
          <div className={currentIndex >= 3 ? "" : "opacity-50"}>
            <p className="font-medium">Pesanan Selesai</p>
            <p className="text-sm text-gray-500">Selamat menikmati!</p>
          </div>
        ),
      },
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Empty description="Pesanan tidak ditemukan" />
        <button
          onClick={() => navigate("/customer/menu")}
          className="mt-6 btn-primary"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{
            background:
              order.status === "done"
                ? "linear-gradient(135deg, #10b981, #047857)"
                : order.status === "cancelled"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #f97316, #ea580c)",
          }}
        >
          {getStatusIcon(order.status)}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 font-display">
          {order.status === "done"
            ? "Pesanan Selesai! 🎉"
            : order.status === "cancelled"
            ? "Pesanan Dibatalkan"
            : "Pesanan Anda Sedang Diproses"}
        </h1>
        <p className="text-gray-500 mt-1 font-mono">
          #{order.id.slice(-8).toUpperCase()}
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <Tag
          color={
            ORDER_STATUS_COLORS[
              order.status as keyof typeof ORDER_STATUS_COLORS
            ]
          }
          className="!text-base !px-4 !py-1 font-medium"
        >
          {
            ORDER_STATUS_LABELS[
              order.status as keyof typeof ORDER_STATUS_LABELS
            ]
          }
        </Tag>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Status Pesanan</h3>
        <Timeline items={getTimelineItems()} />
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Detail Pesanan</h3>
        <div className="space-y-3">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{item.menu?.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity}x @ {formatPrice(item.menu?.price || 0)}
                </p>
              </div>
              <span className="font-semibold text-primary-600">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex items-center justify-between">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      {/* Back to Menu */}
      <button
        onClick={() => navigate("/customer/menu")}
        className="w-full py-4 rounded-2xl bg-white text-primary-600 font-semibold text-lg shadow-card hover:shadow-md transition-all flex items-center justify-center gap-2"
      >
        <HomeOutlined />
        Kembali ke Menu
      </button>
    </div>
  );
};

export default OrderStatusPage;
