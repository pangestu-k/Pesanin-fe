import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";

// Customer Pages
import ScanPage from "../../pages/customer/scan";
import MenuPage from "../../pages/customer/menu";
import CartPage from "../../pages/customer/cart";
import CheckoutPage from "../../pages/customer/checkout";
import OrderStatusPage from "../../pages/customer/order-status";
import OrdersPage from "../../pages/customer/orders";

const CustomerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="scan/:tableId" element={<ScanPage />} />
      <Route element={<CustomerLayout />}>
        <Route index element={<Navigate to="menu" replace />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-status/:orderId" element={<OrderStatusPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
