import type { AllocationStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: AllocationStatus }) {
  return (
    <span
      className={cn(
        "govt-badge",
        status === "UNDER" && "status-under",
        status === "OVER" && "status-over",
        status === "OPTIMAL" && "status-optimal"
      )}
    >
      {status === "UNDER" ? "Under-Allocated" : status === "OVER" ? "Over-Allocated" : "Optimal"}
    </span>
  );
}

export function AESBadge({ score }: { score: number }) {
  const status: AllocationStatus = score < 0.9 ? "UNDER" : score > 1.1 ? "OVER" : "OPTIMAL";
  return (
    <span
      className={cn(
        "govt-badge font-mono",
        status === "UNDER" && "status-under",
        status === "OVER" && "status-over",
        status === "OPTIMAL" && "status-optimal"
      )}
    >
      AES {score.toFixed(2)}
    </span>
  );
}

export function KPICard({
  title, value, subtitle, variant = "default",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "danger" | "success" | "info" | "warning";
}) {
  const colors = {
    default: "border-l-primary",
    danger: "border-l-destructive",
    success: "border-l-success",
    info: "border-l-info",
    warning: "border-l-warning",
  };

  return (
    <div className={cn("kpi-card border-l-4 animate-fade-in", colors[variant])}>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold mt-1 font-serif">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}

export function SectorIcon({ sector }: { sector: string }) {
  const icons: Record<string, string> = {
    HEALTH: "🏥",
    EDUCATION: "📚",
    WATER: "💧",
    INFRASTRUCTURE: "🏗️",
  };
  return <span className="mr-1">{icons[sector] || "📊"}</span>;
}

export function formatCrores(value: number): string {
  return `₹${value.toLocaleString("en-IN")} Cr`;
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
