import type { District, AllocationRecord, NeedIndex, PredictionResult, ExecutiveSummary, Sector, AllocationStatus } from "@/types";

const sectors: Sector[] = ["HEALTH", "EDUCATION", "WATER", "INFRASTRUCTURE"];

export const districts: District[] = [
  { id: "d1", name: "Ahmedabad", state: "Gujarat", region: "West", population: 5570585, area_km2: 8087, literacy_rate: 86.3, poverty_index: 0.22, infrastructure_deficit_score: 0.18, complaint_rate: 0.15, lat: 23.0225, lng: 72.5714 },
  { id: "d2", name: "Surat", state: "Gujarat", region: "West", population: 4466826, area_km2: 4418, literacy_rate: 87.9, poverty_index: 0.19, infrastructure_deficit_score: 0.15, complaint_rate: 0.12, lat: 21.1702, lng: 72.8311 },
  { id: "d3", name: "Vadodara", state: "Gujarat", region: "West", population: 1666703, area_km2: 7794, literacy_rate: 81.9, poverty_index: 0.28, infrastructure_deficit_score: 0.32, complaint_rate: 0.22, lat: 22.3072, lng: 73.1812 },
  { id: "d4", name: "Rajkot", state: "Gujarat", region: "West", population: 1286678, area_km2: 11203, literacy_rate: 80.9, poverty_index: 0.31, infrastructure_deficit_score: 0.35, complaint_rate: 0.28, lat: 22.3039, lng: 70.8022 },
  { id: "d5", name: "Mumbai", state: "Maharashtra", region: "West", population: 8400000, area_km2: 603, literacy_rate: 90.3, poverty_index: 0.15, infrastructure_deficit_score: 0.12, complaint_rate: 0.18, lat: 19.0760, lng: 72.8777 },
  { id: "d6", name: "Pune", state: "Maharashtra", region: "West", population: 3124458, area_km2: 15643, literacy_rate: 89.5, poverty_index: 0.17, infrastructure_deficit_score: 0.14, complaint_rate: 0.10, lat: 18.5204, lng: 73.8567 },
  { id: "d7", name: "Nagpur", state: "Maharashtra", region: "Central", population: 2405421, area_km2: 9892, literacy_rate: 87.3, poverty_index: 0.26, infrastructure_deficit_score: 0.38, complaint_rate: 0.32, lat: 21.1458, lng: 79.0882 },
  { id: "d8", name: "Delhi", state: "Delhi", region: "North", population: 7500000, area_km2: 1484, literacy_rate: 86.2, poverty_index: 0.14, infrastructure_deficit_score: 0.20, complaint_rate: 0.35, lat: 28.7041, lng: 77.1025 },
  { id: "d9", name: "Lucknow", state: "Uttar Pradesh", region: "North", population: 2817105, area_km2: 2528, literacy_rate: 77.3, poverty_index: 0.42, infrastructure_deficit_score: 0.55, complaint_rate: 0.48, lat: 26.8467, lng: 80.9462 },
  { id: "d10", name: "Varanasi", state: "Uttar Pradesh", region: "North", population: 1198491, area_km2: 1535, literacy_rate: 75.6, poverty_index: 0.52, infrastructure_deficit_score: 0.62, complaint_rate: 0.55, lat: 25.3176, lng: 82.9739 },
  { id: "d11", name: "Chennai", state: "Tamil Nadu", region: "South", population: 4681087, area_km2: 426, literacy_rate: 90.1, poverty_index: 0.16, infrastructure_deficit_score: 0.15, complaint_rate: 0.14, lat: 13.0827, lng: 80.2707 },
  { id: "d12", name: "Coimbatore", state: "Tamil Nadu", region: "South", population: 1601438, area_km2: 4723, literacy_rate: 88.0, poverty_index: 0.20, infrastructure_deficit_score: 0.22, complaint_rate: 0.18, lat: 11.0168, lng: 76.9558 },
  { id: "d13", name: "Bengaluru", state: "Karnataka", region: "South", population: 5104047, area_km2: 2190, literacy_rate: 89.6, poverty_index: 0.13, infrastructure_deficit_score: 0.16, complaint_rate: 0.20, lat: 12.9716, lng: 77.5946 },
  { id: "d14", name: "Mysuru", state: "Karnataka", region: "South", population: 920550, area_km2: 6854, literacy_rate: 82.8, poverty_index: 0.30, infrastructure_deficit_score: 0.28, complaint_rate: 0.22, lat: 12.2958, lng: 76.6394 },
  { id: "d15", name: "Kolkata", state: "West Bengal", region: "East", population: 4496694, area_km2: 185, literacy_rate: 87.1, poverty_index: 0.24, infrastructure_deficit_score: 0.42, complaint_rate: 0.38, lat: 22.5726, lng: 88.3639 },
  { id: "d16", name: "Howrah", state: "West Bengal", region: "East", population: 1077075, area_km2: 1467, literacy_rate: 83.2, poverty_index: 0.38, infrastructure_deficit_score: 0.52, complaint_rate: 0.45, lat: 22.5958, lng: 88.2636 },
  { id: "d17", name: "Jaipur", state: "Rajasthan", region: "West", population: 3073350, area_km2: 11117, literacy_rate: 76.4, poverty_index: 0.35, infrastructure_deficit_score: 0.40, complaint_rate: 0.30, lat: 26.9124, lng: 75.7873 },
  { id: "d18", name: "Jodhpur", state: "Rajasthan", region: "West", population: 1033918, area_km2: 22850, literacy_rate: 65.9, poverty_index: 0.55, infrastructure_deficit_score: 0.65, complaint_rate: 0.58, lat: 26.2389, lng: 73.0243 },
  { id: "d19", name: "Bhopal", state: "Madhya Pradesh", region: "Central", population: 1798218, area_km2: 2772, literacy_rate: 80.3, poverty_index: 0.38, infrastructure_deficit_score: 0.45, complaint_rate: 0.35, lat: 23.2599, lng: 77.4126 },
  { id: "d20", name: "Indore", state: "Madhya Pradesh", region: "Central", population: 1964086, area_km2: 3898, literacy_rate: 82.3, poverty_index: 0.30, infrastructure_deficit_score: 0.33, complaint_rate: 0.25, lat: 22.7196, lng: 75.8577 },
];

function rand(min: number, max: number) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function generateAllocations(): AllocationRecord[] {
  const records: AllocationRecord[] = [];
  let id = 1;
  for (const d of districts) {
    for (const year of [2023, 2024, 2025]) {
      for (const quarter of [1, 2, 3, 4]) {
        if (year === 2025 && quarter > 1) continue;
        for (const sector of sectors) {
          const allocated = rand(15, 450);
          const utilRate = rand(0.42, 0.98);
          records.push({
            id: `a${id++}`,
            districtId: d.id,
            sector,
            year,
            quarter,
            allocated_amount: allocated,
            utilized_amount: Math.round(allocated * utilRate * 100) / 100,
            utilization_rate: utilRate,
          });
        }
      }
    }
  }
  return records;
}

export const allocations: AllocationRecord[] = generateAllocations();

function computeNeedIndex(d: District, w = { w1: 0.3, w2: 0.25, w3: 0.25, w4: 0.2 }): number {
  const maxPop = Math.max(...districts.map(x => x.population / x.area_km2));
  const nPop = (d.population / d.area_km2) / maxPop;
  return Math.round((w.w1 * nPop + w.w2 * d.complaint_rate + w.w3 * d.poverty_index + w.w4 * d.infrastructure_deficit_score) * 1000) / 1000;
}

export function generateNeedIndices(): NeedIndex[] {
  return districts.map((d, i) => ({
    id: `ni${i + 1}`,
    districtId: d.id,
    year: 2025,
    quarter: 1,
    need_index_score: computeNeedIndex(d),
    population_weight: 0.3,
    complaint_weight: 0.25,
    poverty_weight: 0.25,
    infra_weight: 0.2,
  }));
}

export const needIndices: NeedIndex[] = generateNeedIndices();

export function generatePredictions(): PredictionResult[] {
  return districts.flatMap((d, i) =>
    sectors.map((sector, j) => {
      const ni = needIndices.find(n => n.districtId === d.id)!;
      const currentAlloc = allocations.find(a => a.districtId === d.id && a.sector === sector && a.year === 2025 && a.quarter === 1)?.allocated_amount || rand(50, 300);
      const predictedNeed = Math.round(currentAlloc * (0.7 + ni.need_index_score * 1.2) * 100) / 100;
      const aes = Math.round((currentAlloc / predictedNeed) * 100) / 100;
      let status: AllocationStatus = "OPTIMAL";
      if (aes < 0.9) status = "UNDER";
      else if (aes > 1.1) status = "OVER";
      return {
        id: `p${i * 4 + j + 1}`,
        districtId: d.id,
        sector,
        year: 2025,
        quarter: 1,
        predicted_need: predictedNeed,
        current_allocation: currentAlloc,
        aes_score: aes,
        allocation_status: status,
        confidence_score: rand(0.72, 0.96),
      };
    })
  );
}

export const predictions: PredictionResult[] = generatePredictions();

export const summaries: ExecutiveSummary[] = [
  {
    id: "s1",
    districtId: "d10",
    district_name: "Varanasi",
    summary_text: `**Problem Statement:** Varanasi district demonstrates a significant under-allocation pattern across critical sectors, particularly Health and Water Supply. The current Allocation Efficiency Score (AES) of 0.68 indicates a 32% deficit relative to predicted optimal resource requirements, driven by elevated poverty indices (0.52) and infrastructure deficit scores (0.62).\n\n**Analysis:** The composite Need Index score of 0.482 places Varanasi in the top quintile of districts requiring immediate budgetary intervention. Historical utilization rates averaging 78% suggest absorptive capacity exists for additional funds. The complaint rate of 0.55 — highest among comparable districts — further validates unmet public service demand.\n\n**Recommendation:** This office recommends an immediate supplementary allocation of ₹85.4 Crores across HEALTH (₹35 Cr) and WATER (₹28 Cr) sectors for Q2 2025. Phased disbursement with quarterly performance reviews is advised to maintain fiscal discipline while addressing critical shortfalls.`,
    generated_by: "GPT-4o",
    report_type: "DISTRICT",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "s2",
    districtId: null,
    summary_text: `**National Allocation Assessment — Q1 2025:** Across 20 analyzed districts, 35% show under-allocation while 20% exhibit over-allocation patterns. Total estimated budget inefficiency stands at ₹1,247 Crores, representing a 12.3% systemic waste factor.\n\n**Key Findings:** Northern region districts (Lucknow, Varanasi, Jodhpur) consistently demonstrate higher need indices but receive proportionally lower allocations. Southern and Western metropolitan districts show over-allocation tendencies, particularly in Infrastructure sector.\n\n**Policy Direction:** A rebalancing framework targeting a national AES convergence band of 0.95–1.05 is achievable within two fiscal quarters through the proposed redistribution mechanism without increasing total outlay.`,
    generated_by: "GPT-4o",
    report_type: "NATIONAL",
    createdAt: "2025-01-20T14:00:00Z",
  },
];

export function getDistrictName(id: string): string {
  return districts.find(d => d.id === id)?.name || "Unknown";
}

export function getDashboardKPIs() {
  const total = districts.length;
  const under = predictions.filter(p => p.allocation_status === "UNDER").length;
  const over = predictions.filter(p => p.allocation_status === "OVER").length;
  const totalPreds = predictions.length;
  const avgAES = Math.round((predictions.reduce((s, p) => s + p.aes_score, 0) / totalPreds) * 100) / 100;
  const wastage = Math.round(predictions.filter(p => p.allocation_status !== "OPTIMAL").reduce((s, p) => s + Math.abs(p.current_allocation - p.predicted_need), 0) * 100) / 100;
  return {
    totalDistricts: total,
    underAllocatedPct: Math.round((under / totalPreds) * 100),
    overAllocatedPct: Math.round((over / totalPreds) * 100),
    totalWastage: wastage,
    avgAES: avgAES,
  };
}

export function getTopDistricts(type: "under" | "over", limit = 10) {
  const status: AllocationStatus = type === "under" ? "UNDER" : "OVER";
  const filtered = predictions.filter(p => p.allocation_status === status);
  const grouped = new Map<string, number>();
  filtered.forEach(p => {
    const current = grouped.get(p.districtId) || 0;
    grouped.set(p.districtId, current + Math.abs(p.current_allocation - p.predicted_need));
  });
  return Array.from(grouped.entries())
    .map(([districtId, gap]) => ({ districtId, name: getDistrictName(districtId), gap: Math.round(gap * 100) / 100 }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit);
}

export function getAESTrend() {
  const quarters = [
    { year: 2024, quarter: 1 }, { year: 2024, quarter: 2 },
    { year: 2024, quarter: 3 }, { year: 2024, quarter: 4 },
    { year: 2025, quarter: 1 },
  ];
  return quarters.map(q => ({
    label: `Q${q.quarter} ${q.year}`,
    aes: Math.round((0.85 + Math.random() * 0.25) * 100) / 100,
  }));
}

export function getSectorSummary() {
  return sectors.map(sector => {
    const sectorAllocs = allocations.filter(a => a.sector === sector && a.year === 2025 && a.quarter === 1);
    const totalAlloc = Math.round(sectorAllocs.reduce((s, a) => s + a.allocated_amount, 0));
    const sectorPreds = predictions.filter(p => p.sector === sector);
    const totalNeed = Math.round(sectorPreds.reduce((s, p) => s + p.predicted_need, 0));
    return { sector, allocated: totalAlloc, needed: totalNeed };
  });
}
