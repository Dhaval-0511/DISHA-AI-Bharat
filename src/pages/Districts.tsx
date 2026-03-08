import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { districts } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";

export default function Districts() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "population" | "poverty_index">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = districts
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.state.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * mul;
      return ((a[sortKey] as number) - (b[sortKey] as number)) * mul;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <AppLayout>
      <PageHeader title="Districts" subtitle="All registered districts with demographic indicators" />
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search districts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border overflow-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => toggleSort("name")}>District <ArrowUpDown className="inline w-3 h-3" /></th>
              <th>State</th>
              <th>Region</th>
              <th className="cursor-pointer" onClick={() => toggleSort("population")}>Population <ArrowUpDown className="inline w-3 h-3" /></th>
              <th>Literacy</th>
              <th className="cursor-pointer" onClick={() => toggleSort("poverty_index")}>Poverty <ArrowUpDown className="inline w-3 h-3" /></th>
              <th>Infra Deficit</th>
              <th>Complaint Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td><Link to={`/districts/${d.id}`} className="text-primary font-medium hover:underline">{d.name}</Link></td>
                <td>{d.state}</td>
                <td className="text-muted-foreground">{d.region}</td>
                <td>{d.population.toLocaleString("en-IN")}</td>
                <td>{d.literacy_rate}%</td>
                <td>
                  <span className={`govt-badge ${d.poverty_index > 0.4 ? "status-under" : d.poverty_index < 0.2 ? "status-optimal" : "bg-warning/10 text-warning"}`}>
                    {d.poverty_index}
                  </span>
                </td>
                <td>{d.infrastructure_deficit_score}</td>
                <td>{d.complaint_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
