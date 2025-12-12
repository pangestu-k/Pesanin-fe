import React, { useState } from "react";
import { Form, Input, Select, message } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined, MailOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useUserStore } from "../../states/user.store";
import type { RegisterRequest } from "../../types";

const { Option } = Select;

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;
      await authService.register(registerData);
      message.success("Registrasi berhasil! Silakan login.");
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err.response?.data?.message ||
          "Registrasi gagal. Periksa data yang Anda masukkan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-white font-bold text-4xl font-display">P</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 font-display">
          Daftar Akun
        </h1>
        <p className="text-gray-500 mt-2">Buat akun baru untuk Pesanin</p>
      </div>

      {/* Register Form */}
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Nama Lengkap"
          rules={[
            { required: true, message: "Masukkan nama lengkap Anda" },
            { min: 3, message: "Nama minimal 3 karakter" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Nama Lengkap"
            size="large"
            className="!py-3 !rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Masukkan email Anda" },
            { type: "email", message: "Email tidak valid" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Email"
            size="large"
            className="!py-3 !rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Pilih role Anda" }]}
        >
          <Select
            size="large"
            placeholder="Pilih Role"
            className="!rounded-xl"
            suffixIcon={<TeamOutlined className="text-gray-400" />}
          >
            <Option value="admin">Admin</Option>
            <Option value="kasir">Kasir</Option>
            <Option value="waiter">Waiter</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Masukkan password Anda" },
            { min: 6, message: "Password minimal 6 karakter" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            size="large"
            className="!py-3 !rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Konfirmasi Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Konfirmasi password Anda" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Password tidak cocok!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Konfirmasi Password"
            size="large"
            className="!py-3 !rounded-xl"
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingOutlined className="animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

