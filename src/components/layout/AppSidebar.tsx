import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, MapPin, BarChart3, Brain, Calculator,
  DollarSign, FileText, Upload, Settings, Users, ChevronLeft, ChevronRight, Shield
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "Analytics",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Districts",
    items: [
      { title: "Districts", url: "/districts", icon: MapPin },
      { title: "Allocations", url: "/allocations", icon: BarChart3 },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Need Index", url: "/need-index", icon: Calculator },
      { title: "Predictions", url: "/predictions", icon: Brain },
    ],
  },
  {
    label: "Simulator",
    items: [
      { title: "Budget Simulator", url: "/simulator", icon: DollarSign },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "AI Summaries", url: "/summaries", icon: FileText },
      { title: "Data Upload", url: "/upload", icon: Upload },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "User Management", url: "/admin/users", icon: Users },
    ],
  },
];

export function AppSidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 sticky top-0 z-30",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="font-serif font-bold text-sm text-sidebar-primary-foreground leading-none">DISHA</h1>
            <p className="text-[9px] text-sidebar-muted leading-tight mt-0.5 truncate">Smart Allocation Intelligence</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            {sidebarOpen && <div className="sidebar-section-label">{section.label}</div>}
            <div className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const active = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="h-10 flex items-center justify-center border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
