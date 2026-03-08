import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { needIndices, getDistrictName, districts, generateNeedIndices } from "@/data/mockData";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function NeedIndexPage() {
  const [weights, setWeights] = useState({ w1: 0.3, w2: 0.25, w3: 0.25, w4: 0.2 });
  const [data, setData] = useState(needIndices);

  const sorted = [...data].sort((a, b) => b.need_index_score - a.need_index_score);

  const getColor = (score: number) => {
    if (score >= 0.45) return "status-under";
    if (score >= 0.3) return "bg-warning/10 text-warning";
    return "status-optimal";
  };

  return (
    <AppLayout>
      <PageHeader title="Need Index Calculator" subtitle="Composite need scoring for resource allocation priority" />

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
                max={100}
                step={5}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Sum: {(weights.w1 + weights.w2 + weights.w3 + weights.w4).toFixed(2)}
            {Math.abs(weights.w1 + weights.w2 + weights.w3 + weights.w4 - 1) > 0.01 && (
              <span className="text-destructive ml-2">⚠ Weights should sum to 1.0</span>
            )}
          </span>
          <Button size="sm" onClick={() => setData(generateNeedIndices())}>
            <Calculator className="w-3 h-3 mr-1" /> Recalculate
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-auto">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>District</th><th>Need Index Score</th><th>Priority</th><th>Year</th><th>Quarter</th></tr>
          </thead>
          <tbody>
            {sorted.map((ni, i) => (
              <tr key={ni.id}>
                <td className="text-muted-foreground">{i + 1}</td>
                <td className="font-medium">{getDistrictName(ni.districtId)}</td>
                <td className="font-mono font-semibold">{ni.need_index_score.toFixed(3)}</td>
                <td><span className={`govt-badge ${getColor(ni.need_index_score)}`}>
                  {ni.need_index_score >= 0.45 ? "HIGH" : ni.need_index_score >= 0.3 ? "MEDIUM" : "LOW"}
                </span></td>
                <td>{ni.year}</td>
                <td>Q{ni.quarter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
