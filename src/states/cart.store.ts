import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Menu } from '../types';
import { STORAGE_KEYS } from '../configs/api';

interface CartState {
  items: CartItem[];
  tableId: string | null;
  setTableId: (tableId: string) => void;
  addItem: (menu: Menu, quantity?: number, notes?: string) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  updateNotes: (menuId: string, notes: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,

      setTableId: (tableId) => {
        set({ tableId });
      },

      addItem: (menu, quantity = 1, notes = '') => {
        set((state) => {
          const existingItem = state.items.find((item) => item.menu.id === menu.id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menu.id === menu.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { menu, quantity, notes }],
          };
        });
      },

      removeItem: (menuId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menu.id !== menuId),
        }));
      },

      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menu.id === menuId ? { ...item, quantity } : item
          ),
        }));
      },

      updateNotes: (menuId, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.menu.id === menuId ? { ...item, notes } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], tableId: null });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menu.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);
