import { create } from "zustand";
import type { User, NeedIndexWeights, AESThresholds, Role } from "@/types";
import { mockUsers } from "@/data/mockData";

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  // Layout
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Settings
  weights: NeedIndexWeights;
  thresholds: AESThresholds;
  setWeights: (w: NeedIndexWeights) => void;
  setThresholds: (t: AESThresholds) => void;

  // User management
  addUser: (user: User) => void;
  updateUserRole: (userId: string, role: Role) => void;
  toggleUserStatus: (userId: string) => void;

  // Role checks
  isAdmin: () => boolean;
  isAnalystOrAdmin: () => boolean;
  canCompute: () => boolean;
  canManageUsers: () => boolean;
  canUpload: () => boolean;
  canViewSettings: () => boolean;
}

// Restore session from localStorage
function getStoredAuth(): { user: User | null; isAuthenticated: boolean } {
  try {
    const stored = localStorage.getItem("disha_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, isAuthenticated: true };
    }
  } catch { }
  return { user: null, isAuthenticated: false };
}

function getStoredUsers(): User[] {
  try {
    const stored = localStorage.getItem("disha_users");
    if (stored) {
      const parsed: User[] = JSON.parse(stored);
      // Always keep seed users fresh from mockData (prevents stale password bug)
      const seedIds = new Set(mockUsers.map(u => u.id));
      const extraUsers = parsed.filter(u => !seedIds.has(u.id)); // users added via SignUp/Admin UI
      return [...mockUsers, ...extraUsers];
    }
  } catch { }
  return [...mockUsers];
}

function getStoredWeights(): NeedIndexWeights {
  try {
    const stored = localStorage.getItem("disha_weights");
    if (stored) return JSON.parse(stored);
  } catch { }
  return { w1: 0.30, w2: 0.25, w3: 0.25, w4: 0.20 };
}

function getStoredThresholds(): AESThresholds {
  try {
    const stored = localStorage.getItem("disha_thresholds");
    if (stored) return JSON.parse(stored);
  } catch { }
  return { under: 0.90, over: 1.10 };
}

const storedAuth = getStoredAuth();

export const useAppStore = create<AppState>((set, get) => ({
  user: storedAuth.user,
  isAuthenticated: storedAuth.isAuthenticated,
  users: getStoredUsers(),
  sidebarOpen: true,
  weights: getStoredWeights(),
  thresholds: getStoredThresholds(),

  login: (email: string, password: string) => {
    const users = get().users;
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password" };
    if (found.status === "Inactive") return { success: false, error: "Account is deactivated. Contact administrator." };

    const safeUser: User = { ...found };
    set({ user: safeUser, isAuthenticated: true });
    localStorage.setItem("disha_auth", JSON.stringify({ user: safeUser }));
    return { success: true };
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("disha_auth");
  },

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  setWeights: (weights) => {
    set({ weights });
    localStorage.setItem("disha_weights", JSON.stringify(weights));
  },

  setThresholds: (thresholds) => {
    set({ thresholds });
    localStorage.setItem("disha_thresholds", JSON.stringify(thresholds));
  },

  addUser: (user) => {
    const users = [...get().users, user];
    set({ users });
    localStorage.setItem("disha_users", JSON.stringify(users));
  },

  updateUserRole: (userId, role) => {
    const users = get().users.map(u => u.id === userId ? { ...u, role } : u);
    set({ users });
    localStorage.setItem("disha_users", JSON.stringify(users));
  },

  toggleUserStatus: (userId) => {
    const users = get().users.map(u =>
      u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" as const : "Active" as const } : u
    );
    set({ users });
    localStorage.setItem("disha_users", JSON.stringify(users));
  },

  isAdmin: () => get().user?.role === "ADMIN",
  isAnalystOrAdmin: () => {
    const role = get().user?.role;
    return role === "ADMIN" || role === "ANALYST";
  },
  canCompute: () => {
    const role = get().user?.role;
    return role === "ADMIN" || role === "ANALYST";
  },
  canManageUsers: () => get().user?.role === "ADMIN",
  canUpload: () => get().user?.role === "ADMIN",
  canViewSettings: () => get().user?.role === "ADMIN",
}));
