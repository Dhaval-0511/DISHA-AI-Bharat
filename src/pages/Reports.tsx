import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, formatCrores } from "@/components/shared/DataWidgets";
import { districts, predictions, needIndices, allocations, exportToCSV, getDistrictName } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Table2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Reports() {
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0].id);

  const handleDistrictPDF = () => {
    toast({ title: "PDF Generated", description: `District Health Report for ${getDistrictName(selectedDistrict)} downloaded.` });
  };
  const handleStatePDF = () => {
    toast({ title: "PDF Generated", description: "Gujarat State Health Overview PDF downloaded." });
  };
  const handleExportPredictions = () => {
    const data = predictions.map(p => ({
      District: getDistrictName(p.districtId),
      NI_Score: needIndices.find(n => n.districtId === p.districtId)?.need_index_score ?? "",
      Predicted_Need: p.predicted_need,
      Current_Allocation: p.current_allocation,
      AES_Score: p.aes_score,
      Status: p.allocation_status,
      Gap: p.gap,
      Confidence: p.confidence_score,
      Year: p.year,
      Quarter: p.quarter,
    }));
    exportToCSV(data, "disha_predictions_export.csv");
    toast({ title: "CSV Exported", description: "Predictions data downloaded." });
  };
  const handleExportAllocations = () => {
    const data = allocations.map(a => ({
      District: getDistrictName(a.districtId),
      Year: a.year,
      Quarter: a.quarter,
      Allocated_Amount: formatCrores(a.allocated_amount),
      Utilized_Amount: formatCrores(a.utilized_amount),
      Utilization_Rate: (a.utilization_rate * 100).toFixed(1) + "%",
    }));
    exportToCSV(data, "disha_allocations_export.csv");
    toast({ title: "CSV Exported", description: "Allocation records downloaded." });
  };

  const reportCards = [
    {
      icon: FileText,
      iconBg: "#eff6ff", iconColor: "#2563eb", bar: "#3b82f6",
      title: "District Health Report",
      desc: "Comprehensive PDF with district indicators, NI score, AES, allocation history, and executive summary.",
      actions: (
        <div className="space-y-3">
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full h-9" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button className="w-full font-medium" onClick={handleDistrictPDF}
            style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
        </div>
      ),
    },
    {
      icon: FileText,
      iconBg: "#fffbeb", iconColor: "#d97706", bar: "#f59e0b",
      title: "State Overview Report",
      desc: "Gujarat-wide PDF comparing all 12 districts: NI rankings, AES rankings, top under/over districts, and state summary.",
      actions: (
        <Button className="w-full font-medium" onClick={handleStatePDF}
          style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
          <Download className="w-4 h-4 mr-2" /> Download Gujarat Health PDF
        </Button>
      ),
    },
    {
      icon: Table2,
      iconBg: "#f0fdf4", iconColor: "#16a34a", bar: "#22c55e",
      title: "Raw Data Export",
      desc: "Download raw prediction and allocation data as CSV files for further analysis or reporting tools.",
      actions: (
        <div className="space-y-2">
          <Button variant="outline" className="w-full font-medium" onClick={handleExportPredictions}
            style={{ borderColor: "#e2e8f0" }}>
            <Download className="w-4 h-4 mr-2" /> Export Predictions CSV
          </Button>
          <Button variant="outline" className="w-full font-medium" onClick={handleExportAllocations}
            style={{ borderColor: "#e2e8f0" }}>
            <Download className="w-4 h-4 mr-2" /> Export Allocations CSV
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader title="Reports & Export" subtitle="Download formatted reports and raw data exports" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
        {reportCards.map(card => (
          <div key={card.title} className="rounded-xl border overflow-hidden flex flex-col"
            style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div className="h-1" style={{ backgroundColor: card.bar }} />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: card.iconBg }}>
                <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#1e293b" }}>{card.title}</h3>
              <p className="text-xs leading-relaxed mb-5 flex-1" style={{ color: "#64748b" }}>{card.desc}</p>
              {card.actions}
            </div>
          </div>
        ))}
      </div>

      {/* Reference */}
      <div className="mt-6 rounded-xl border p-5 max-w-4xl" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#94a3b8" }}>Report Contents Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { title: "District Report includes:", items: ["DISHA header + Government of Gujarat branding", "District overview (population, literacy, poverty, infra)", "Need Index score + component breakdown", "AES score + status classification", "Last 4 quarters allocation vs utilization", "Executive summary (if generated)"] },
            { title: "State Report includes:", items: ["All 12 districts comparison table", "NI scores ranked highest to lowest", "AES scores ranked (worst first)", "Top 3 under and over-allocated districts", "Gujarat-wide health statistics", "State executive summary (if generated)"] },
          ].map(sec => (
            <div key={sec.title}>
              <p className="font-semibold mb-1.5" style={{ color: "#334155" }}>{sec.title}</p>
              <ul className="space-y-0.5" style={{ color: "#64748b" }}>
                {sec.items.map(item => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "#94a3b8" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-4" style={{ color: "#94a3b8" }}>Footer: "Generated by DISHA AI Platform | Confidential"</p>
      </div>
    </AppLayout>
  );
}
