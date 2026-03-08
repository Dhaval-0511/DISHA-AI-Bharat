import { useAppStore } from "@/store/appStore";
import { Bell, LogOut } from "lucide-react";

export function TopBar() {
  const { user } = useAppStore();

  return (
    <header className="h-14 bg-card border-b flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      <div>
        <span className="text-xs text-muted-foreground font-medium">Government of India — Ministry of Finance</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 pl-4 border-l">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium leading-none">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
