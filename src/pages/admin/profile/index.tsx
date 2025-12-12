import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Avatar,
  Descriptions,
  Divider,
  Space,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../../services/auth.service";
import { useUserStore } from "../../../states/user.store";
import dayjs from "dayjs";

interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const Profile: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editingProfile, setEditingProfile] = useState(false);
  const { user: currentUser, updateUser } = useUserStore();
  const queryClient = useQueryClient();

  // Fetch current profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => authService.getProfile(),
    enabled: !!currentUser,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => {
      return authService.updateProfile(data);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(["userProfile"], updatedUser);
      message.success("Profil berhasil diperbarui!");
      setEditingProfile(false);
      profileForm.setFieldsValue({
        name: updatedUser.name,
        email: updatedUser.email,
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Gagal memperbarui profil");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) => {
      return authService.changePassword(data);
    },
    onSuccess: () => {
      message.success("Password berhasil diubah!");
      passwordForm.resetFields();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Gagal mengubah password");
    },
  });

  const handleProfileUpdate = (values: UpdateProfileRequest) => {
    updateProfileMutation.mutate(values);
  };

  const handlePasswordChange = (values: ChangePasswordRequest) => {
    if (values.new_password !== values.confirm_password) {
      message.error("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    changePasswordMutation.mutate({
      current_password: values.current_password,
      new_password: values.new_password,
    });
  };

  const displayUser = profile || currentUser;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profil Saya</h1>
        <p className="text-gray-500">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card className="shadow-sm">
          <div className="text-center">
            <Avatar
              size={100}
              className="gradient-primary mb-4"
              icon={<UserOutlined />}
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {displayUser?.name}
            </h2>
            <Tag
              color={
                displayUser?.role === "admin"
                  ? "red"
                  : displayUser?.role === "kasir"
                  ? "blue"
                  : "green"
              }
              className="mb-4"
            >
              {displayUser?.role?.toUpperCase()}
            </Tag>
            <p className="text-gray-500 text-sm">{displayUser?.email}</p>
          </div>

          <Divider />

          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">
              <span className="text-gray-600 font-mono text-xs">
                {displayUser?.id}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Dibuat">
              {displayUser?.created_at
                ? dayjs(displayUser.created_at * 1000).format(
                    "DD MMMM YYYY, HH:mm"
                  )
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Diperbarui">
              {displayUser?.updated_at
                ? dayjs(displayUser.updated_at * 1000).format(
                    "DD MMMM YYYY, HH:mm"
                  )
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Profile Edit Form */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserOutlined />
                Informasi Profil
              </span>
              {!editingProfile && (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingProfile(true);
                    profileForm.setFieldsValue({
                      name: displayUser?.name,
                      email: displayUser?.email,
                    });
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          }
          className="lg:col-span-2 shadow-sm"
        >
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
            initialValues={{
              name: displayUser?.name,
              email: displayUser?.email,
            }}
            disabled={!editingProfile}
          >
            <Form.Item
              name="name"
              label="Nama Lengkap"
              rules={[
                { required: true, message: "Masukkan nama lengkap" },
                { min: 3, message: "Nama minimal 3 karakter" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nama Lengkap"
                size="large"
                className="!rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Masukkan email" },
                { type: "email", message: "Email tidak valid" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                size="large"
                className="!rounded-xl"
              />
            </Form.Item>

            {editingProfile && (
              <Form.Item className="mb-0">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={updateProfileMutation.isPending}
                    className="rounded-xl"
                  >
                    Simpan Perubahan
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingProfile(false);
                      profileForm.resetFields();
                    }}
                    className="rounded-xl"
                  >
                    Batal
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Card>
      </div>

      {/* Change Password Card */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <LockOutlined />
            Ubah Password
          </span>
        }
        className="shadow-sm"
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="current_password"
            label="Password Saat Ini"
            rules={[{ required: true, message: "Masukkan password saat ini" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password Saat Ini"
              size="large"
              className="!rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="Password Baru"
            rules={[
              { required: true, message: "Masukkan password baru" },
              { min: 6, message: "Password minimal 6 karakter" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password Baru"
              size="large"
              className="!rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Konfirmasi Password Baru"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Konfirmasi password baru" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password tidak cocok!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Konfirmasi Password Baru"
              size="large"
              className="!rounded-xl"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={changePasswordMutation.isPending}
              className="rounded-xl"
            >
              Ubah Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
