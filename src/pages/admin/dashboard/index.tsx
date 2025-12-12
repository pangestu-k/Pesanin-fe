import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  TableOutlined,
  AppstoreOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "../../../services/report.service";
import { orderService } from "../../../services/order.service";
import { APP_CONFIG } from "../../../configs/api";

const Dashboard: React.FC = () => {
  const { data: dailyReport } = useQuery({
    queryKey: ["dailySales"],
    queryFn: () => reportService.getDailySales(),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: () => orderService.getAll(1, 5),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    {
      title: "Pendapatan Hari Ini",
      value: dailyReport?.total_revenue || 0,
      prefix: <DollarOutlined />,
      suffix: null,
      formatter: formatPrice,
      color: "from-green-400 to-emerald-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pesanan Hari Ini",
      value: dailyReport?.total_orders || 0,
      prefix: <ShoppingCartOutlined />,
      suffix: "pesanan",
      color: "from-blue-400 to-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pesanan Pending",
      value: dailyReport?.orders_by_status?.pending || 0,
      prefix: <ClockCircleOutlined />,
      suffix: "menunggu",
      color: "from-orange-400 to-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Meja Aktif",
      value: ordersData?.pagination?.total || 0,
      prefix: <TableOutlined />,
      suffix: "aktif",
      color: "from-purple-400 to-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">
              Selamat Datang! 👋
            </h1>
            <p className="text-white/80 mt-1">
              Berikut ringkasan aktivitas restoran Anda hari ini
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <AppstoreOutlined />
            <span className="font-medium">Pesanin Dashboard</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="!rounded-2xl !border-0 shadow-card card-hover h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {stat.formatter ? stat.formatter(stat.value) : stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-sm text-gray-400">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <ArrowUpOutlined className="text-xs" />
                    <span>12% dari kemarin</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <span className={`text-xl ${stat.iconColor}`}>
                    {stat.prefix}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Orders & Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span className="font-semibold text-gray-800">
                Pesanan Terbaru
              </span>
            }
            className="!rounded-2xl !border-0 shadow-card"
          >
            {ordersData?.data && ordersData.data.length > 0 ? (
              <div className="space-y-4">
                {ordersData.data.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <TableOutlined className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Meja {order.table?.table_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.order_items?.length || 0} item
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full status-${order.status}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada pesanan hari ini
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <span className="font-semibold text-gray-800">Aksi Cepat</span>
            }
            className="!rounded-2xl !border-0 shadow-card h-full"
          >
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors">
                <AppstoreOutlined className="text-xl" />
                <span className="font-medium">Tambah Menu Baru</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                <TableOutlined className="text-xl" />
                <span className="font-medium">Tambah Meja</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                <ShoppingCartOutlined className="text-xl" />
                <span className="font-medium">Lihat Semua Pesanan</span>
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
