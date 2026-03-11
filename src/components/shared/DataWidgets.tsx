import type { AllocationStatus } from "@/types";
import { cn } from "@/lib/utils";

// ─── Status Badges ──────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: AllocationStatus | "INCREASE" | "DECREASE" | "SAME" }) {
  const config: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    UNDER:    { label: "Under-Allocated", bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
    OVER:     { label: "Over-Allocated",  bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
    OPTIMAL:  { label: "Optimal",         bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
    INCREASE: { label: "↑ Increase",      bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
    DECREASE: { label: "↓ Decrease",      bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
    SAME:     { label: "= Same",          bg: "#f8fafc", text: "#64748b", dot: "#94a3b8" },
  };
  const c = config[status] || config.OPTIMAL;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  );
}

export function AESBadge({ score }: { score: number }) {
  const status: AllocationStatus = score < 0.9 ? "UNDER" : score > 1.1 ? "OVER" : "OPTIMAL";
  const config = {
    UNDER:   { bg: "#fef2f2", text: "#dc2626" },
    OVER:    { bg: "#eff6ff", text: "#2563eb" },
    OPTIMAL: { bg: "#f0fdf4", text: "#16a34a" },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold"
      style={{ background: c.bg, color: c.text }}>
      {score.toFixed(3)}
    </span>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

const variantStyles = {
  default: { bar: "#1e3a5f", icon: "#eff6ff", iconColor: "#1e3a5f", value: "#0f172a" },
  danger:  { bar: "#ef4444", icon: "#fef2f2", iconColor: "#dc2626", value: "#dc2626" },
  success: { bar: "#22c55e", icon: "#f0fdf4", iconColor: "#16a34a", value: "#16a34a" },
  info:    { bar: "#3b82f6", icon: "#eff6ff", iconColor: "#2563eb", value: "#2563eb" },
  warning: { bar: "#f59e0b", icon: "#fffbeb", iconColor: "#d97706", value: "#d97706" },
};

export function KPICard({
  title, value, subtitle, variant = "default", icon, onClick,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "danger" | "success" | "info" | "warning";
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const s = variantStyles[variant];
  return (
    <div
      onClick={onClick}
      className={cn("relative rounded-xl border overflow-hidden transition-all duration-200", onClick && "cursor-pointer hover:shadow-lg")}
      style={{ background: "#ffffff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Colored top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: s.bar }} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>{title}</p>
          {icon && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.icon }}>
              <span style={{ color: s.iconColor }}>{icon}</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold mt-2" style={{ color: s.value, fontFamily: "'Source Serif 4', serif" }}>{value}</p>
        {subtitle && <p className="text-[11px] mt-1" style={{ color: "#94a3b8" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────

export function PageHeader({
  title, subtitle, children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold leading-tight" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          {title}
        </h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

export function SectionCard({
  title, subtitle, children, className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border", className)}
      style={{ background: "#ffffff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      {title && (
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f1f5f9" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#1e293b" }}>{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{subtitle}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Utility formatters ──────────────────────────────────────────────────────

export function formatCrores(value: number): string {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`;
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function NeedLevelBadge({ score }: { score: number }) {
  if (score >= 0.6) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#fef2f2", color: "#dc2626" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High
    </span>
  );
  if (score >= 0.3) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#fffbeb", color: "#d97706" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#f0fdf4", color: "#16a34a" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Low
    </span>
  );
}

export function UtilizationBadge({ rate }: { rate: number }) {
  if (rate < 0.6) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#fef2f2", color: "#dc2626" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Poor
    </span>
  );
  if (rate <= 0.8) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#fffbeb", color: "#d97706" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Moderate
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#f0fdf4", color: "#16a34a" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Good
    </span>
  );
}
