import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import React, { useState } from "react";
import TableCard from "../../../components/molecules/TableCard";
import { tableService } from "../../../services/table.service";
import type {
  CreateTableRequest,
  Table,
  UpdateTableRequest,
} from "../../../types";

const TablesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [page] = useState(1);
  const [pageSize] = useState(50);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch tables
  const { data: tablesData, isLoading } = useQuery({
    queryKey: ["tables", page, pageSize],
    queryFn: () => tableService.getAll(page, pageSize),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTableRequest) => tableService.create(data),
    onSuccess: () => {
      message.success("Meja berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      handleCloseModal();
    },
    onError: () => {
      message.error("Gagal menambahkan meja");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableRequest }) =>
      tableService.update(id, data),
    onSuccess: () => {
      message.success("Meja berhasil diupdate");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      handleCloseModal();
    },
    onError: () => {
      message.error("Gagal mengupdate meja");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tableService.delete(id),
    onSuccess: () => {
      message.success("Meja berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: () => {
      message.error("Gagal menghapus meja");
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
    form.resetFields();
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    form.setFieldsValue({
      table_number: table.table_number,
      status: table.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (table: Table) => {
    deleteMutation.mutate(table.id);
  };

  const handleViewQR = async (table: Table) => {
    setSelectedTable(table);
    try {
      const blob = await tableService.getQRCode(table.id);
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
      setIsQRModalOpen(true);
    } catch (error) {
      message.error("Gagal memuat QR Code");
    }
  };

  const handleSubmit = async (
    values: CreateTableRequest | UpdateTableRequest
  ) => {
    if (editingTable) {
      updateMutation.mutate({
        id: editingTable.id,
        data: values as UpdateTableRequest,
      });
    } else {
      createMutation.mutate(values as CreateTableRequest);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl && selectedTable) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `QR-Meja-${selectedTable.table_number}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">
            Manajemen Meja
          </h1>
          <p className="text-gray-500">
            Kelola meja dan QR code untuk pemesanan
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="!rounded-xl !h-10"
        >
          Tambah Meja
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-gray-500 text-sm">Total Meja</p>
          <p className="text-2xl font-bold text-gray-800">
            {tablesData?.data?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-gray-500 text-sm">Tersedia</p>
          <p className="text-2xl font-bold text-green-600">
            {tablesData?.data?.filter((t) => t.status === "available").length ||
              0}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-gray-500 text-sm">Terisi</p>
          <p className="text-2xl font-bold text-orange-600">
            {tablesData?.data?.filter((t) => t.status === "occupied").length ||
              0}
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {tablesData?.data?.map((table, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={table.id}>
              <div
                className="animate-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCard
                  table={table}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewQR={handleViewQR}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={editingTable ? "Edit Meja" : "Tambah Meja Baru"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "available" }}
        >
          <Form.Item
            name="table_number"
            label="Nomor Meja"
            rules={[{ required: true, message: "Nomor meja wajib diisi" }]}
          >
            <InputNumber className="!w-full" min={1} placeholder="Contoh: 1" />
          </Form.Item>

          {editingTable && (
            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { value: "available", label: "Tersedia" },
                  { value: "occupied", label: "Terisi" },
                ]}
              />
            </Form.Item>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <Button onClick={handleCloseModal}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingTable ? "Simpan Perubahan" : "Tambah Meja"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title={`QR Code - Meja ${selectedTable?.table_number}`}
        open={isQRModalOpen}
        onCancel={() => {
          setIsQRModalOpen(false);
          if (qrCodeUrl) {
            URL.revokeObjectURL(qrCodeUrl);
          }
        }}
        footer={[
          <Button key="close" onClick={() => setIsQRModalOpen(false)}>
            Tutup
          </Button>,
          <Button key="download" type="primary" onClick={handleDownloadQR}>
            Download QR
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center py-6">
          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt={`QR Code Meja ${selectedTable?.table_number}`}
              className="w-64 h-64 border rounded-xl"
            />
          )}
          <p className="mt-4 text-center text-gray-500">
            Scan QR code ini untuk mengakses menu dan memesan
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TablesPage;
