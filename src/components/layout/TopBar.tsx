import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, User, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TopBar() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast({ title: "Signed Out", description: "You have been logged out." });
    navigate("/");
  };

  const roleColor: Record<string, { bg: string; text: string; dot: string }> = {
    ADMIN: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
    ANALYST: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
    VIEWER: { bg: "#f1f5f9", text: "#475569", dot: "#64748b" },
  };
  const rc = roleColor[user?.role ?? "VIEWER"];

  return (
    <header className="h-14 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 border-b"
      style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
    >
      {/* Left: Branding */}
      <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
        Government of India — National Health Intelligence Platform
      </span>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="relative p-2 rounded-lg transition-colors" style={{ color: "#94a3b8" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#475569"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        </button>

        <div className="h-6 w-px" style={{ backgroundColor: "#e2e8f0" }} />

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
            style={{ background: menuOpen ? "#f1f5f9" : "transparent" }}
            onMouseEnter={e => { if (!menuOpen) e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = "transparent"; }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium leading-none" style={{ color: "#1e293b" }}>{user?.name}</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5"
                style={{ background: rc.bg, color: rc.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rc.dot }} />
                {user?.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden sm:block transition-transform"
              style={{ color: "#94a3b8", transform: menuOpen ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b" style={{ borderColor: "#f1f5f9" }}>
                <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{user?.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{user?.email}</p>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold mt-1.5"
                  style={{ background: rc.bg, color: rc.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rc.dot }} />
                  {user?.role}
                </span>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left"
                  style={{ color: "#334155" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <User className="w-4 h-4" style={{ color: "#64748b" }} />
                  Profile
                </button>
              </div>

              <div className="border-t mx-2" style={{ borderColor: "#f1f5f9" }} />

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left"
                  style={{ color: "#ef4444" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
