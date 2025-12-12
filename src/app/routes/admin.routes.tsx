import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { AuthProvider } from "../providers/AuthProvider";

// Admin Pages
import Dashboard from "../../pages/admin/dashboard";
import MenuPage from "../../pages/admin/menu";
import OrdersPage from "../../pages/admin/orders";
import TablesPage from "../../pages/admin/tables";
import ReportsPage from "../../pages/admin/reports";

const AdminRoutes: React.FC = () => {
  return (
    <AuthProvider
      requireAuth={true}
      allowedRoles={["admin", "kasir", "waiter"]}
    >
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default AdminRoutes;
