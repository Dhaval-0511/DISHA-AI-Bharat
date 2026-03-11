import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, KPICard, AESBadge, StatusBadge, formatCrores, NeedLevelBadge, UtilizationBadge } from "@/components/shared/DataWidgets";
import { districts, getDistrictAllocations, getDistrictPrediction, getDistrictNI, getDistrictSummary, generateDistrictSummary } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Copy, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DistrictDetail() {
  const { id } = useParams<{ id: string }>();
  const district = districts.find(d => d.id === id);
  const canCompute = useAppStore(s => s.canCompute());
  const isAdmin = useAppStore(s => s.isAdmin());
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [, setRefresh] = useState(0);

  if (!district) {
    return (
      <AppLayout>
        <PageHeader title="District Not Found" />
        <Link to="/districts" className="text-primary hover:underline">← Back to Districts</Link>
      </AppLayout>
    );
  }

  const allocs = getDistrictAllocations(district.id);
  const pred = getDistrictPrediction(district.id);
  const ni = getDistrictNI(district.id);
  const summary = getDistrictSummary(district.id);
  const latestAlloc = allocs[allocs.length - 1];
  const avgUtil = allocs.length
    ? Math.round((allocs.reduce((s, a) => s + a.utilization_rate, 0) / allocs.length) * 100)
    : 0;

  // Allocation history chart data
  const allocChartData = allocs.map(a => ({
    label: `Q${a.quarter} ${a.year}`,
    Allocated: a.allocated_amount,
    Utilized: a.utilized_amount,
  }));

  // NI breakdown chart data
  const niBreakdown = ni ? [
    { factor: "Population", contribution: ni.population_contribution, fill: "#3b82f6" },
    { factor: "Complaints", contribution: ni.complaint_contribution, fill: "#ef4444" },
    { factor: "Poverty", contribution: ni.poverty_contribution, fill: "#f59e0b" },
    { factor: "Infra Deficit", contribution: ni.infra_contribution, fill: "#8b5cf6" },
  ] : [];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      generateDistrictSummary(district.id);
      setGenerating(false);
      setRefresh(r => r + 1);
      toast({ title: "Summary Generated", description: `Health policy brief for ${district.name} created via Bedrock.` });
    }, 2000);
  };

  return (
    <AppLayout>
      <Link to="/districts" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-3">
        <ArrowLeft className="w-3 h-3" /> Back to Districts
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-serif">{district.name}</h1>
          <div className="flex gap-2 mt-2">
            <span className="govt-badge bg-primary/10 text-primary">Gujarat</span>
            <span className={`govt-badge ${district.region === "Tribal" ? "bg-amber-100 text-amber-700" : district.region === "Urban" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
              {district.region}
            </span>
            {pred && <AESBadge score={pred.aes_score} />}
            {pred && <StatusBadge status={pred.allocation_status} />}
          </div>
          {pred && <p className="text-xs text-muted-foreground mt-1">Last prediction: {new Date().toLocaleDateString("en-IN")}</p>}
        </div>
      </div>

      {/* 6 Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KPICard title="Population" value={`${(district.population / 1000000).toFixed(1)}M`} />
        <KPICard title="Literacy Rate" value={`${district.literacy_rate}%`} />
        <KPICard title="Poverty Index" value={district.poverty_index.toFixed(2)} variant={district.poverty_index > 0.4 ? "danger" : "default"} subtitle={district.poverty_index > 0.5 ? "High" : district.poverty_index > 0.3 ? "Medium" : "Low"} />
        <KPICard title="Infra Deficit" value={district.infrastructure_deficit_score.toFixed(2)} variant={district.infrastructure_deficit_score > 0.5 ? "danger" : "default"} />
        <KPICard title="Complaint Rate" value={district.complaint_rate.toFixed(2)} variant={district.complaint_rate > 0.4 ? "danger" : "default"} />
        <KPICard title="Utilization Rate" value={`${avgUtil}%`} variant={avgUtil < 60 ? "danger" : avgUtil < 80 ? "warning" : "success"} />
      </div>

      {/* Charts: Allocation History + NI Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Health Allocation History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={allocChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `₹${v} Cr`} />
              <Legend />
              <Line type="monotone" dataKey="Allocated" stroke="hsl(220,60%,22%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Utilized" stroke="hsl(35,90%,52%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Need Index Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={niBreakdown} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="factor" tick={{ fontSize: 11 }} width={75} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]} name="Contribution">
                {niBreakdown.map((entry, i) => (
                  <Bar key={i} dataKey="contribution" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prediction Summary Cards */}
      {pred && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KPICard title="Predicted Health Need" value={formatCrores(pred.predicted_need)} variant="info" />
          <KPICard title="Current Allocation" value={formatCrores(pred.current_allocation)} />
          <KPICard title="AES Score" value={pred.aes_score.toFixed(3)} variant={pred.allocation_status === "UNDER" ? "danger" : pred.allocation_status === "OVER" ? "info" : "success"} />
          <KPICard
            title="Allocation Gap"
            value={formatCrores(pred.gap)}
            variant={pred.gap > 0 ? "danger" : pred.gap < 0 ? "info" : "success"}
            subtitle={pred.gap > 0 ? "Under-funded by" : pred.gap < 0 ? "Over-funded by" : "Balanced"}
          />
        </div>
      )}

      {/* Executive Summary Section */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Executive Summary</h3>
          {canCompute && summary && (
            <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
              Regenerate
            </Button>
          )}
        </div>

        {summary ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">🔴 PROBLEM</p>
              <p className="text-sm text-foreground leading-relaxed">{summary.problem_text}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">🔍 ANALYSIS</p>
              <p className="text-sm text-foreground leading-relaxed">{summary.analysis_text}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1">✅ RECOMMENDATION</p>
              <p className="text-sm text-foreground leading-relaxed">{summary.recommendation_text}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => {
                const text = `PROBLEM:\n${summary.problem_text}\n\nANALYSIS:\n${summary.analysis_text}\n\nRECOMMENDATION:\n${summary.recommendation_text}`;
                navigator.clipboard.writeText(text);
                toast({ title: "Copied to clipboard" });
              }}>
                <Copy className="w-3 h-3 mr-1" /> Copy Text
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-3 h-3 mr-1" /> Download PDF
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Generated by: {summary.generated_by} • {new Date(summary.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No summary generated yet.</p>
            {canCompute && (
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                {generating ? "Generating IAS-level policy brief..." : "Generate Executive Summary (Bedrock)"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit District Indicators</Button>
          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Download District PDF Report</Button>
        </div>
      )}
    </AppLayout>
  );
}
