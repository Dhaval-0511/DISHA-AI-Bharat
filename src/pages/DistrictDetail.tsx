import { useParams, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, KPICard, AESBadge, StatusBadge, formatCrores, SectorIcon } from "@/components/shared/DataWidgets";
import { districts, allocations, predictions, needIndices, getDistrictName } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";

export default function DistrictDetail() {
  const { id } = useParams<{ id: string }>();
  const district = districts.find(d => d.id === id);

  if (!district) {
    return <AppLayout><PageHeader title="District Not Found" /><Link to="/districts" className="text-primary hover:underline">← Back to Districts</Link></AppLayout>;
  }

  const distAllocs = allocations.filter(a => a.districtId === id && a.year === 2025 && a.quarter === 1);
  const distPreds = predictions.filter(p => p.districtId === id);
  const ni = needIndices.find(n => n.districtId === id);
  const avgAES = distPreds.length ? Math.round((distPreds.reduce((s, p) => s + p.aes_score, 0) / distPreds.length) * 100) / 100 : 0;

  const chartData = distAllocs.map(a => {
    const pred = distPreds.find(p => p.sector === a.sector);
    return {
      sector: a.sector,
      allocated: Math.round(a.allocated_amount),
      utilized: Math.round(a.utilized_amount),
      predicted: pred ? Math.round(pred.predicted_need) : 0,
    };
  });

  return (
    <AppLayout>
      <Link to="/districts" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-3">
        <ArrowLeft className="w-3 h-3" /> Back to Districts
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <PageHeader title={district.name} subtitle={`${district.state} — ${district.region} Region`} />
        <AESBadge score={avgAES} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Population" value={district.population.toLocaleString("en-IN")} />
        <KPICard title="Need Index" value={ni?.need_index_score || "N/A"} variant={ni && ni.need_index_score > 0.4 ? "danger" : "success"} />
        <KPICard title="Poverty Index" value={district.poverty_index} variant={district.poverty_index > 0.4 ? "danger" : "default"} />
        <KPICard title="Literacy Rate" value={`${district.literacy_rate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Sector-wise Allocation (Q1 2025)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="sector" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `₹${v} Cr`} />
              <Legend />
              <Bar dataKey="allocated" fill="hsl(220,60%,22%)" name="Allocated" radius={[4,4,0,0]} />
              <Bar dataKey="utilized" fill="hsl(35,90%,52%)" name="Utilized" radius={[4,4,0,0]} />
              <Bar dataKey="predicted" fill="hsl(152,60%,40%)" name="Predicted Need" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Prediction Results</h3>
          <table className="data-table">
            <thead>
              <tr><th>Sector</th><th>AES</th><th>Status</th><th>Confidence</th></tr>
            </thead>
            <tbody>
              {distPreds.map(p => (
                <tr key={p.id}>
                  <td><SectorIcon sector={p.sector} />{p.sector}</td>
                  <td className="font-mono">{p.aes_score.toFixed(2)}</td>
                  <td><StatusBadge status={p.allocation_status} /></td>
                  <td>{(p.confidence_score * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-5">
        <h3 className="text-sm font-semibold mb-3">District Indicators</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div><span className="text-muted-foreground">Area:</span> {district.area_km2.toLocaleString()} km²</div>
          <div><span className="text-muted-foreground">Infra Deficit:</span> {district.infrastructure_deficit_score}</div>
          <div><span className="text-muted-foreground">Complaint Rate:</span> {district.complaint_rate}</div>
          <div><span className="text-muted-foreground">Avg Utilization:</span> {distAllocs.length ? `${Math.round(distAllocs.reduce((s, a) => s + a.utilization_rate, 0) / distAllocs.length * 100)}%` : "N/A"}</div>
          <div><span className="text-muted-foreground">Total Allocation:</span> {formatCrores(Math.round(distAllocs.reduce((s, a) => s + a.allocated_amount, 0)))}</div>
        </div>
      </div>
    </AppLayout>
  );
}
