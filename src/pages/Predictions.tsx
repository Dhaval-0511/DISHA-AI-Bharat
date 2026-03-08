import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, StatusBadge, AESBadge, SectorIcon, formatCrores } from "@/components/shared/DataWidgets";
import { predictions, getDistrictName } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Predictions() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const filtered = predictions.filter(p => statusFilter === "ALL" || p.allocation_status === statusFilter);

  const handleRunPredictions = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast({ title: "Predictions Complete", description: "ML models have generated predictions for all 20 districts across 4 sectors." });
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="ML Predictions" subtitle="XGBoost-powered allocation optimization predictions" />
        <Button onClick={handleRunPredictions} disabled={running}>
          {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Brain className="w-4 h-4 mr-1" />}
          {running ? "Running..." : "Run Predictions"}
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="UNDER">Under-Allocated</SelectItem>
            <SelectItem value="OPTIMAL">Optimal</SelectItem>
            <SelectItem value="OVER">Over-Allocated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border overflow-auto">
        <table className="data-table">
          <thead>
            <tr><th>District</th><th>Sector</th><th>Current Alloc</th><th>Predicted Need</th><th>AES</th><th>Status</th><th>Confidence</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="font-medium">{getDistrictName(p.districtId)}</td>
                <td><SectorIcon sector={p.sector} />{p.sector}</td>
                <td>{formatCrores(p.current_allocation)}</td>
                <td>{formatCrores(p.predicted_need)}</td>
                <td><AESBadge score={p.aes_score} /></td>
                <td><StatusBadge status={p.allocation_status} /></td>
                <td className="font-mono">{(p.confidence_score * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
