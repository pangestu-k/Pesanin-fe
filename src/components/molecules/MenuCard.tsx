import React from "react";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { APP_CONFIG, API_CONFIG } from "../../configs/api";
import { Menu } from "../../types";
import { useCartStore } from "../../states/cart.store";

interface MenuCardProps {
  menu: Menu;
  variant?: "grid" | "list";
  showActions?: boolean;
  onView?: (menu: Menu) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  variant = "grid",
  showActions = true,
  onView,
}) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.menu.id === menu.id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder-food.jpg";
    if (url.startsWith("http")) return url;
    return `${API_CONFIG.BASE_URL}${url}`;
  };

  if (variant === "list") {
    return (
      <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-card card-hover">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={getImageUrl(menu.image_url)}
            alt={menu.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/96?text=Menu";
            }}
          />
          {!menu.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Habis</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{menu.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {menu.description}
          </p>
          <p className="text-primary-600 font-bold mt-2">
            {formatPrice(menu.price)}
          </p>
        </div>

        {/* Actions */}
        {showActions && menu.is_available && (
          <div className="flex flex-col items-end justify-between">
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(menu.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  {quantity === 1 ? (
                    <DeleteOutlined className="text-red-500" />
                  ) : (
                    <MinusOutlined />
                  )}
                </button>
                <span className="w-8 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => addItem(menu, 1)}
                  className="w-8 h-8 rounded-lg gradient-primary text-white flex items-center justify-center hover:shadow-lg transition-all"
                >
                  <PlusOutlined />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(menu, 1)}
                className="px-4 py-2 gradient-primary text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Tambah
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Grid variant
  return (
    <div
      className="bg-white rounded-2xl shadow-card overflow-hidden card-hover cursor-pointer"
      onClick={() => onView?.(menu)}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={getImageUrl(menu.image_url)}
          alt={menu.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x160?text=Menu";
          }}
        />
        {!menu.is_available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-medium">Stok Habis</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 rounded-lg">
            {menu.category?.name || "Menu"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{menu.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">
          {menu.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-bold text-primary-600">
            {formatPrice(menu.price)}
          </p>

          {showActions && menu.is_available && (
            <>
              {quantity > 0 ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(menu.id, quantity - 1);
                    }}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    {quantity === 1 ? (
                      <DeleteOutlined className="text-red-500 text-xs" />
                    ) : (
                      <MinusOutlined className="text-xs" />
                    )}
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(menu, 1);
                    }}
                    className="w-8 h-8 rounded-lg gradient-primary text-white flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    <PlusOutlined className="text-xs" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(menu, 1);
                  }}
                  className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center hover:shadow-lg transition-all"
                >
                  <PlusOutlined />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
