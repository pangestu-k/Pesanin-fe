import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CartList from "../../../components/organisms/CartList";
import { useCartStore } from "../../../states/cart.store";
import { APP_CONFIG } from "../../../configs/api";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, tableId } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/customer/menu")}
          className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center hover:shadow-md transition-all"
        >
          <ArrowLeftOutlined />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">
            Keranjang Anda
          </h1>
          <p className="text-sm text-gray-500">{items.length} item</p>
        </div>
      </div>

      {/* Cart List */}
      <CartList />

      {/* Checkout Button */}
      {items.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 max-w-lg mx-auto">
          <button
            onClick={() => navigate("/customer/checkout")}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <ShoppingCartOutlined className="text-xl" />
            Lanjut Checkout • {formatPrice(getTotal())}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
