import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";

import { QueryProvider } from "./app/providers/QueryProvider";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import AdminRoutes from "./app/routes/admin.routes";
import CustomerRoutes from "./app/routes/customer.routes";
import { useUserStore } from "./states/user.store";

// Home component - redirects based on context
const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-purple-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-md">
        <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-xl">
          <span className="text-white font-bold text-4xl font-display">P</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 font-display mb-2">
          Selamat Datang di Pesanin
        </h1>
        <p className="text-gray-600 mb-8">
          Sistem pemesanan restoran berbasis QR Code
        </p>

        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full py-4 rounded-2xl gradient-primary text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            Login Admin
          </a>
          <p className="text-sm text-gray-500">
            Untuk pelanggan, silakan scan QR Code di meja Anda
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={idID}
      theme={{
        token: {
          colorPrimary: "#f97316",
          borderRadius: 12,
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
    >
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Customer Routes */}
            <Route path="/customer/*" element={<CustomerRoutes />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </ConfigProvider>
  );
};

export default App;
