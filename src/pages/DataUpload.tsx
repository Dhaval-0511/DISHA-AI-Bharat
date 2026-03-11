import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { Upload, FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { uploadLogs, addUploadLog } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function DataUpload() {
  const [activeTab, setActiveTab] = useState("districts");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const requiredColumns = {
    districts: ["name", "region", "population", "area_km2", "literacy_rate", "poverty_index", "infrastructure_deficit_score", "complaint_rate", "latitude", "longitude"],
    allocations: ["district_name", "year", "quarter", "allocated_amount", "utilized_amount"],
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      toast({ title: "Invalid File", description: "Only CSV files are accepted.", variant: "destructive" });
      return;
    }
    setFile(f);
    setDone(false);

    // Parse preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      const rows = lines.slice(0, 6).map(l => l.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
      setPreview(rows);
    };
    reader.readAsText(f);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setDone(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setDone(true);
          addUploadLog({
            id: `ul${Date.now()}`,
            fileName: file.name,
            uploadType: activeTab as "districts" | "allocations",
            rowCount: (preview?.length ?? 1) - 1,
            status: "SUCCESS",
            uploadedBy: "Admin User",
            createdAt: new Date().toISOString(),
          });
          toast({ title: "Upload Complete", description: "Data has been processed successfully." });
          return 100;
        }
        return p + 15;
      });
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const lines = text.split("\n").filter(l => l.trim());
        const rows = lines.slice(0, 6).map(l => l.split(",").map(c => c.trim()));
        setPreview(rows);
      };
      reader.readAsText(f);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setDone(false);
    setProgress(0);
  };

  return (
    <AppLayout>
      <PageHeader title="Data Upload Pipeline" subtitle="Upload Gujarat health data via CSV — Admin only" />

      <div className="max-w-3xl">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); resetUpload(); }}>
          <TabsList className="mb-4">
            <TabsTrigger value="districts">Upload Districts</TabsTrigger>
            <TabsTrigger value="allocations">Upload Health Allocations</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="bg-card rounded-lg border p-6">
              {/* Drop zone */}
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                {done ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-10 h-10 text-success" />
                    <p className="text-sm font-medium">Upload Complete!</p>
                    <p className="text-xs text-muted-foreground">✅ {(preview?.length ?? 1) - 1} rows processed successfully</p>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); resetUpload(); }} className="mt-2">
                      Upload Another File
                    </Button>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-primary" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileUp className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground">CSV files only • Max 10MB</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {preview && !done && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold mb-2">Preview (first 5 rows)</h4>
                  <div className="overflow-auto rounded border">
                    <table className="data-table text-xs">
                      <thead>
                        <tr>{preview[0]?.map((h, i) => <th key={i}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {preview.slice(1).map((row, i) => (
                          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Upload progress */}
              {uploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Processing...</span>
                    <span>{Math.min(progress, 100)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} />
                </div>
              )}

              {/* Upload button */}
              {file && !done && !uploading && (
                <Button className="mt-4 w-full" onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" /> Upload & Process
                </Button>
              )}

              {/* Required columns */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="text-xs font-semibold mb-2">Required CSV Columns ({activeTab})</h4>
                <div className="flex flex-wrap gap-1">
                  {requiredColumns[activeTab as keyof typeof requiredColumns].map(col => (
                    <code key={col} className="text-xs bg-background px-1.5 py-0.5 rounded border">{col}</code>
                  ))}
                </div>
                {activeTab === "districts" && (
                  <p className="text-xs text-muted-foreground mt-2">State is auto-set to "Gujarat" — no column needed.</p>
                )}
                {activeTab === "allocations" && (
                  <p className="text-xs text-muted-foreground mt-2">Sector auto-set to "HEALTH". utilization_rate auto-computed.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Logs */}
        <div className="bg-card rounded-lg border p-5 mt-6">
          <h3 className="text-sm font-semibold mb-3">Upload History</h3>
          <table className="data-table text-xs">
            <thead>
              <tr><th>File Name</th><th>Type</th><th>Rows</th><th>Status</th><th>Date</th><th>By</th></tr>
            </thead>
            <tbody>
              {uploadLogs.map(log => (
                <tr key={log.id}>
                  <td className="font-medium">{log.fileName}</td>
                  <td className="capitalize">{log.uploadType}</td>
                  <td>{log.rowCount}</td>
                  <td>
                    <span className={`govt-badge ${log.status === "SUCCESS" ? "status-optimal" : log.status === "FAILED" ? "status-under" : "bg-warning/10 text-warning"}`}>
                      {log.status === "SUCCESS" ? "✅" : log.status === "FAILED" ? "❌" : "🔄"} {log.status}
                    </span>
                  </td>
                  <td>{new Date(log.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>{log.uploadedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
