import React, { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Select,
  Modal,
  message,
  Space,
  Descriptions,
  Timeline,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FireOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../../services/order.service";
import { Order } from "../../../types";
import {
  APP_CONFIG,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../../configs/api";

const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", page, pageSize, statusFilter],
    queryFn: () => orderService.getAll(page, pageSize, statusFilter),
    refetchInterval: 10000, // Auto refresh every 10 seconds
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      message.success("Status pesanan berhasil diupdate");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      message.error("Gagal mengupdate status");
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(APP_CONFIG.LOCALE, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const getNextStatus = (currentStatus: string): Order["status"] | null => {
    const flow: Record<string, Order["status"]> = {
      pending: "paid",
      paid: "cooking",
      cooking: "done",
    };
    return flow[currentStatus] || null;
  };

  const getStatusColor = (status: string) => {
    return (
      ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] ||
      "default"
    );
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <span className="font-mono text-sm">#{id.slice(-8).toUpperCase()}</span>
      ),
    },
    {
      title: "Meja",
      key: "table",
      render: (_: unknown, record: Order) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {record.table?.table_number}
            </span>
          </div>
          <span>Meja {record.table?.table_number}</span>
        </div>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_: unknown, record: Order) => (
        <div>
          <span className="font-medium">
            {record.order_items?.length || 0} item
          </span>
          <p className="text-xs text-gray-500 line-clamp-1">
            {record.order_items?.map((item) => item.menu?.name).join(", ")}
          </p>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-bold text-primary-600">{formatPrice(total)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="font-medium">
          {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ||
            status}
        </Tag>
      ),
    },
    {
      title: "Waktu",
      dataIndex: "created_at",
      key: "created_at",
      render: (timestamp: number) => (
        <span className="text-sm text-gray-500">
          {formatDateTime(timestamp)}
        </span>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: unknown, record: Order) => {
        const nextStatus = getNextStatus(record.status);
        return (
          <Space size="small">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedOrder(record);
                setIsDetailModalOpen(true);
              }}
            />
            {nextStatus &&
              record.status !== "cancelled" &&
              record.status !== "done" && (
                <Button
                  type="primary"
                  icon={
                    nextStatus === "cooking" ? (
                      <FireOutlined />
                    ) : (
                      <CheckOutlined />
                    )
                  }
                  size="small"
                  onClick={() => handleStatusChange(record.id, nextStatus)}
                  loading={updateStatusMutation.isPending}
                >
                  {nextStatus === "paid" && "Bayar"}
                  {nextStatus === "cooking" && "Masak"}
                  {nextStatus === "done" && "Selesai"}
                </Button>
              )}
            {record.status === "pending" && (
              <Button
                icon={<CloseOutlined />}
                size="small"
                danger
                onClick={() => handleStatusChange(record.id, "cancelled")}
              />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">
            Manajemen Pesanan
          </h1>
          <p className="text-gray-500">Kelola dan pantau pesanan pelanggan</p>
        </div>

        {/* Status Quick Filter */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(ORDER_STATUS).map(([key, value]) => (
            <button
              key={key}
              onClick={() =>
                setStatusFilter(statusFilter === value ? "" : value)
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === value
                  ? "gradient-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {ORDER_STATUS_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={ordersData?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: ordersData?.pagination?.total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} pesanan`,
        }}
        rowClassName={(record) =>
          record.status === "pending" ? "bg-yellow-50" : ""
        }
      />

      {/* Order Detail Modal */}
      <Modal
        title="Detail Pesanan"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Order ID" span={2}>
                <span className="font-mono">
                  #{selectedOrder.id.slice(-8).toUpperCase()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Meja">
                Meja {selectedOrder.table?.table_number}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {
                    ORDER_STATUS_LABELS[
                      selectedOrder.status as keyof typeof ORDER_STATUS_LABELS
                    ]
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Waktu Pesanan" span={2}>
                {formatDateTime(selectedOrder.created_at)}
              </Descriptions.Item>
              {selectedOrder.notes && (
                <Descriptions.Item label="Catatan" span={2}>
                  {selectedOrder.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Item Pesanan</h4>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{item.menu?.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity}x @ {formatPrice(item.menu?.price || 0)}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-orange-600">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-primary-600">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
              <span className="text-lg font-semibold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(selectedOrder.total)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
