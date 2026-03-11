import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, StatusBadge, AESBadge, formatCrores } from "@/components/shared/DataWidgets";
import { predictions, getDistrictName, needIndices, refreshPredictions, exportToCSV } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, Download, TrendingDown, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Predictions() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("aes");
  const [running, setRunning] = useState(false);
  const [, setRefresh] = useState(0);
  const canCompute = useAppStore(s => s.canCompute());
  const { toast } = useToast();

  const filtered = predictions
    .filter(p => statusFilter === "ALL" || p.allocation_status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "aes") return a.aes_score - b.aes_score;
      if (sortBy === "gap") return Math.abs(b.gap) - Math.abs(a.gap);
      return getDistrictName(a.districtId).localeCompare(getDistrictName(b.districtId));
    });

  const underCount = predictions.filter(p => p.allocation_status === "UNDER").length;
  const optimalCount = predictions.filter(p => p.allocation_status === "OPTIMAL").length;
  const overCount = predictions.filter(p => p.allocation_status === "OVER").length;
  const avgAES = predictions.length
    ? (predictions.reduce((s, p) => s + p.aes_score, 0) / predictions.length).toFixed(2)
    : "N/A";

  const handleRunPredictions = () => {
    setRunning(true);
    setTimeout(() => {
      refreshPredictions();
      setRunning(false);
      setRefresh(r => r + 1);
      toast({ title: "Predictions Complete", description: "Bedrock has generated predictions for all 12 Gujarat districts." });
    }, 2500);
  };

  const handleExport = () => {
    const data = predictions.map(p => ({
      District: getDistrictName(p.districtId),
      NI_Score: needIndices.find(n => n.districtId === p.districtId)?.need_index_score ?? "",
      Predicted_Need: p.predicted_need,
      Current_Allocation: p.current_allocation,
      AES_Score: p.aes_score,
      Status: p.allocation_status,
      Gap: p.gap,
      Confidence: p.confidence_score,
    }));
    exportToCSV(data, "disha_predictions.csv");
    toast({ title: "Exported", description: "Predictions exported as CSV" });
  };

  const summaryCards = [
    { label: "Under-Allocated", value: underCount, icon: TrendingDown, bar: "#ef4444", iconBg: "#fef2f2", iconColor: "#dc2626" },
    { label: "Optimal", value: optimalCount, icon: Activity, bar: "#22c55e", iconBg: "#f0fdf4", iconColor: "#16a34a" },
    { label: "Over-Allocated", value: overCount, icon: TrendingUp, bar: "#3b82f6", iconBg: "#eff6ff", iconColor: "#2563eb" },
    { label: "Avg AES Score", value: avgAES, icon: BarChart3, bar: "#8b5cf6", iconBg: "#faf5ff", iconColor: "#7c3aed" },
  ];

  return (
    <AppLayout>
      <PageHeader title="Predictions & AES Engine" subtitle="AI-powered health allocation predictions via AWS Bedrock">
        <div className="flex gap-2">
          {canCompute && (
            <Button onClick={handleRunPredictions} disabled={running} className="font-medium"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
              {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
              {running ? "Running via Bedrock..." : "Run Predictions"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport} style={{ borderColor: "#e2e8f0" }}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </Button>
        </div>
      </PageHeader>

      {/* Summary ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {summaryCards.map(c => (
          <div key={c.label} className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="h-1" style={{ backgroundColor: c.bar }} />
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c.iconBg }}>
                <c.icon className="w-4 h-4" style={{ color: c.iconColor }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>{c.label}</p>
                <p className="text-xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', serif" }}>{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-10" style={{ background: "#fff", borderColor: "#e2e8f0" }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="UNDER">Under-Allocated</SelectItem>
            <SelectItem value="OPTIMAL">Optimal</SelectItem>
            <SelectItem value="OVER">Over-Allocated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44 h-10" style={{ background: "#fff", borderColor: "#e2e8f0" }}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="aes">Sort: AES (worst first)</SelectItem>
            <SelectItem value="gap">Sort: Gap (largest first)</SelectItem>
            <SelectItem value="name">Sort: District Name</SelectItem>
          </SelectContent>
        </Select>
        <span className="flex items-center text-xs px-2" style={{ color: "#94a3b8" }}>{filtered.length} districts</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                {["District", "NI Score", "Predicted Need", "Current Alloc", "AES", "Status", "Gap", "Confidence"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const ni = needIndices.find(n => n.districtId === p.districtId);
                return (
                  <tr key={p.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none",
                      borderLeft: `3px solid ${p.allocation_status === "UNDER" ? "#ef4444" : p.allocation_status === "OVER" ? "#3b82f6" : "#22c55e"}`,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "11px 16px", fontWeight: 600, color: "#1e293b" }}>{getDistrictName(p.districtId)}</td>
                    <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>{ni?.need_index_score.toFixed(3) ?? "—"}</td>
                    <td style={{ padding: "11px 16px", color: "#1e293b" }}>{formatCrores(p.predicted_need)}</td>
                    <td style={{ padding: "11px 16px", color: "#475569" }}>{formatCrores(p.current_allocation)}</td>
                    <td style={{ padding: "11px 16px" }}><AESBadge score={p.aes_score} /></td>
                    <td style={{ padding: "11px 16px" }}><StatusBadge status={p.allocation_status} /></td>
                    <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: p.gap > 0 ? "#dc2626" : p.gap < 0 ? "#2563eb" : "#64748b" }}>
                      {p.gap > 0 ? "+" : ""}{formatCrores(p.gap)}
                    </td>
                    <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>{(p.confidence_score * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
