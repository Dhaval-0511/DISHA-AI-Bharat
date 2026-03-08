import { create } from "zustand";
import type { User, NeedIndexWeights } from "@/types";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  weights: NeedIndexWeights;
  login: (user: User) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setWeights: (w: NeedIndexWeights) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  sidebarOpen: true,
  weights: { w1: 0.3, w2: 0.25, w3: 0.25, w4: 0.2 },
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setWeights: (weights) => set({ weights }),
}));
