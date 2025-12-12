import React from "react";
import { Empty } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { APP_CONFIG, API_CONFIG } from "../../configs/api";
import { useCartStore } from "../../states/cart.store";

const CartList: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Empty
          description={
            <span className="text-gray-500">Keranjang Anda masih kosong</span>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cart Items */}
      {items.map((item, index) => (
        <div
          key={item.menu.id}
          className="flex gap-4 p-4 bg-white rounded-2xl shadow-card animate-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Image */}
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={getImageUrl(item.menu.image_url)}
              alt={item.menu.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/80?text=Menu";
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">
              {item.menu.name}
            </h3>
            <p className="text-primary-600 font-bold mt-1">
              {formatPrice(item.menu.price)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Subtotal: {formatPrice(item.menu.price * item.quantity)}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col items-end justify-between">
            <button
              onClick={() => removeItem(item.menu.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <DeleteOutlined />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <MinusOutlined className="text-xs" />
              </button>
              <span className="w-6 text-center font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg gradient-primary text-white flex items-center justify-center hover:shadow-lg transition-all"
              >
                <PlusOutlined className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Total Section */}
      <div className="bg-white rounded-2xl shadow-card p-6 mt-6">
        <div className="flex items-center justify-between text-lg">
          <span className="text-gray-600">Total ({items.length} item)</span>
          <span className="text-2xl font-bold text-gradient">
            {formatPrice(getTotal())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartList;
