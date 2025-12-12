import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, message } from "antd";
import {
  ArrowLeftOutlined,
  SendOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "../../../services/order.service";
import { useCartStore } from "../../../states/cart.store";
import { APP_CONFIG, API_CONFIG } from "../../../configs/api";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const { items, tableId, getTotal, clearCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/60?text=Menu";
    if (url.startsWith("http")) return url;
    return `${API_CONFIG.BASE_URL}${url}`;
  };

  const createOrderMutation = useMutation({
    mutationFn: () =>
      orderService.create({
        table_id: tableId!,
        notes,
        items: items.map((item) => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
          notes: item.notes,
        })),
      }),
    onSuccess: (order) => {
      message.success("Pesanan berhasil dibuat!");
      clearCart();
      navigate(`/customer/order-status/${order.id}`, { replace: true });
    },
    onError: () => {
      message.error("Gagal membuat pesanan. Silakan coba lagi.");
    },
  });

  const handleSubmit = () => {
    if (!tableId) {
      message.error("Silakan scan QR code meja terlebih dahulu");
      navigate("/");
      return;
    }

    if (items.length === 0) {
      message.error("Keranjang masih kosong");
      navigate("/customer/menu");
      return;
    }

    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    navigate("/customer/menu");
    return null;
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/customer/cart")}
          className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center hover:shadow-md transition-all"
        >
          <ArrowLeftOutlined />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">
            Konfirmasi Pesanan
          </h1>
          <p className="text-sm text-gray-500">Periksa pesanan Anda</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.menu.id} className="flex items-center gap-3">
              <img
                src={getImageUrl(item.menu.image_url)}
                alt={item.menu.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/48?text=Menu";
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">
                  {item.menu.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity}x @ {formatPrice(item.menu.price)}
                </p>
              </div>
              <span className="font-semibold text-primary-600">
                {formatPrice(item.menu.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Catatan (Opsional)</h3>
        <Input.TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Contoh: Tidak pedas, tanpa bawang, dll."
          rows={3}
          className="!rounded-xl"
        />
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/80">Subtotal</span>
          <span>{formatPrice(getTotal())}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(getTotal())}</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 max-w-lg mx-auto">
        <button
          onClick={handleSubmit}
          disabled={createOrderMutation.isPending}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createOrderMutation.isPending ? (
            <>
              <LoadingOutlined className="animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <SendOutlined />
              Pesan Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
