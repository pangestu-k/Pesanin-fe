import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Badge } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TableOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useUserStore } from "../states/user.store";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/menu",
      icon: <AppstoreOutlined />,
      label: "Menu",
    },
    {
      key: "/admin/orders",
      icon: <ShoppingOutlined />,
      label: "Pesanan",
    },
    {
      key: "/admin/tables",
      icon: <TableOutlined />,
      label: "Meja",
    },
    {
      key: "/admin/reports",
      icon: <FileTextOutlined />,
      label: "Laporan",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil",
      onClick: () => navigate("/admin/profile"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Keluar",
      danger: true,
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-white shadow-lg"
        width={260}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-gradient font-display">
                Pesanin
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none mt-4 px-2"
          style={{ background: "transparent" }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout
        style={{ marginLeft: collapsed ? 80 : 260, transition: "all 0.2s" }}
      >
        {/* Header */}
        <Header className="!bg-white !px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {collapsed ? (
                <MenuUnfoldOutlined className="text-lg text-gray-600" />
              ) : (
                <MenuFoldOutlined className="text-lg text-gray-600" />
              )}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {menuItems.find((item) => item.key === location.pathname)
                  ?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Badge count={3} size="small">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <BellOutlined className="text-lg text-gray-600" />
              </button>
            </Badge>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors">
                <Avatar className="gradient-primary" icon={<UserOutlined />} />
                {!collapsed && (
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="m-6 p-6 bg-white rounded-2xl shadow-sm min-h-[calc(100vh-120px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
