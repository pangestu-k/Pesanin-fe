import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';
import { STORAGE_KEYS } from '../configs/api';
import { setItem, removeItem } from '../libs/storage';

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, token) => {
        // Simpan token juga ke storage terpisah untuk axios interceptor
        setItem(STORAGE_KEYS.TOKEN, token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        // Hapus token dari storage terpisah juga
        removeItem(STORAGE_KEYS.TOKEN);
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Setelah rehydrate, sync token ke storage terpisah jika ada
        if (state?.token) {
          setItem(STORAGE_KEYS.TOKEN, state.token);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
