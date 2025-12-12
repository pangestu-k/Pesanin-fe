import React from "react";
import { Spin, Empty } from "antd";
import type { Menu } from "../../types";
import MenuCard from "../molecules/MenuCard";

interface MenuGridProps {
  menus: Menu[];
  loading?: boolean;
  variant?: "grid" | "list";
  showActions?: boolean;
  onViewMenu?: (menu: Menu) => void;
  emptyText?: string;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  menus,
  loading = false,
  variant = "grid",
  showActions = true,
  onViewMenu,
  emptyText = "Tidak ada menu tersedia",
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty description={emptyText} />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {menus.map((menu, index) => (
          <div
            key={menu.id}
            className="animate-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MenuCard
              menu={menu}
              variant="list"
              showActions={showActions}
              onView={onViewMenu}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {menus.map((menu, index) => (
        <div
          key={menu.id}
          className="animate-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MenuCard
            menu={menu}
            variant="grid"
            showActions={showActions}
            onView={onViewMenu}
          />
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
