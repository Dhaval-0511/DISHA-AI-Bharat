import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard, PageHeader, formatCrores } from "@/components/shared/DataWidgets";
import { IndiaMap } from "@/components/maps/IndiaMap";
import { getDashboardKPIs, getTopDistricts, getAESTrend, getSectorSummary } from "@/data/mockData";

const COLORS = { under: "#ef4444", over: "#3b82f6", optimal: "#16a34a" };

export default function Dashboard() {
  const navigate = useNavigate();
  const kpis = getDashboardKPIs();
  const topUnder = getTopDistricts("under", 8);
  const topOver = getTopDistricts("over", 8);
  const aesTrend = getAESTrend();
  const sectorData = getSectorSummary();

  const pieData = [
    { name: "Under-Allocated", value: kpis.underAllocatedPct, color: COLORS.under },
    { name: "Over-Allocated", value: kpis.overAllocatedPct, color: COLORS.over },
    { name: "Optimal", value: 100 - kpis.underAllocatedPct - kpis.overAllocatedPct, color: COLORS.optimal },
  ];

  return (
    <AppLayout>
      <PageHeader title="Executive Dashboard" subtitle="National Resource Allocation Intelligence — Q1 2025" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard title="Districts Analyzed" value={kpis.totalDistricts} variant="default" />
        <KPICard title="Under-Allocated" value={`${kpis.underAllocatedPct}%`} variant="danger" subtitle="Districts below optimal" />
        <KPICard title="Over-Allocated" value={`${kpis.overAllocatedPct}%`} variant="info" subtitle="Districts above optimal" />
        <KPICard title="Budget Inefficiency" value={formatCrores(kpis.totalWastage)} variant="warning" subtitle="Total detected wastage" />
        <KPICard title="Avg AES Score" value={kpis.avgAES} variant="success" subtitle="National average" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top Under-Allocated */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Top Under-Allocated Districts</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topUnder} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v: number) => formatCrores(v)} />
              <Bar dataKey="gap" fill={COLORS.under} radius={[0, 4, 4, 0]} name="Gap (₹ Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Over-Allocated */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Top Over-Allocated Districts</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topOver} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v: number) => formatCrores(v)} />
              <Bar dataKey="gap" fill={COLORS.over} radius={[0, 4, 4, 0]} name="Gap (₹ Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">AES Trend (National Average)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0.7, 1.3]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="aes" stroke="hsl(220,60%,22%)" strokeWidth={2} dot={{ r: 4 }} name="AES Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold mb-4">Allocation Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map */}
      <div className="bg-card rounded-lg border p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4">District Allocation Heatmap</h3>
        <div className="flex gap-4 mb-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-destructive inline-block" /> Under-Allocated</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-success inline-block" /> Optimal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-info inline-block" /> Over-Allocated</span>
        </div>
        <IndiaMap onDistrictClick={(id) => navigate(`/districts/${id}`)} />
      </div>

      {/* Sector Summary */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="text-sm font-semibold mb-4">Sector-wise Allocation vs Need</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sectorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
            <XAxis dataKey="sector" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `₹${v} Cr`} />
            <Legend />
            <Bar dataKey="allocated" fill="hsl(220,60%,22%)" name="Allocated (₹ Cr)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="needed" fill="hsl(35,90%,52%)" name="Predicted Need (₹ Cr)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}
