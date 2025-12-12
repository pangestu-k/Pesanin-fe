import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useUserStore } from "../../states/user.store";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useUserStore();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/admin/dashboard";

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      setAuth(response.user, response.token);
      message.success("Login berhasil!");
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err.response?.data?.message ||
          "Login gagal. Periksa email dan password Anda."
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
          Selamat Datang
        </h1>
        <p className="text-gray-500 mt-2">Masuk ke panel admin Pesanin</p>
      </div>

      {/* Login Form */}
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Masukkan email Anda" },
            { type: "email", message: "Email tidak valid" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email"
            size="large"
            className="!py-3 !rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Masukkan password Anda" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
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
              "Masuk"
            )}
          </button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
        <p className="text-xs text-gray-400">
          &copy; 2024 Pesanin. Sistem Pemesanan Restoran.
        </p>
      </div>
    </div>
  );
};

export default Login;
