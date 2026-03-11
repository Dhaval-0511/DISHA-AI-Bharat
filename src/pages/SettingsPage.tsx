import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/appStore";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { weights, thresholds, setWeights, setThresholds } = useAppStore();
  const [localWeights, setLocalWeights] = useState(weights);
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const { toast } = useToast();

  const weightSum = localWeights.w1 + localWeights.w2 + localWeights.w3 + localWeights.w4;
  const validSum = Math.abs(weightSum - 1) < 0.01;

  const handleSaveWeights = () => {
    if (!validSum) {
      toast({ title: "Error", description: "Weights must sum to 1.0", variant: "destructive" });
      return;
    }
    setWeights(localWeights);
    toast({ title: "Weights Saved", description: "Need Index weights updated. Re-run NI calculation to see updated scores." });
  };

  const handleSaveThresholds = () => {
    if (localThresholds.under >= 1.0) {
      toast({ title: "Error", description: "Under threshold must be < 1.0", variant: "destructive" });
      return;
    }
    if (localThresholds.over <= 1.0) {
      toast({ title: "Error", description: "Over threshold must be > 1.0", variant: "destructive" });
      return;
    }
    setThresholds(localThresholds);
    toast({ title: "Thresholds Saved", description: "AES classification thresholds updated." });
  };

  return (
    <AppLayout>
      <PageHeader title="Settings & Configuration" subtitle="System parameters and AI configuration — Admin only" />

      <div className="max-w-2xl space-y-6">
        {/* Section 1: NI Weights */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-1">Need Index Weights (Health)</h3>
          <p className="text-xs text-muted-foreground mb-4">Configure feature importance for Need Index calculation</p>
          <div className="space-y-5">
            {[
              { key: "w1" as const, label: "Population Density Weight" },
              { key: "w2" as const, label: "Complaint Rate Weight" },
              { key: "w3" as const, label: "Poverty Index Weight" },
              { key: "w4" as const, label: "Infrastructure Deficit Weight" },
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{label}</span>
                  <span className="font-mono font-semibold">{localWeights[key].toFixed(2)}</span>
                </div>
                <Slider
                  value={[localWeights[key] * 100]}
                  onValueChange={([v]) => setLocalWeights(prev => ({ ...prev, [key]: v / 100 }))}
                  max={50} step={5}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs">
              Total Weight:{" "}
              <span className={`font-mono font-bold ${validSum ? "text-success" : "text-destructive"}`}>
                {weightSum.toFixed(2)} {validSum ? "✅" : "⚠ Must equal 1.0"}
              </span>
            </span>
            <Button onClick={handleSaveWeights} disabled={!validSum}>
              <Save className="w-3 h-3 mr-1" /> Save Weights
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Changing weights requires re-running NI calculation to see updated scores.
          </p>
        </div>

        {/* Section 2: AES Thresholds */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-1">AES Classification Thresholds</h3>
          <p className="text-xs text-muted-foreground mb-4">Define boundaries for Under / Optimal / Over allocation status</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Under Threshold</label>
              <Input
                type="number"
                step="0.05"
                value={localThresholds.under}
                onChange={e => setLocalThresholds(prev => ({ ...prev, under: parseFloat(e.target.value) || 0 }))}
              />
              <p className="text-[10px] text-muted-foreground mt-1">Districts with AES below this are flagged UNDER_ALLOCATED</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Over Threshold</label>
              <Input
                type="number"
                step="0.05"
                value={localThresholds.over}
                onChange={e => setLocalThresholds(prev => ({ ...prev, over: parseFloat(e.target.value) || 0 }))}
              />
              <p className="text-[10px] text-muted-foreground mt-1">Districts with AES above this are flagged OVER_ALLOCATED</p>
            </div>
          </div>

          {/* Visual hint */}
          <div className="bg-muted rounded-lg p-3 mb-4">
            <div className="flex items-center text-xs font-mono gap-0">
              <div className="flex-1 text-center text-destructive">UNDER</div>
              <div className="px-2 font-bold border-x">{localThresholds.under}</div>
              <div className="flex-1 text-center text-success">OPTIMAL</div>
              <div className="px-2 font-bold border-x">{localThresholds.over}</div>
              <div className="flex-1 text-center text-info">OVER</div>
            </div>
          </div>

          <Button onClick={handleSaveThresholds}>
            <Save className="w-3 h-3 mr-1" /> Save Thresholds
          </Button>
        </div>

        {/* Section 3: AI Configuration (read-only) */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-1">AI Configuration</h3>
          <p className="text-xs text-muted-foreground mb-4">Model endpoints managed via AWS environment configuration</p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-xs">Primary Model</p>
                <p className="text-muted-foreground text-xs">Amazon Bedrock — Claude 3 Sonnet</p>
                <code className="text-[10px] text-muted-foreground">anthropic.claude-3-sonnet-20240229-v1:0</code>
              </div>
              <span className="flex items-center gap-1 text-success text-xs font-medium">
                <CheckCircle className="w-3 h-3" /> Connected
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-xs">Fallback Model</p>
                <p className="text-muted-foreground text-xs">Amazon Bedrock — Titan Express</p>
                <code className="text-[10px] text-muted-foreground">amazon.titan-text-express-v1</code>
              </div>
              <span className="flex items-center gap-1 text-success text-xs font-medium">
                <CheckCircle className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            API credentials managed via AWS environment configuration.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
