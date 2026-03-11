import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, StatusBadge, AESBadge, NeedLevelBadge } from "@/components/shared/DataWidgets";
import { districts, needIndices, predictions, generateDistrictSummary } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, Plus, FileText, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Districts() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<"name" | "population" | "aes" | "ni">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const isAdmin = useAppStore(s => s.isAdmin());
  const canCompute = useAppStore(s => s.canCompute());
  const { toast } = useToast();

  const enriched = districts.map(d => {
    const ni = needIndices.find(n => n.districtId === d.id);
    const pred = predictions.find(p => p.districtId === d.id);
    return {
      ...d,
      niScore: ni?.need_index_score ?? 0,
      aes: pred?.aes_score ?? 1,
      status: pred?.allocation_status ?? ("OPTIMAL" as const),
    };
  });

  const filtered = enriched
    .filter(d => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (regionFilter !== "ALL" && d.region !== regionFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * mul;
      if (sortKey === "population") return (a.population - b.population) * mul;
      if (sortKey === "aes") return (a.aes - b.aes) * mul;
      if (sortKey === "ni") return (a.niScore - b.niScore) * mul;
      return 0;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleGenerateSummary = (districtId: string) => {
    setGeneratingId(districtId);
    setTimeout(() => {
      generateDistrictSummary(districtId);
      setGeneratingId(null);
      toast({ title: "Summary Generated", description: "District health policy brief created via Bedrock." });
    }, 1500);
  };

  const regionStyle = (r: string) =>
    r === "Tribal" ? { bg: "#fffbeb", text: "#92400e" }
    : r === "Urban" ? { bg: "#eff6ff", text: "#1d4ed8" }
    : { bg: "#f0fdf4", text: "#166534" };

  return (
    <AppLayout>
      <PageHeader title="Gujarat Districts" subtitle="All registered districts with health indicators">
        {isAdmin && (
          <Button size="sm" className="font-medium" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
            <Plus className="w-4 h-4 mr-1" /> Add District
          </Button>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
          <Input placeholder="Search districts..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10" style={{ background: "#fff", borderColor: "#e2e8f0" }} />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-36 h-10" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Regions</SelectItem>
            <SelectItem value="Urban">Urban</SelectItem>
            <SelectItem value="Rural">Rural</SelectItem>
            <SelectItem value="Tribal">Tribal</SelectItem>
          </SelectContent>
        </Select>
        <span className="flex items-center text-xs px-3" style={{ color: "#94a3b8" }}>{filtered.length} districts</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                {[
                  { label: "District", key: "name" as const },
                  { label: "Region" },
                  { label: "Population", key: "population" as const },
                  { label: "Literacy" },
                  { label: "NI Score", key: "ni" as const },
                  { label: "AES", key: "aes" as const },
                  { label: "Status" },
                  { label: "Actions" },
                ].map(col => (
                  <th key={col.label}
                    className={col.key ? "cursor-pointer select-none" : ""}
                    onClick={() => col.key && toggleSort(col.key)}
                    style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}
                  >
                    {col.label}
                    {col.key && <ArrowUpDown className="inline w-3 h-3 ml-1 opacity-50" />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <tr key={d.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none",
                    borderLeft: `3px solid ${d.status === "UNDER" ? "#ef4444" : d.status === "OVER" ? "#3b82f6" : "#22c55e"}`,
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 16px" }}>
                    <Link to={`/districts/${d.id}`} className="font-semibold hover:underline" style={{ color: "#1e3a5f" }}>{d.name}</Link>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: regionStyle(d.region).bg, color: regionStyle(d.region).text }}>
                      {d.region}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", color: "#475569" }}>{(d.population / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: "11px 16px", color: "#475569" }}>{d.literacy_rate}%</td>
                  <td style={{ padding: "11px 16px" }}><NeedLevelBadge score={d.niScore} /></td>
                  <td style={{ padding: "11px 16px" }}><AESBadge score={d.aes} /></td>
                  <td style={{ padding: "11px 16px" }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: "11px 16px" }}>
                    <div className="flex gap-1">
                      <Link to={`/districts/${d.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      {canCompute && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Generate Summary"
                          onClick={() => handleGenerateSummary(d.id)} disabled={generatingId === d.id}>
                          {generatingId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
