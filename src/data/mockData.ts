import type {
  District, AllocationRecord, NeedIndex, PredictionResult,
  ExecutiveSummary, AllocationStatus, User, DataUploadLog,
  RedistributionPlan, NeedIndexWeights,
} from "@/types";

// ── Gujarat Districts (12) ──────────────────────────────────────────────
export const districts: District[] = [
  { id: "d1", name: "Ahmedabad", state: "Gujarat", region: "Urban", population: 8650000, area_km2: 8087, literacy_rate: 86.3, poverty_index: 0.22, infrastructure_deficit_score: 0.18, complaint_rate: 0.15, lat: 23.0225, lng: 72.5714 },
  { id: "d2", name: "Surat", state: "Gujarat", region: "Urban", population: 7850000, area_km2: 4418, literacy_rate: 87.9, poverty_index: 0.19, infrastructure_deficit_score: 0.15, complaint_rate: 0.12, lat: 21.1702, lng: 72.8311 },
  { id: "d3", name: "Vadodara", state: "Gujarat", region: "Urban", population: 4200000, area_km2: 7794, literacy_rate: 81.9, poverty_index: 0.28, infrastructure_deficit_score: 0.32, complaint_rate: 0.22, lat: 22.3072, lng: 73.1812 },
  { id: "d4", name: "Rajkot", state: "Gujarat", region: "Urban", population: 3800000, area_km2: 11203, literacy_rate: 80.9, poverty_index: 0.31, infrastructure_deficit_score: 0.35, complaint_rate: 0.28, lat: 22.3039, lng: 70.8022 },
  { id: "d5", name: "Bhavnagar", state: "Gujarat", region: "Rural", population: 2880000, area_km2: 9940, literacy_rate: 74.5, poverty_index: 0.42, infrastructure_deficit_score: 0.48, complaint_rate: 0.38, lat: 21.7645, lng: 72.1519 },
  { id: "d6", name: "Junagadh", state: "Gujarat", region: "Rural", population: 2740000, area_km2: 8840, literacy_rate: 73.2, poverty_index: 0.45, infrastructure_deficit_score: 0.52, complaint_rate: 0.42, lat: 21.5222, lng: 70.4579 },
  { id: "d7", name: "Gandhinagar", state: "Gujarat", region: "Urban", population: 1650000, area_km2: 2163, literacy_rate: 84.2, poverty_index: 0.18, infrastructure_deficit_score: 0.12, complaint_rate: 0.10, lat: 23.2156, lng: 72.6369 },
  { id: "d8", name: "Kutch", state: "Gujarat", region: "Tribal", population: 2090000, area_km2: 45652, literacy_rate: 63.8, poverty_index: 0.58, infrastructure_deficit_score: 0.68, complaint_rate: 0.55, lat: 23.7337, lng: 69.8597 },
  { id: "d9", name: "Banaskantha", state: "Gujarat", region: "Tribal", population: 3120000, area_km2: 12703, literacy_rate: 61.5, poverty_index: 0.62, infrastructure_deficit_score: 0.72, complaint_rate: 0.60, lat: 24.1728, lng: 72.4310 },
  { id: "d10", name: "Patan", state: "Gujarat", region: "Rural", population: 1340000, area_km2: 5738, literacy_rate: 68.4, poverty_index: 0.50, infrastructure_deficit_score: 0.55, complaint_rate: 0.45, lat: 23.8493, lng: 72.1266 },
  { id: "d11", name: "Mehsana", state: "Gujarat", region: "Rural", population: 2030000, area_km2: 4386, literacy_rate: 76.1, poverty_index: 0.35, infrastructure_deficit_score: 0.38, complaint_rate: 0.30, lat: 23.5880, lng: 72.3693 },
  { id: "d12", name: "Anand", state: "Gujarat", region: "Rural", population: 2090000, area_km2: 2942, literacy_rate: 79.5, poverty_index: 0.30, infrastructure_deficit_score: 0.28, complaint_rate: 0.25, lat: 22.5645, lng: 72.9289 },
];

// ── Users ───────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: "u1", name: "Admin User", email: "admin@disha.gov.in", password: "Admin@123", role: "ADMIN", status: "Active", createdAt: "2025-01-01T00:00:00Z" },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh.k@disha.gov.in", password: "Analyst@123", role: "ANALYST", status: "Active", createdAt: "2025-01-15T00:00:00Z" },
  { id: "u3", name: "Anita Desai", email: "anita.d@disha.gov.in", password: "Analyst@123", role: "ANALYST", status: "Active", createdAt: "2025-02-01T00:00:00Z" },
  { id: "u4", name: "Vikram Singh", email: "vikram.s@disha.gov.in", password: "Viewer@123", role: "VIEWER", status: "Active", createdAt: "2025-02-15T00:00:00Z" },
  { id: "u5", name: "Meera Patel", email: "meera.p@disha.gov.in", password: "Viewer@123", role: "VIEWER", status: "Inactive", createdAt: "2025-03-01T00:00:00Z" },
];

// ── Health Allocation records per quarter ────────────────────────────────
const allocBase: Record<string, number[]> = {
  // [Q1-24, Q2-24, Q3-24, Q4-24, Q1-25] allocated amounts in ₹ Cr
  d1: [320, 340, 335, 350, 360],
  d2: [280, 295, 290, 310, 320],
  d3: [180, 185, 190, 195, 200],
  d4: [160, 165, 170, 175, 180],
  d5: [90, 95, 92, 100, 105],
  d6: [85, 88, 90, 95, 98],
  d7: [140, 145, 150, 155, 160],
  d8: [70, 72, 75, 78, 80],
  d9: [65, 68, 70, 72, 75],
  d10: [55, 58, 56, 60, 62],
  d11: [95, 98, 100, 105, 108],
  d12: [100, 105, 108, 110, 115],
};

const utilRates: Record<string, number[]> = {
  d1: [0.88, 0.90, 0.87, 0.91, 0.89],
  d2: [0.85, 0.87, 0.86, 0.88, 0.90],
  d3: [0.78, 0.80, 0.79, 0.82, 0.81],
  d4: [0.75, 0.77, 0.76, 0.78, 0.80],
  d5: [0.62, 0.65, 0.60, 0.68, 0.66],
  d6: [0.58, 0.60, 0.55, 0.63, 0.61],
  d7: [0.92, 0.94, 0.91, 0.93, 0.95],
  d8: [0.48, 0.52, 0.50, 0.55, 0.53],
  d9: [0.45, 0.48, 0.47, 0.50, 0.52],
  d10: [0.55, 0.58, 0.56, 0.60, 0.59],
  d11: [0.72, 0.74, 0.73, 0.76, 0.75],
  d12: [0.80, 0.82, 0.81, 0.84, 0.83],
};

const quarters = [
  { year: 2024, quarter: 1 },
  { year: 2024, quarter: 2 },
  { year: 2024, quarter: 3 },
  { year: 2024, quarter: 4 },
  { year: 2025, quarter: 1 },
];

function generateAllocations(): AllocationRecord[] {
  const records: AllocationRecord[] = [];
  let id = 1;
  for (const d of districts) {
    quarters.forEach((q, qi) => {
      const allocated = allocBase[d.id]?.[qi] ?? 100;
      const rate = utilRates[d.id]?.[qi] ?? 0.75;
      const utilized = Math.round(allocated * rate * 100) / 100;
      records.push({
        id: `a${id++}`,
        districtId: d.id,
        year: q.year,
        quarter: q.quarter,
        allocated_amount: allocated,
        utilized_amount: utilized,
        utilization_rate: rate,
      });
    });
  }
  return records;
}

export let allocations: AllocationRecord[] = generateAllocations();

// ── Need Index ──────────────────────────────────────────────────────────
export function computeNeedIndex(
  d: District,
  w: NeedIndexWeights = { w1: 0.30, w2: 0.25, w3: 0.25, w4: 0.20 }
): { score: number; popC: number; compC: number; povC: number; infraC: number } {
  const maxPopDensity = Math.max(...districts.map(x => x.population / x.area_km2));
  const normPop = (d.population / d.area_km2) / maxPopDensity;
  const popC = w.w1 * normPop;
  const compC = w.w2 * d.complaint_rate;
  const povC = w.w3 * d.poverty_index;
  const infraC = w.w4 * d.infrastructure_deficit_score;
  const score = Math.round((popC + compC + povC + infraC) * 1000) / 1000;
  return {
    score,
    popC: Math.round(popC * 1000) / 1000,
    compC: Math.round(compC * 1000) / 1000,
    povC: Math.round(povC * 1000) / 1000,
    infraC: Math.round(infraC * 1000) / 1000,
  };
}

export function generateNeedIndices(
  w: NeedIndexWeights = { w1: 0.30, w2: 0.25, w3: 0.25, w4: 0.20 },
  year = 2025,
  quarter = 1
): NeedIndex[] {
  return districts.map((d, i) => {
    const { score, popC, compC, povC, infraC } = computeNeedIndex(d, w);
    return {
      id: `ni${i + 1}`,
      districtId: d.id,
      year,
      quarter,
      need_index_score: score,
      population_contribution: popC,
      complaint_contribution: compC,
      poverty_contribution: povC,
      infra_contribution: infraC,
    };
  });
}

export let needIndices: NeedIndex[] = generateNeedIndices();

// ── Predictions & AES ───────────────────────────────────────────────────
export function generatePredictions(
  thresholdUnder = 0.9,
  thresholdOver = 1.1,
  year = 2025,
  quarter = 1
): PredictionResult[] {
  return districts.map((d, i) => {
    const ni = needIndices.find(n => n.districtId === d.id);
    const niScore = ni?.need_index_score ?? 0.3;
    const currentAlloc = allocations.find(
      a => a.districtId === d.id && a.year === year && a.quarter === quarter
    )?.allocated_amount ?? 100;
    // Predicted need is higher for high-NI districts
    const predictedNeed = Math.round(currentAlloc * (0.7 + niScore * 1.4) * 100) / 100;
    const aes = Math.round((currentAlloc / predictedNeed) * 1000) / 1000;
    let status: AllocationStatus = "OPTIMAL";
    if (aes < thresholdUnder) status = "UNDER";
    else if (aes > thresholdOver) status = "OVER";
    const gap = Math.round((predictedNeed - currentAlloc) * 100) / 100;
    return {
      id: `p${i + 1}`,
      districtId: d.id,
      year,
      quarter,
      predicted_need: predictedNeed,
      current_allocation: currentAlloc,
      aes_score: aes,
      allocation_status: status,
      confidence_score: Math.round((0.78 + Math.random() * 0.18) * 100) / 100,
      gap,
    };
  });
}

export let predictions: PredictionResult[] = generatePredictions();

// ── Executive Summaries (pre-seeded) ────────────────────────────────────
export let summaries: ExecutiveSummary[] = [
  {
    id: "s1",
    districtId: "d9",
    district_name: "Banaskantha",
    summary_type: "DISTRICT",
    year: 2025,
    quarter: 1,
    problem_text: "Banaskantha district demonstrates a critical under-allocation pattern in the Health sector. The current Allocation Efficiency Score (AES) of 0.68 indicates a 32% deficit relative to the predicted optimal health resource requirement, driven by elevated poverty indices (0.62) and infrastructure deficit scores (0.72) — the highest in Gujarat.",
    analysis_text: "The composite Need Index score of 0.534 places Banaskantha in the top quintile of Gujarat districts requiring immediate budgetary intervention. Historical health budget utilization rates averaging only 52% indicate systemic capacity gaps in fund absorption, primarily attributable to insufficient primary health infrastructure and shortage of qualified medical personnel in tribal areas.",
    recommendation_text: "This office recommends an immediate supplementary health allocation of ₹45 Crores for Q2 2025, channeled through the District Health Mission. Priority deployment: ₹20 Cr towards PHC infrastructure upgradation, ₹15 Cr for mobile health units in tribal blocks, and ₹10 Cr for ASHA worker capacity building. Phased disbursement with quarterly performance reviews is advised.",
    generated_by: "Bedrock (Claude 3 Sonnet)",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "s2",
    districtId: null,
    summary_type: "STATE",
    year: 2025,
    quarter: 1,
    problem_text: "Across 12 analyzed Gujarat districts, 4 districts (33%) show critical under-allocation in the Health sector while 2 districts (17%) exhibit over-allocation patterns. Total estimated health budget inefficiency stands at ₹180 Crores, representing an 11.5% systemic misallocation factor statewide.",
    analysis_text: "Northern tribal districts (Banaskantha, Kutch, Patan) consistently demonstrate higher health need indices but receive proportionally lower per-capita allocations. Urban districts (Ahmedabad, Surat, Gandhinagar) show over-allocation relative to their lower need indices, driven by historical budget inertia rather than evidence-based allocation. Statewide average health budget utilization stands at 73%.",
    recommendation_text: "A rebalancing framework targeting a Gujarat Health AES convergence band of 0.95–1.05 is achievable within two fiscal quarters through proportional redistribution. Recommended approach: redirect ₹85 Cr from over-allocated urban centers to under-served tribal and rural districts, maintaining total state health outlay at ₹1,863 Cr. Deploy DISHA monitoring dashboards at all 12 district health offices.",
    generated_by: "Bedrock (Claude 3 Sonnet)",
    createdAt: "2025-01-20T14:00:00Z",
  },
];

// ── Upload Logs ─────────────────────────────────────────────────────────
export let uploadLogs: DataUploadLog[] = [
  { id: "ul1", fileName: "gujarat_districts_2025.csv", uploadType: "districts", rowCount: 12, status: "SUCCESS", uploadedBy: "Admin User", createdAt: "2025-01-05T09:00:00Z" },
  { id: "ul2", fileName: "health_alloc_q1_2025.csv", uploadType: "allocations", rowCount: 12, status: "SUCCESS", uploadedBy: "Admin User", createdAt: "2025-01-10T11:30:00Z" },
  { id: "ul3", fileName: "health_alloc_q4_2024.csv", uploadType: "allocations", rowCount: 12, status: "SUCCESS", uploadedBy: "Admin User", createdAt: "2024-12-28T15:00:00Z" },
];

// ── Redistribution Plans ────────────────────────────────────────────────
export let redistributionPlans: RedistributionPlan[] = [];

// ── Helper Functions ────────────────────────────────────────────────────
export function getDistrictName(id: string): string {
  return districts.find(d => d.id === id)?.name || "Unknown";
}

export function getDistrict(id: string): District | undefined {
  return districts.find(d => d.id === id);
}

export function getDashboardKPIs() {
  const healthPreds = predictions;
  const total = districts.length;
  const under = healthPreds.filter(p => p.allocation_status === "UNDER").length;
  const over = healthPreds.filter(p => p.allocation_status === "OVER").length;
  const optimal = healthPreds.filter(p => p.allocation_status === "OPTIMAL").length;
  const avgAES = healthPreds.length
    ? Math.round((healthPreds.reduce((s, p) => s + p.aes_score, 0) / healthPreds.length) * 100) / 100
    : 1.0;
  return {
    totalDistricts: total,
    underCount: under,
    overCount: over,
    optimalCount: optimal,
    underPct: Math.round((under / total) * 100),
    overPct: Math.round((over / total) * 100),
    optimalPct: Math.round((optimal / total) * 100),
    avgAES,
  };
}

export function getTopDistricts(type: "under" | "over", limit = 5) {
  const status: AllocationStatus = type === "under" ? "UNDER" : "OVER";
  return predictions
    .filter(p => p.allocation_status === status)
    .map(p => ({
      districtId: p.districtId,
      name: getDistrictName(p.districtId),
      gap: Math.abs(p.gap),
      aes: p.aes_score,
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit);
}

export function getAESTrend() {
  // Simulated trend data for last 4 quarters + current
  return [
    { label: "Q1 2024", aes: 1.08 },
    { label: "Q2 2024", aes: 1.05 },
    { label: "Q3 2024", aes: 1.02 },
    { label: "Q4 2024", aes: 0.98 },
    { label: "Q1 2025", aes: getDashboardKPIs().avgAES },
  ];
}

export function getDistrictAllocations(districtId: string): AllocationRecord[] {
  return allocations.filter(a => a.districtId === districtId).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  });
}

export function getDistrictPrediction(districtId: string): PredictionResult | undefined {
  return predictions.find(p => p.districtId === districtId);
}

export function getDistrictNI(districtId: string): NeedIndex | undefined {
  return needIndices.find(n => n.districtId === districtId);
}

export function getDistrictSummary(districtId: string): ExecutiveSummary | undefined {
  return summaries.find(s => s.districtId === districtId);
}

export function getStateSummary(): ExecutiveSummary | undefined {
  return summaries.find(s => s.summary_type === "STATE");
}

export function getUtilizationStatus(rate: number): "Poor" | "Moderate" | "Good" {
  if (rate < 0.6) return "Poor";
  if (rate <= 0.8) return "Moderate";
  return "Good";
}

export function getNeedLevel(score: number): "Low" | "Medium" | "High" {
  if (score < 0.3) return "Low";
  if (score < 0.6) return "Medium";
  return "High";
}

// CSV export helper
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      return typeof val === "string" && val.includes(",") ? `"${val}"` : String(val ?? "");
    }).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Last prediction timestamp
export let lastPredictionDate: string = "2025-01-15T10:30:00Z";

export function setLastPredictionDate(date: string) {
  lastPredictionDate = date;
}

// Mutators for in-memory data
export function addAllocation(record: AllocationRecord) {
  allocations = [...allocations, record];
}

export function deleteAllocation(id: string) {
  allocations = allocations.filter(a => a.id !== id);
}

export function refreshPredictions(thresholdUnder = 0.9, thresholdOver = 1.1) {
  predictions = generatePredictions(thresholdUnder, thresholdOver);
  lastPredictionDate = new Date().toISOString();
}

export function refreshNeedIndices(w: NeedIndexWeights) {
  needIndices = generateNeedIndices(w);
}

export function addSummary(summary: ExecutiveSummary) {
  summaries = [...summaries, summary];
}

export function addUploadLog(log: DataUploadLog) {
  uploadLogs = [log, ...uploadLogs];
}

export function addRedistributionPlan(plan: RedistributionPlan) {
  redistributionPlans = [plan, ...redistributionPlans];
}

export function generateDistrictSummary(districtId: string): ExecutiveSummary {
  const d = getDistrict(districtId);
  const ni = getDistrictNI(districtId);
  const pred = getDistrictPrediction(districtId);
  const allocs = getDistrictAllocations(districtId);
  const latestAlloc = allocs[allocs.length - 1];
  const name = d?.name ?? "Unknown";
  const aes = pred?.aes_score?.toFixed(2) ?? "N/A";
  const gap = pred?.gap?.toFixed(1) ?? "N/A";
  const niScore = ni?.need_index_score?.toFixed(3) ?? "N/A";
  const utilRate = latestAlloc ? `${(latestAlloc.utilization_rate * 100).toFixed(0)}%` : "N/A";

  const summary: ExecutiveSummary = {
    id: `s${Date.now()}`,
    districtId,
    district_name: name,
    summary_type: "DISTRICT",
    year: 2025,
    quarter: 1,
    problem_text: `${name} district in Gujarat demonstrates ${pred?.allocation_status === "UNDER" ? "a significant under-allocation" : pred?.allocation_status === "OVER" ? "an over-allocation" : "a balanced allocation"} pattern in the Health sector. The current AES of ${aes} ${pred?.allocation_status === "UNDER" ? `indicates a ${((1 - (pred?.aes_score ?? 1)) * 100).toFixed(0)}% deficit` : pred?.allocation_status === "OVER" ? `indicates surplus allocation` : "indicates near-optimal allocation"} relative to predicted optimal health allocation needs, influenced by poverty index of ${d?.poverty_index} and infrastructure deficit of ${d?.infrastructure_deficit_score}.`,
    analysis_text: `The composite Health Need Index score of ${niScore} for ${name} reflects the combined impact of population density, poverty levels, infrastructure gaps, and citizen complaint patterns. Current health budget utilization rate stands at ${utilRate}. ${pred?.allocation_status === "UNDER" ? `The allocation gap of ₹${gap} Cr demands immediate supplementary budgetary intervention through the District Health Mission framework.` : `Current allocation levels ${pred?.allocation_status === "OVER" ? "exceed" : "match"} the evidence-based optimal requirement.`}`,
    recommendation_text: `${pred?.allocation_status === "UNDER" ? `This office recommends supplementary health allocation of ₹${gap} Cr for ${name} district in Q2 2025. Focus areas: PHC infrastructure (40%), mobile health units (30%), capacity building (20%), and emergency reserves (10%). Quarterly performance review mandatory.` : pred?.allocation_status === "OVER" ? `Recommend gradual reduction of ₹${Math.abs(pred?.gap ?? 0).toFixed(1)} Cr from ${name}'s health allocation over the next two quarters, redirecting funds to under-served districts while maintaining service delivery standards.` : `Maintain current allocation levels for ${name} with annual inflationary adjustment. Focus on improving utilization rate and health outcome metrics.`}`,
    generated_by: "Bedrock (Claude 3 Sonnet)",
    createdAt: new Date().toISOString(),
  };
  addSummary(summary);
  return summary;
}

export function generateStateSummary(): ExecutiveSummary {
  const kpis = getDashboardKPIs();
  const totalAlloc = allocations
    .filter(a => a.year === 2025 && a.quarter === 1)
    .reduce((s, a) => s + a.allocated_amount, 0);
  const totalGap = predictions.reduce((s, p) => s + Math.abs(p.gap), 0);

  const summary: ExecutiveSummary = {
    id: `s${Date.now()}`,
    districtId: null,
    summary_type: "STATE",
    year: 2025,
    quarter: 1,
    problem_text: `Across ${kpis.totalDistricts} analyzed Gujarat districts, ${kpis.underCount} districts (${kpis.underPct}%) show critical health under-allocation while ${kpis.overCount} districts (${kpis.overPct}%) exhibit over-allocation patterns. Total estimated health budget inefficiency stands at ₹${Math.round(totalGap)} Crores against a total deployment of ₹${Math.round(totalAlloc)} Crores, representing systemic misallocation in the state's health infrastructure spending.`,
    analysis_text: `The statewide average AES of ${kpis.avgAES} indicates ${kpis.avgAES < 1.0 ? "overall under-investment" : kpis.avgAES > 1.0 ? "marginal over-allocation patterns" : "near-balanced allocation"} in Gujarat's health sector. Tribal districts (Banaskantha, Kutch) consistently demonstrate higher health need indices but receive proportionally lower per-capita allocations. Urban centers (Ahmedabad, Surat, Gandhinagar) show relative over-allocation driven by historical budget inertia rather than evidence-based needs assessment.`,
    recommendation_text: `A rebalancing framework targeting Gujarat Health AES convergence band of 0.95–1.05 is achievable within two fiscal quarters through proportional need-based redistribution. Deploy DISHA monitoring dashboards at all ${kpis.totalDistricts} district health offices, mandate quarterly NI recalculation, and establish a Health Equity Review Committee chaired by the Principal Secretary (Health) to oversee fund reallocation.`,
    generated_by: "Bedrock (Claude 3 Sonnet)",
    createdAt: new Date().toISOString(),
  };
  // Replace existing state summary
  summaries = summaries.filter(s => s.summary_type !== "STATE");
  addSummary(summary);
  return summary;
}
