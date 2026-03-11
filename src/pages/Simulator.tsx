import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, formatCrores, StatusBadge } from "@/components/shared/DataWidgets";
import { districts, predictions, needIndices, addRedistributionPlan, redistributionPlans, exportToCSV } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Download, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { RedistributionEntry } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Simulator() {
  const totalCurrentBudget = predictions.reduce((s, p) => s + p.current_allocation, 0);
  const [totalBudget, setTotalBudget] = useState(String(Math.round(totalCurrentBudget)));
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RedistributionEntry[] | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [, setRefresh] = useState(0);
  const { toast } = useToast();
  const user = useAppStore(s => s.user);

  const runSimulation = () => {
    setRunning(true);
    const budget = Number(totalBudget);
    setTimeout(() => {
      const totalNI = needIndices.reduce((s, n) => s + n.need_index_score, 0);
      const entries: RedistributionEntry[] = districts.map(d => {
        const ni = needIndices.find(n => n.districtId === d.id);
        const niScore = ni?.need_index_score ?? 0.3;
        const pred = predictions.find(p => p.districtId === d.id);
        const currentAlloc = pred?.current_allocation ?? 100;
        const recommended = Math.round((niScore / totalNI) * budget * 100) / 100;
        const delta = Math.round((recommended - currentAlloc) * 100) / 100;
        const deltaPct = currentAlloc > 0 ? Math.round((delta / currentAlloc) * 100 * 100) / 100 : 0;
        let status: "INCREASE" | "DECREASE" | "SAME" = "SAME";
        if (delta > 1) status = "INCREASE";
        else if (delta < -1) status = "DECREASE";
        return {
          districtId: d.id,
          districtName: d.name,
          current_allocation: currentAlloc,
          recommended_allocation: recommended,
          delta_amount: delta,
          delta_percent: deltaPct,
          status,
        };
      });
      setResults(entries);
      setRunning(false);
      toast({ title: "Simulation Complete", description: `Redistributed ₹${budget} Cr across ${entries.length} Gujarat districts.` });
    }, 1500);
  };

  const handleSavePlan = () => {
    if (!results) return;
    addRedistributionPlan({
      id: `rp${Date.now()}`,
      createdBy: user?.name ?? "Admin",
      total_budget: Number(totalBudget),
      year: 2025,
      quarter: 1,
      plan: results,
      generated_at: new Date().toISOString(),
    });
    setRefresh(r => r + 1);
    toast({ title: "Plan Saved", description: "Redistribution plan saved successfully." });
  };

  const handleExportCSV = () => {
    if (!results) return;
    exportToCSV(results.map(r => ({
      District: r.districtName,
      Current_Allocation: r.current_allocation,
      Recommended: r.recommended_allocation,
      Change_Amount: r.delta_amount,
      Change_Percent: r.delta_percent,
      Action: r.status,
    })), "redistribution_plan.csv");
    toast({ title: "Exported" });
  };

  const gettingMore = results?.filter(r => r.status === "INCREASE").length ?? 0;
  const gettingLess = results?.filter(r => r.status === "DECREASE").length ?? 0;
  const totalRealloc = results?.reduce((s, r) => s + Math.abs(r.delta_amount), 0) ?? 0;
  const biggestGain = results?.reduce((max, r) => r.delta_amount > (max?.delta_amount ?? -Infinity) ? r : max, results[0]);
  const biggestCut = results?.reduce((min, r) => r.delta_amount < (min?.delta_amount ?? Infinity) ? r : min, results[0]);

  return (
    <AppLayout>
      <PageHeader title="Budget Redistribution Simulator" subtitle="Need-based proportional allocation engine for Gujarat Health" />

      {/* Input Panel */}
      <div className="bg-card rounded-lg border p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4">Simulation Parameters</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Total Gujarat Health Budget (₹ Crores)</label>
            <Input type="number" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} className="w-48" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Year</label>
            <Input value="2025" disabled className="w-24" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Quarter</label>
            <Input value="Q1" disabled className="w-24" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sector</label>
            <Input value="🏥 Health" disabled className="w-32" />
          </div>
          <Button onClick={runSimulation} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
            {running ? "Running..." : "Run Redistribution Simulation"}
          </Button>
        </div>
      </div>

      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-xs text-green-700">Districts Getting More</p>
              <p className="text-lg font-bold text-green-800">↑ {gettingMore}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs text-red-700">Districts Getting Less</p>
              <p className="text-lg font-bold text-red-800">↓ {gettingLess}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <p className="text-xs text-slate-700">Total Reallocation</p>
              <p className="text-lg font-bold">{formatCrores(Math.round(totalRealloc))}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-xs text-green-700">Biggest Gain</p>
              <p className="text-sm font-bold text-green-800">{biggestGain?.districtName} +{formatCrores(biggestGain?.delta_amount ?? 0)}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs text-red-700">Biggest Cut</p>
              <p className="text-sm font-bold text-red-800">{biggestCut?.districtName} {formatCrores(biggestCut?.delta_amount ?? 0)}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={handleSavePlan}><Save className="w-3 h-3 mr-1" /> Save Plan</Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}><Download className="w-3 h-3 mr-1" /> Export CSV</Button>
            <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Export PDF</Button>
          </div>

          {/* Comparison Chart */}
          <div className="bg-card rounded-lg border p-5 mb-6">
            <h3 className="text-sm font-semibold mb-4">Current vs Recommended Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
                <XAxis dataKey="districtName" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₹${v.toFixed(1)} Cr`} />
                <Legend />
                <Bar dataKey="current_allocation" fill="hsl(220,15%,70%)" name="Current" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recommended_allocation" fill="hsl(152,60%,40%)" name="Recommended" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Results Table */}
          <div className="bg-card rounded-lg border overflow-auto mb-6">
            <table className="data-table">
              <thead>
                <tr><th>District</th><th>Current</th><th>Recommended</th><th>Δ Amount</th><th>Δ %</th><th>Action</th></tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.districtId}>
                    <td className="font-medium">{r.districtName}</td>
                    <td>{formatCrores(r.current_allocation)}</td>
                    <td className="font-semibold">{formatCrores(r.recommended_allocation)}</td>
                    <td className={r.delta_amount > 0 ? "text-success" : r.delta_amount < 0 ? "text-destructive" : ""}>
                      {r.delta_amount > 0 ? "+" : ""}{formatCrores(r.delta_amount)}
                    </td>
                    <td className="font-mono text-xs">{r.delta_percent > 0 ? "+" : ""}{r.delta_percent}%</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Past Plans */}
      {redistributionPlans.length > 0 && (
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Saved Plans</h3>
          <div className="space-y-2">
            {redistributionPlans.map(plan => (
              <div key={plan.id} className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between p-3 text-sm hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                >
                  <span>{new Date(plan.generated_at).toLocaleDateString("en-IN")} • Budget: {formatCrores(plan.total_budget)} • Q{plan.quarter} {plan.year}</span>
                  {expandedPlan === plan.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedPlan === plan.id && (
                  <div className="px-3 pb-3 overflow-auto">
                    <table className="data-table text-xs">
                      <thead><tr><th>District</th><th>Current</th><th>Recommended</th><th>Change</th></tr></thead>
                      <tbody>
                        {plan.plan.map(r => (
                          <tr key={r.districtId}>
                            <td>{r.districtName}</td>
                            <td>{formatCrores(r.current_allocation)}</td>
                            <td>{formatCrores(r.recommended_allocation)}</td>
                            <td className={r.delta_amount > 0 ? "text-success" : "text-destructive"}>
                              {r.delta_amount > 0 ? "+" : ""}{formatCrores(r.delta_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
