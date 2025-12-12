import React, { useState } from "react";
import { Spin, Empty, Segmented } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { menuService } from "../../../services/menu.service";
import { categoryService } from "../../../services/category.service";
import MenuGrid from "../../../components/organisms/MenuGrid";

const CustomerMenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch menus
  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ["publicMenus", selectedCategory],
    queryFn: () => menuService.getAvailable(selectedCategory),
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const isLoading = menusLoading || categoriesLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 font-display">
          Menu Kami 🍽️
        </h1>
        <p className="text-gray-500 mt-1">Pilih menu favorit Anda</p>
      </div>

      {/* View Toggle & Categories */}
      <div className="space-y-4">
        {/* View Mode */}
        <div className="flex justify-end">
          <Segmented
            options={[
              { value: "grid", icon: <AppstoreOutlined /> },
              { value: "list", icon: <UnorderedListOutlined /> },
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value as "grid" | "list")}
          />
        </div>

        {/* Category Pills */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === ""
                  ? "gradient-primary text-white shadow-lg"
                  : "bg-white text-gray-600 shadow-card hover:shadow-md"
              }`}
            >
              Semua
            </button>
            {!categoriesLoading &&
              categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "gradient-primary text-white shadow-lg"
                      : "bg-white text-gray-600 shadow-card hover:shadow-md"
                  }`}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Menu Grid/List */}
      <MenuGrid
        menus={menus || []}
        loading={isLoading}
        variant={viewMode}
        showActions={true}
        emptyText="Tidak ada menu tersedia saat ini"
      />
    </div>
  );
};

export default CustomerMenuPage;
