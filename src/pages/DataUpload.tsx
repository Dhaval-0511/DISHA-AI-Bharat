import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { Upload, FileUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function DataUpload() {
  const [dataType, setDataType] = useState("districts");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    setUploading(true);
    setProgress(0);
    setDone(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setDone(true);
          toast({ title: "Upload Complete", description: "Data has been processed successfully." });
          return 100;
        }
        return p + 12;
      });
    }, 300);
  };

  return (
    <AppLayout>
      <PageHeader title="Data Upload Hub" subtitle="Upload CSV datasets for districts and allocation records" />

      <div className="max-w-2xl">
        <div className="bg-card rounded-lg border p-6">
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-1 block">Data Type</label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="districts">District Data</SelectItem>
                <SelectItem value="allocations">Allocation Records</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-2 border-dashed rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={handleUpload}>
            {done ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10 text-success" />
                <p className="text-sm font-medium">Upload Complete!</p>
                <p className="text-xs text-muted-foreground">247 rows processed successfully</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FileUp className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground">CSV files only • Max 10MB</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Processing...</span>
                <span>{Math.min(progress, 100)}%</span>
              </div>
              <Progress value={Math.min(progress, 100)} />
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-xs font-semibold mb-2">Required CSV Columns ({dataType})</h4>
            <code className="text-xs text-muted-foreground block">
              {dataType === "districts"
                ? "name, state, region, population, area_km2, literacy_rate, poverty_index, infrastructure_deficit_score, complaint_rate"
                : "district_name, sector, year, quarter, allocated_amount, utilized_amount"}
            </code>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
