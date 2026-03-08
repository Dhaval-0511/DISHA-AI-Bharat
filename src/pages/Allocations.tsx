import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, SectorIcon, formatCrores } from "@/components/shared/DataWidgets";
import { allocations, getDistrictName } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Allocations() {
  const [sectorFilter, setSectorFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("2025");

  const filtered = allocations.filter(a => {
    if (sectorFilter !== "ALL" && a.sector !== sectorFilter) return false;
    if (yearFilter !== "ALL" && a.year !== Number(yearFilter)) return false;
    return true;
  }).slice(0, 100);

  return (
    <AppLayout>
      <PageHeader title="Allocation Records" subtitle="Budget allocation and utilization data across sectors" />
      <div className="flex gap-3 mb-4">
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Sectors</SelectItem>
            <SelectItem value="HEALTH">Health</SelectItem>
            <SelectItem value="EDUCATION">Education</SelectItem>
            <SelectItem value="WATER">Water</SelectItem>
            <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
          </SelectContent>
        </Select>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Years</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-card rounded-lg border overflow-auto">
        <table className="data-table">
          <thead>
            <tr><th>District</th><th>Sector</th><th>Year</th><th>Q</th><th>Allocated</th><th>Utilized</th><th>Util. Rate</th></tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td className="font-medium">{getDistrictName(a.districtId)}</td>
                <td><SectorIcon sector={a.sector} />{a.sector}</td>
                <td>{a.year}</td>
                <td>Q{a.quarter}</td>
                <td>{formatCrores(a.allocated_amount)}</td>
                <td>{formatCrores(a.utilized_amount)}</td>
                <td>
                  <span className={`govt-badge ${a.utilization_rate < 0.6 ? "status-under" : a.utilization_rate > 0.85 ? "status-optimal" : "bg-warning/10 text-warning"}`}>
                    {(a.utilization_rate * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
