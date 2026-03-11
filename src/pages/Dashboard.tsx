import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard, PageHeader, SectionCard, formatCrores, StatusBadge } from "@/components/shared/DataWidgets";
import { GujaratMap } from "@/components/maps/IndiaMap";
import { getDashboardKPIs, getTopDistricts, getAESTrend, refreshPredictions, lastPredictionDate, generateStateSummary, predictions, exportToCSV, getDistrictName } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Download, Loader2, AlertTriangle, BarChart3, TrendingDown, TrendingUp, Activity, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const COLORS = { under: "#ef4444", over: "#3b82f6", optimal: "#22c55e" };

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canCompute = useAppStore(s => s.canCompute());
  const [runningPredictions, setRunningPredictions] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [, setRefresh] = useState(0);

  const kpis = getDashboardKPIs();
  const topUnder = getTopDistricts("under", 5);
  const topOver = getTopDistricts("over", 5);
  const aesTrend = getAESTrend();

  const pieData = [
    { name: "Under-Allocated", value: kpis.underCount, color: COLORS.under },
    { name: "Over-Allocated", value: kpis.overCount, color: COLORS.over },
    { name: "Optimal", value: kpis.optimalCount, color: COLORS.optimal },
  ];

  const daysSincePrediction = Math.floor((Date.now() - new Date(lastPredictionDate).getTime()) / 86400000);
  const isStale = daysSincePrediction > 30;

  const handleRunPredictions = () => {
    setRunningPredictions(true);
    setTimeout(() => {
      refreshPredictions();
      setRunningPredictions(false);
      setRefresh(r => r + 1);
      toast({ title: "Predictions Complete", description: "Bedrock has generated predictions for all 12 Gujarat districts." });
    }, 2500);
  };

  const handleGenerateSummary = () => {
    setGeneratingSummary(true);
    setTimeout(() => {
      generateStateSummary();
      setGeneratingSummary(false);
      toast({ title: "Summary Generated", description: "Gujarat State Health policy brief has been created." });
      navigate("/summaries");
    }, 2000);
  };

  const handleExportCSV = () => {
    const data = predictions.map(p => ({
      District: getDistrictName(p.districtId),
      NI_Score: p.predicted_need,
      Current_Allocation: p.current_allocation,
      Predicted_Need: p.predicted_need,
      AES_Score: p.aes_score,
      Status: p.allocation_status,
      Gap: p.gap,
      Confidence: p.confidence_score,
    }));
    exportToCSV(data, "disha_predictions.csv");
    toast({ title: "CSV Exported", description: "Prediction data downloaded as CSV file." });
  };

  return (
    <AppLayout>
      <PageHeader
        title="DISHA — National Health Dashboard"
        subtitle="National Health Resource Allocation Intelligence — Prototype: Gujarat Health Sector, Q1 2025"
      >
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: "#fff", border: "1px solid #e2e8f0", color: "#64748b" }}>
          <Clock className="w-3.5 h-3.5" />
          Updated: {new Date(lastPredictionDate).toLocaleDateString("en-IN")}
        </div>
      </PageHeader>

      {/* Stale warning */}
      {isStale && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm border" style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}>
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>Predictions may be outdated ({daysSincePrediction} days old). Consider running fresh predictions.</span>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        <KPICard title="Districts Analyzed" value={kpis.totalDistricts} subtitle="Gujarat state"
          variant="default" icon={<MapPin className="w-4 h-4" />} />
        <KPICard title="Under-Allocated" value={`${kpis.underCount} Districts`}
          variant="danger" subtitle={`${kpis.underPct}% of total`} icon={<TrendingDown className="w-4 h-4" />} />
        <KPICard title="Over-Allocated" value={`${kpis.overCount} Districts`}
          variant="info" subtitle={`${kpis.overPct}% of total`} icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard title="Optimal Allocation" value={`${kpis.optimalCount} Districts`}
          variant="success" subtitle={`${kpis.optimalPct}% of total`} icon={<Activity className="w-4 h-4" />} />
        <KPICard title="Avg AES Score" value={kpis.avgAES.toFixed(2)}
          variant={kpis.avgAES < 0.95 ? "danger" : kpis.avgAES > 1.05 ? "info" : "success"}
          subtitle="1.0 = Perfect" icon={<BarChart3 className="w-4 h-4" />} />
      </div>

      {/* Charts Row — Top Under & Over */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Top Under-Allocated Districts" subtitle="Budget gap in ₹ Crore">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topUnder} layout="vertical" margin={{ left: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={65} />
              <Tooltip formatter={(v: number) => formatCrores(v)} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="gap" fill={COLORS.under} radius={[0, 4, 4, 0]} name="Gap (₹ Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top Over-Allocated Districts" subtitle="Excess budget in ₹ Crore">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topOver} layout="vertical" margin={{ left: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={65} />
              <Tooltip formatter={(v: number) => formatCrores(v)} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="gap" fill={COLORS.over} radius={[0, 4, 4, 0]} name="Gap (₹ Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Trend + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <SectionCard title="AES Trend" subtitle="Gujarat Health Average — Allocation Efficiency Score">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={aesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis domain={[0.7, 1.3]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <ReferenceLine y={1.0} stroke="#22c55e" strokeDasharray="5 5"
                  label={{ value: "Optimal (1.0)", position: "right", fill: "#16a34a", fontSize: 10 }} />
                <Line type="monotone" dataKey="aes" stroke="#1e3a5f" strokeWidth={2.5} dot={{ r: 4, fill: "#1e3a5f" }} name="AES Score" />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title="Status Distribution" subtitle="All 12 districts">
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={82} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5" style={{ color: "#64748b" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold" style={{ color: "#1e293b" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Gujarat District Map */}
      <SectionCard title="Gujarat District Health Map" subtitle="AES status color-coded by district" className="mb-4">
        <div className="flex gap-4 mb-3 text-xs">
          {[
            { color: "#ef4444", label: "Under-Allocated" },
            { color: "#22c55e", label: "Optimal" },
            { color: "#3b82f6", label: "Over-Allocated" },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5" style={{ color: "#64748b" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <GujaratMap />
      </SectionCard>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" subtitle="Trigger AI operations and data exports">
        <div className="flex flex-wrap gap-3">
          {canCompute && (
            <>
              <Button onClick={handleRunPredictions} disabled={runningPredictions}
                className="font-medium" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
                {runningPredictions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
                {runningPredictions ? "Running via Bedrock..." : "Run Health Predictions"}
              </Button>
              <Button variant="outline" onClick={handleGenerateSummary} disabled={generatingSummary} className="font-medium" style={{ borderColor: "#cbd5e1" }}>
                {generatingSummary ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                {generatingSummary ? "Generating..." : "Generate State Summary"}
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleExportCSV} className="font-medium" style={{ borderColor: "#cbd5e1" }}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </SectionCard>
    </AppLayout>
  );
}
