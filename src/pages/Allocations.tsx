import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, formatCrores, UtilizationBadge } from "@/components/shared/DataWidgets";
import { allocations, getDistrictName, districts } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, TrendingUp, Percent } from "lucide-react";

export default function Allocations() {
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("2025");
  const [quarterFilter, setQuarterFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const isAdmin = useAppStore(s => s.isAdmin());

  const filtered = allocations.filter(a => {
    if (districtFilter !== "ALL" && a.districtId !== districtFilter) return false;
    if (yearFilter !== "ALL" && a.year !== Number(yearFilter)) return false;
    if (quarterFilter !== "ALL" && a.quarter !== Number(quarterFilter)) return false;
    if (statusFilter !== "ALL") {
      const utilStatus = a.utilization_rate < 0.6 ? "Poor" : a.utilization_rate <= 0.8 ? "Moderate" : "Good";
      if (utilStatus !== statusFilter) return false;
    }
    return true;
  });

  const totalAlloc = filtered.reduce((s, a) => s + a.allocated_amount, 0);
  const totalUtil = filtered.reduce((s, a) => s + a.utilized_amount, 0);
  const overallRate = totalAlloc > 0 ? totalUtil / totalAlloc : 0;

  const summaryCards = [
    { label: "Total Allocated", value: formatCrores(Math.round(totalAlloc)), icon: BarChart3, bar: "#1e3a5f", iconBg: "#eff6ff", iconColor: "#1e3a5f" },
    { label: "Total Utilized", value: formatCrores(Math.round(totalUtil)), icon: TrendingUp, bar: "#3b82f6", iconBg: "#eff6ff", iconColor: "#2563eb" },
    { label: "Overall Utilization", value: `${(overallRate * 100).toFixed(0)}%`, icon: Percent, bar: overallRate >= 0.8 ? "#22c55e" : overallRate >= 0.6 ? "#f59e0b" : "#ef4444", iconBg: "#f0fdf4", iconColor: "#16a34a" },
  ];

  return (
    <AppLayout>
      <PageHeader title="Health Allocation Records" subtitle="Gujarat health budget allocation and utilization across districts">
        {isAdmin && (
          <Button size="sm" className="font-medium" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
            <Plus className="w-4 h-4 mr-1" /> Add Record
          </Button>
        )}
      </PageHeader>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {summaryCards.map(c => (
          <div key={c.label} className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="h-1" style={{ backgroundColor: c.bar }} />
            <div className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c.iconBg }}>
                <c.icon className="w-4 h-4" style={{ color: c.iconColor }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>{c.label}</p>
                <p className="text-lg font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', serif" }}>{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { value: districtFilter, onChange: setDistrictFilter, width: "w-44",
            items: [{ value: "ALL", label: "All Districts" }, ...districts.map(d => ({ value: d.id, label: d.name }))] },
          { value: yearFilter, onChange: setYearFilter, width: "w-28",
            items: [{ value: "ALL", label: "All Years" }, { value: "2024", label: "2024" }, { value: "2025", label: "2025" }] },
          { value: quarterFilter, onChange: setQuarterFilter, width: "w-24",
            items: [{ value: "ALL", label: "All Q" }, { value: "1", label: "Q1" }, { value: "2", label: "Q2" }, { value: "3", label: "Q3" }, { value: "4", label: "Q4" }] },
          { value: statusFilter, onChange: setStatusFilter, width: "w-32",
            items: [{ value: "ALL", label: "All Status" }, { value: "Poor", label: "Poor" }, { value: "Moderate", label: "Moderate" }, { value: "Good", label: "Good" }] },
        ].map((sel, i) => (
          <Select key={i} value={sel.value} onValueChange={sel.onChange}>
            <SelectTrigger className={`${sel.width} h-10`} style={{ background: "#fff", borderColor: "#e2e8f0" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sel.items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        ))}
        <span className="flex items-center text-xs px-2" style={{ color: "#94a3b8" }}>{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                {["District", "Year", "Quarter", "Allocated", "Utilized", "Util. Rate", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr key={a.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 16px", fontWeight: 600, color: "#1e293b" }}>{getDistrictName(a.districtId)}</td>
                  <td style={{ padding: "11px 16px", color: "#64748b" }}>{a.year}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ background: "#f1f5f9", color: "#475569" }}>Q{a.quarter}</span>
                  </td>
                  <td style={{ padding: "11px 16px", color: "#1e293b", fontFamily: "'Source Serif 4', serif" }}>{formatCrores(a.allocated_amount)}</td>
                  <td style={{ padding: "11px 16px", color: "#1e293b", fontFamily: "'Source Serif 4', serif" }}>{formatCrores(a.utilized_amount)}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span className="font-mono text-xs font-semibold" style={{ color: a.utilization_rate >= 0.8 ? "#16a34a" : a.utilization_rate >= 0.6 ? "#d97706" : "#dc2626" }}>
                      {(a.utilization_rate * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}><UtilizationBadge rate={a.utilization_rate} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
