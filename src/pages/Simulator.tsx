import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, formatCrores, StatusBadge } from "@/components/shared/DataWidgets";
import { districts, predictions } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Download, Save, Loader2 } from "lucide-react";
import type { Sector, AllocationStatus, RedistributionEntry } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Simulator() {
  const [totalBudget, setTotalBudget] = useState("5000");
  const [sector, setSector] = useState<Sector>("HEALTH");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RedistributionEntry[] | null>(null);
  const { toast } = useToast();

  const runSimulation = () => {
    setRunning(true);
    const budget = Number(totalBudget);
    setTimeout(() => {
      const sectorPreds = predictions.filter(p => p.sector === sector);
      const totalNeed = sectorPreds.reduce((s, p) => s + p.predicted_need, 0);

      const entries: RedistributionEntry[] = sectorPreds.map(p => {
        const recommended = Math.round((p.predicted_need / totalNeed) * budget * 100) / 100;
        const delta = Math.round((recommended - p.current_allocation) * 100) / 100;
        const deltaPct = Math.round((delta / p.current_allocation) * 100 * 100) / 100;
        let status: AllocationStatus = "OPTIMAL";
        if (deltaPct > 10) status = "UNDER";
        else if (deltaPct < -10) status = "OVER";
        return {
          districtId: p.districtId,
          districtName: districts.find(d => d.id === p.districtId)?.name || "",
          current_allocation: p.current_allocation,
          recommended_allocation: recommended,
          delta_amount: delta,
          delta_percent: deltaPct,
          status,
        };
      });

      setResults(entries);
      setRunning(false);
      toast({ title: "Simulation Complete", description: `Redistributed ₹${budget} Cr across ${entries.length} districts.` });
    }, 1500);
  };

  return (
    <AppLayout>
      <PageHeader title="Budget Redistribution Simulator" subtitle="Linear programming-based optimal allocation engine" />

      <div className="bg-card rounded-lg border p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4">Simulation Parameters</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Total Budget (₹ Crores)</label>
            <Input type="number" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sector</label>
            <Select value={sector} onValueChange={(v) => setSector(v as Sector)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HEALTH">🏥 Health</SelectItem>
                <SelectItem value="EDUCATION">📚 Education</SelectItem>
                <SelectItem value="WATER">💧 Water</SelectItem>
                <SelectItem value="INFRASTRUCTURE">🏗️ Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={runSimulation} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
            {running ? "Running..." : "Run Simulation"}
          </Button>
        </div>
      </div>

      {results && (
        <>
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Export CSV</Button>
            <Button variant="outline" size="sm"><Save className="w-3 h-3 mr-1" /> Save Plan</Button>
          </div>

          <div className="bg-card rounded-lg border p-5 mb-6">
            <h3 className="text-sm font-semibold mb-4">Before vs After Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.slice(0, 12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
                <XAxis dataKey="districtName" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₹${v.toFixed(1)} Cr`} />
                <Legend />
                <Bar dataKey="current_allocation" fill="hsl(220,60%,22%)" name="Current" radius={[4,4,0,0]} />
                <Bar dataKey="recommended_allocation" fill="hsl(152,60%,40%)" name="Recommended" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg border overflow-auto">
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
    </AppLayout>
  );
}
