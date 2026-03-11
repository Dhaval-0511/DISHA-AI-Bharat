import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, MapPin, BarChart3, Brain, Calculator,
  DollarSign, FileText, Upload, Settings, Users, ChevronLeft,
  ChevronRight, Shield, FileDown
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { sidebarOpen, toggleSidebar, user } = useAppStore();
  const location = useLocation();
  const role = user?.role;

  const navSections = [
    {
      label: "Analytics",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "ANALYST", "VIEWER"] },
      ],
    },
    {
      label: "Districts",
      items: [
        { title: "Districts", url: "/districts", icon: MapPin, roles: ["ADMIN", "ANALYST", "VIEWER"] },
        { title: "Allocations", url: "/allocations", icon: BarChart3, roles: ["ADMIN", "ANALYST", "VIEWER"] },
      ],
    },
    {
      label: "Intelligence",
      items: [
        { title: "Need Index", url: "/need-index", icon: Calculator, roles: ["ADMIN", "ANALYST", "VIEWER"] },
        { title: "Predictions", url: "/predictions", icon: Brain, roles: ["ADMIN", "ANALYST", "VIEWER"] },
      ],
    },
    {
      label: "Policy Tools",
      items: [
        { title: "AI Summaries", url: "/summaries", icon: FileText, roles: ["ADMIN", "ANALYST", "VIEWER"] },
        { title: "Simulator", url: "/simulator", icon: DollarSign, roles: ["ADMIN", "ANALYST"] },
      ],
    },
    {
      label: "Reports",
      items: [
        { title: "Reports", url: "/reports", icon: FileDown, roles: ["ADMIN", "ANALYST", "VIEWER"] },
      ],
    },
    {
      label: "Administration",
      items: [
        { title: "Data Upload", url: "/upload", icon: Upload, roles: ["ADMIN"] },
        { title: "Users", url: "/admin/users", icon: Users, roles: ["ADMIN"] },
        { title: "Settings", url: "/settings", icon: Settings, roles: ["ADMIN"] },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "h-screen flex flex-col sticky top-0 z-30 transition-all duration-300 border-r",
        sidebarOpen ? "w-56" : "w-14"
      )}
      style={{ background: "#1a2332", borderColor: "#263344" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 h-14 shrink-0" style={{ borderBottom: "1px solid #263344" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
          <Shield className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-white leading-none" style={{ fontFamily: "'Source Serif 4', serif" }}>DISHA</h1>
            <p className="text-[9px] leading-tight mt-0.5 truncate" style={{ color: "#64748b" }}>National Health Platform</p>
          </div>
        )}
      </div>

      {/* Nav — no overflow, compact spacing */}
      <nav className="flex-1 py-2">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(item => role && item.roles.includes(role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label} className="mb-1">
              {sidebarOpen && (
                <div className="px-3 pt-2 pb-1 text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ color: "#4b5e73" }}>
                  {section.label}
                </div>
              )}
              <div className="px-2">
                {visibleItems.map((item) => {
                  const active = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                  return (
                    <Link
                      key={item.url}
                      to={item.url}
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-all duration-150",
                        active
                          ? "font-medium"
                          : "hover:bg-white/[0.06]"
                      )}
                      style={active
                        ? { background: "rgba(245,158,11,0.12)", color: "#f59e0b" }
                        : { color: "#94a3b8" }
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" style={active ? { color: "#f59e0b" } : { color: "#64748b" }} />
                      {sidebarOpen && <span className="truncate">{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="h-10 flex items-center justify-center shrink-0 transition-colors"
        style={{ borderTop: "1px solid #263344", color: "#4b5e73" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
        onMouseLeave={e => (e.currentTarget.style.color = "#4b5e73")}
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
