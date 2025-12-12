import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Space,
  Tag,
  Popconfirm,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService } from "../../../services/menu.service";
import { categoryService } from "../../../services/category.service";
import { Menu, CreateMenuRequest, UpdateMenuRequest } from "../../../types";
import { APP_CONFIG, API_CONFIG } from "../../../configs/api";

const MenuPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch menus
  const { data: menusData, isLoading } = useQuery({
    queryKey: ["menus", page, pageSize, selectedCategory],
    queryFn: () => menuService.getAll(page, pageSize, selectedCategory),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateMenuRequest) => menuService.create(data),
    onSuccess: () => {
      message.success("Menu berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      handleCloseModal();
    },
    onError: () => {
      message.error("Gagal menambahkan menu");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuRequest }) =>
      menuService.update(id, data),
    onSuccess: () => {
      message.success("Menu berhasil diupdate");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      handleCloseModal();
    },
    onError: () => {
      message.error("Gagal mengupdate menu");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuService.delete(id),
    onSuccess: () => {
      message.success("Menu berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: () => {
      message.error("Gagal menghapus menu");
    },
  });

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      menuService.uploadImage(id, file),
    onSuccess: () => {
      message.success("Gambar berhasil diupload");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: () => {
      message.error("Gagal mengupload gambar");
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    form.resetFields();
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    form.setFieldsValue({
      name: menu.name,
      description: menu.description,
      category_id: menu.category_id,
      price: menu.price,
      stock: menu.stock,
      is_available: menu.is_available,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: CreateMenuRequest) => {
    if (editingMenu) {
      updateMutation.mutate({ id: editingMenu.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_CONFIG.BASE_URL}${url}`;
  };

  const columns = [
    {
      title: "Menu",
      key: "menu",
      render: (_: unknown, record: Menu) => (
        <div className="flex items-center gap-3">
          <Image
            src={
              getImageUrl(record.image_url) ||
              "https://via.placeholder.com/60?text=Menu"
            }
            alt={record.name}
            width={60}
            height={60}
            className="rounded-xl object-cover"
            fallback="https://via.placeholder.com/60?text=Menu"
          />
          <div>
            <p className="font-medium text-gray-800">{record.name}</p>
            <p className="text-sm text-gray-500 line-clamp-1">
              {record.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text: string) => <Tag color="blue">{text || "-"}</Tag>,
    },
    {
      title: "Harga",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-semibold text-primary-600">
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <span
          className={stock < 10 ? "text-red-500 font-medium" : "text-gray-600"}
        >
          {stock}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_available",
      key: "is_available",
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? "success" : "error"}>
          {isAvailable ? "Tersedia" : "Tidak Tersedia"}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_: unknown, record: Menu) => (
        <Space size="small">
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              uploadMutation.mutate({ id: record.id, file });
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} size="small" />
          </Upload>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Hapus menu ini?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">
            Manajemen Menu
          </h1>
          <p className="text-gray-500">
            Kelola menu makanan dan minuman restoran
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="!rounded-xl !h-10"
        >
          Tambah Menu
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Cari menu..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="!rounded-xl md:w-64"
        />
        <Select
          placeholder="Semua Kategori"
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full md:w-48"
          allowClear
          options={[
            { value: "", label: "Semua Kategori" },
            ...(categories?.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })) || []),
          ]}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={menusData?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: menusData?.pagination?.total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} menu`,
        }}
      />

      {/* Modal */}
      <Modal
        title={editingMenu ? "Edit Menu" : "Tambah Menu Baru"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ is_available: true, stock: 0 }}
        >
          <Form.Item
            name="name"
            label="Nama Menu"
            rules={[{ required: true, message: "Nama menu wajib diisi" }]}
          >
            <Input placeholder="Contoh: Nasi Goreng Spesial" />
          </Form.Item>

          <Form.Item name="description" label="Deskripsi">
            <Input.TextArea rows={3} placeholder="Deskripsi menu..." />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Kategori"
            rules={[{ required: true, message: "Kategori wajib dipilih" }]}
          >
            <Select
              placeholder="Pilih kategori"
              options={categories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Harga"
              rules={[{ required: true, message: "Harga wajib diisi" }]}
            >
              <InputNumber
                className="!w-full"
                formatter={(value) =>
                  `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) =>
                  Number(value?.replace(/Rp\s?|(\.*)/g, "") || 0)
                }
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Stok"
              rules={[{ required: true, message: "Stok wajib diisi" }]}
            >
              <InputNumber className="!w-full" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="is_available" label="Status">
            <Select
              options={[
                { value: true, label: "Tersedia" },
                { value: false, label: "Tidak Tersedia" },
              ]}
            />
          </Form.Item>

          <div className="flex gap-3 justify-end mt-6">
            <Button onClick={handleCloseModal}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingMenu ? "Simpan Perubahan" : "Tambah Menu"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuPage;
