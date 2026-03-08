import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/appStore";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, weights, setWeights } = useAppStore();
  const [localWeights, setLocalWeights] = useState(weights);
  const { toast } = useToast();

  const handleSave = () => {
    setWeights(localWeights);
    toast({ title: "Settings Saved", description: "Need Index weights updated successfully." });
  };

  return (
    <AppLayout>
      <PageHeader title="Settings" subtitle="User profile and system configuration" />

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">User Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input value={user?.name || ""} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input value={user?.email || ""} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <Input value={user?.role || ""} disabled className="mt-1" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Need Index Weight Configuration</h3>
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
                  max={100} step={5}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Sum: {(localWeights.w1 + localWeights.w2 + localWeights.w3 + localWeights.w4).toFixed(2)}
          </p>
          <Button className="mt-4" onClick={handleSave}><Save className="w-3 h-3 mr-1" /> Save Weights</Button>
        </div>
      </div>
    </AppLayout>
  );
}
