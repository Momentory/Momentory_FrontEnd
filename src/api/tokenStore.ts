// src/store/tokenStore.ts
import { create } from "zustand";

interface TokenState {
  access: string | null;
  refresh: string | null;
  setAccess: (token: string) => void;
  setRefresh: (token: string) => void;
  getAccess: () => string | null;
  getRefresh: () => string | null;
}

export const tokenStore = create<TokenState>((set, get) => ({
  access: null,
  refresh: null,
  setAccess: (token) => set({ access: token }),
  setRefresh: (token) => set({ refresh: token }),
  getAccess: () => get().access,
  getRefresh: () => get().refresh,
}));
