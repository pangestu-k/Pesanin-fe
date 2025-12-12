import React, { useState } from "react";
import { Card, DatePicker, Row, Col, Statistic, Table, Select } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "../../../services/report.service";
import { APP_CONFIG } from "../../../configs/api";
import dayjs from "dayjs";

const ReportsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // Fetch daily report
  const { data: dailyReport, isLoading: dailyLoading } = useQuery({
    queryKey: ["dailySales", selectedDate.format("YYYY-MM-DD")],
    queryFn: () =>
      reportService.getDailySales(selectedDate.format("YYYY-MM-DD")),
  });

  // Fetch monthly report
  const { data: monthlyReport, isLoading: monthlyLoading } = useQuery({
    queryKey: ["monthlySales", selectedYear, selectedMonth],
    queryFn: () => reportService.getMonthlySales(selectedYear, selectedMonth),
  });

  // Fetch transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => reportService.getTransactions(),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const transactionColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <span className="font-mono text-sm">#{id.slice(-8)}</span>
      ),
    },
    {
      title: "Meja",
      dataIndex: "table_number",
      key: "table_number",
      render: (num: number) => `Meja ${num}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-semibold text-primary-600">
          {formatPrice(total)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium status-${status}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Metode",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (method: string) => method || "-",
    },
    {
      title: "Waktu",
      dataIndex: "created_at",
      key: "created_at",
      render: (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString(APP_CONFIG.LOCALE, {
          dateStyle: "short",
          timeStyle: "short",
        });
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 font-display">
          Laporan Penjualan
        </h1>
        <p className="text-gray-500">Pantau performa penjualan restoran Anda</p>
      </div>

      {/* Daily Report */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold">Laporan Harian</span>
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              format="DD MMM YYYY"
            />
          </div>
        }
        className="!rounded-2xl"
        loading={dailyLoading}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-white">
              <DollarOutlined className="text-3xl mb-3 opacity-80" />
              <p className="text-white/80 text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold">
                {formatPrice(dailyReport?.total_revenue || 0)}
              </p>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 text-white">
              <ShoppingCartOutlined className="text-3xl mb-3 opacity-80" />
              <p className="text-white/80 text-sm">Total Pesanan</p>
              <p className="text-2xl font-bold">
                {dailyReport?.total_orders || 0} pesanan
              </p>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl p-6 text-white">
              <RiseOutlined className="text-3xl mb-3 opacity-80" />
              <p className="text-white/80 text-sm">Rata-rata per Pesanan</p>
              <p className="text-2xl font-bold">
                {dailyReport?.total_orders
                  ? formatPrice(
                      (dailyReport?.total_revenue || 0) /
                        dailyReport.total_orders
                    )
                  : "Rp 0"}
              </p>
            </div>
          </Col>
        </Row>

        {/* Status Breakdown */}
        {dailyReport?.orders_by_status && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium text-gray-500 mb-4">
              Breakdown Status
            </h4>
            <Row gutter={[16, 16]}>
              {Object.entries(dailyReport.orders_by_status).map(
                ([status, count]) => (
                  <Col xs={12} sm={6} key={status}>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-800">
                        {count as number}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {status}
                      </p>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </div>
        )}
      </Card>

      {/* Monthly Report */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold">Laporan Bulanan</span>
            <div className="flex gap-2">
              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={[
                  { value: 1, label: "Januari" },
                  { value: 2, label: "Februari" },
                  { value: 3, label: "Maret" },
                  { value: 4, label: "April" },
                  { value: 5, label: "Mei" },
                  { value: 6, label: "Juni" },
                  { value: 7, label: "Juli" },
                  { value: 8, label: "Agustus" },
                  { value: 9, label: "September" },
                  { value: 10, label: "Oktober" },
                  { value: 11, label: "November" },
                  { value: 12, label: "Desember" },
                ]}
                className="w-32"
              />
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                options={[
                  { value: 2024, label: "2024" },
                  { value: 2025, label: "2025" },
                ]}
                className="w-24"
              />
            </div>
          </div>
        }
        className="!rounded-2xl"
        loading={monthlyLoading}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12}>
            <Statistic
              title="Total Pendapatan"
              value={monthlyReport?.total_revenue || 0}
              formatter={(val) => formatPrice(val as number)}
            />
          </Col>
          <Col xs={12}>
            <Statistic
              title="Total Pesanan"
              value={monthlyReport?.total_orders || 0}
              suffix="pesanan"
            />
          </Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card
        title={<span className="font-semibold">Riwayat Transaksi</span>}
        className="!rounded-2xl"
      >
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          loading={transactionsLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ReportsPage;
