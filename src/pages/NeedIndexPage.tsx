import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, NeedLevelBadge } from "@/components/shared/DataWidgets";
import { needIndices, getDistrictName, districts, generateNeedIndices, refreshNeedIndices } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { NeedIndexWeights } from "@/types";

export default function NeedIndexPage() {
  const { weights: storeWeights, user } = useAppStore();
  const [weights, setWeights] = useState<NeedIndexWeights>(storeWeights);
  const [data, setData] = useState(needIndices);
  const [running, setRunning] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0].id);
  const { toast } = useToast();
  const canCompute = useAppStore(s => s.canCompute());
  const isViewer = user?.role === "VIEWER";

  const sorted = [...data].sort((a, b) => b.need_index_score - a.need_index_score);
  const weightSum = weights.w1 + weights.w2 + weights.w3 + weights.w4;
  const validSum = Math.abs(weightSum - 1) < 0.01;

  const handleCalculate = () => {
    if (!validSum) {
      toast({ title: "Invalid Weights", description: "Weights must sum to 1.0", variant: "destructive" });
      return;
    }
    setRunning(true);
    setTimeout(() => {
      const newData = generateNeedIndices(weights);
      refreshNeedIndices(weights);
      setData(newData);
      setRunning(false);
      toast({ title: "Need Index Calculated", description: `Need Index computed for ${districts.length} districts (Q1 2025)` });
    }, 1500);
  };

  // NI breakdown for selected district
  const selectedNI = data.find(n => n.districtId === selectedDistrict);
  const breakdownData = selectedNI ? [
    { factor: "Population", value: selectedNI.population_contribution },
    { factor: "Complaints", value: selectedNI.complaint_contribution },
    { factor: "Poverty", value: selectedNI.poverty_contribution },
    { factor: "Infra Deficit", value: selectedNI.infra_contribution },
  ] : [];

  return (
    <AppLayout>
      <PageHeader title="Need Index Calculator" subtitle="Composite need scoring for Gujarat Health resource allocation priority" />

      {/* Weight Configuration */}
      <div className="bg-card rounded-lg border p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4">Weight Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { key: "w1" as const, label: "Population Density", value: weights.w1 },
            { key: "w2" as const, label: "Complaint Rate", value: weights.w2 },
            { key: "w3" as const, label: "Poverty Index", value: weights.w3 },
            { key: "w4" as const, label: "Infra Deficit", value: weights.w4 },
          ].map(({ key, label, value }) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-semibold">{value.toFixed(2)}</span>
              </div>
              <Slider
                value={[value * 100]}
                onValueChange={([v]) => setWeights(prev => ({ ...prev, [key]: v / 100 }))}
                max={50}
                step={5}
                disabled={isViewer}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Total Weight: <span className={`font-mono font-bold ${validSum ? "text-success" : "text-destructive"}`}>{weightSum.toFixed(2)}</span>
            {validSum ? " ✅" : " ⚠ Must equal 1.0"}
          </span>
          {canCompute && (
            <Button size="sm" onClick={handleCalculate} disabled={running || !validSum}>
              {running ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Calculator className="w-3 h-3 mr-1" />}
              {running ? "Calculating..." : "Calculate Need Index"}
            </Button>
          )}
          {isViewer && <span className="text-xs text-muted-foreground italic">🔒 Read-only mode</span>}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-card rounded-lg border overflow-auto mb-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>District</th>
              <th>Population</th>
              <th>Complaint Rate</th>
              <th>Poverty Index</th>
              <th>Infra Deficit</th>
              <th>NI Score</th>
              <th>Need Level</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ni, i) => {
              const d = districts.find(dd => dd.id === ni.districtId);
              return (
                <tr key={ni.id} className="cursor-pointer hover:bg-muted/70" onClick={() => setSelectedDistrict(ni.districtId)}>
                  <td className="text-muted-foreground">{i + 1}</td>
                  <td className="font-medium">{getDistrictName(ni.districtId)}</td>
                  <td>{d ? (d.population / 1000000).toFixed(1) + "M" : "-"}</td>
                  <td>{d?.complaint_rate.toFixed(2)}</td>
                  <td>{d?.poverty_index.toFixed(2)}</td>
                  <td>{d?.infrastructure_deficit_score.toFixed(2)}</td>
                  <td className="font-mono font-bold">{ni.need_index_score.toFixed(3)}</td>
                  <td><NeedLevelBadge score={ni.need_index_score} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* NI Breakdown for selected district */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-5">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-semibold">NI Breakdown</h3>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {districts.map(d => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={breakdownData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="factor" tick={{ fontSize: 11 }} width={75} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} />
              <Bar dataKey="value" fill="hsl(220,60%,22%)" radius={[0, 4, 4, 0]} name="Contribution" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NI History (simulated) */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">NI History — {getDistrictName(selectedDistrict)}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { label: "Q1 2024", score: (selectedNI?.need_index_score ?? 0.3) * 0.92 },
              { label: "Q2 2024", score: (selectedNI?.need_index_score ?? 0.3) * 0.95 },
              { label: "Q3 2024", score: (selectedNI?.need_index_score ?? 0.3) * 0.97 },
              { label: "Q4 2024", score: (selectedNI?.need_index_score ?? 0.3) * 0.99 },
              { label: "Q1 2025", score: selectedNI?.need_index_score ?? 0.3 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 0.8]} />
              <Tooltip formatter={(v: number) => (v as number).toFixed(3)} />
              <Line type="monotone" dataKey="score" stroke="hsl(35,90%,52%)" strokeWidth={2} dot={{ r: 4 }} name="NI Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
