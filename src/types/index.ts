export type Role = "ADMIN" | "ANALYST" | "VIEWER";
export type Sector = "HEALTH" | "EDUCATION" | "WATER" | "INFRASTRUCTURE";
export type AllocationStatus = "UNDER" | "OVER" | "OPTIMAL";
export type ReportType = "DISTRICT" | "NATIONAL" | "SECTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface District {
  id: string;
  name: string;
  state: string;
  region: string;
  population: number;
  area_km2: number;
  literacy_rate: number;
  poverty_index: number;
  infrastructure_deficit_score: number;
  complaint_rate: number;
  lat: number;
  lng: number;
}

export interface AllocationRecord {
  id: string;
  districtId: string;
  sector: Sector;
  year: number;
  quarter: number;
  allocated_amount: number;
  utilized_amount: number;
  utilization_rate: number;
}

export interface NeedIndex {
  id: string;
  districtId: string;
  year: number;
  quarter: number;
  need_index_score: number;
  population_weight: number;
  complaint_weight: number;
  poverty_weight: number;
  infra_weight: number;
}

export interface PredictionResult {
  id: string;
  districtId: string;
  sector: Sector;
  year: number;
  quarter: number;
  predicted_need: number;
  current_allocation: number;
  aes_score: number;
  allocation_status: AllocationStatus;
  confidence_score: number;
}

export interface RedistributionPlan {
  id: string;
  createdBy: string;
  total_budget: number;
  year: number;
  quarter: number;
  sector: Sector;
  plan: RedistributionEntry[];
  generated_at: string;
}

export interface RedistributionEntry {
  districtId: string;
  districtName: string;
  current_allocation: number;
  recommended_allocation: number;
  delta_amount: number;
  delta_percent: number;
  status: AllocationStatus;
}

export interface ExecutiveSummary {
  id: string;
  districtId: string | null;
  district_name?: string;
  summary_text: string;
  generated_by: string;
  report_type: ReportType;
  createdAt: string;
}

export interface DashboardKPIs {
  totalDistricts: number;
  underAllocatedPct: number;
  overAllocatedPct: number;
  totalWastage: number;
  avgAES: number;
}

export interface NeedIndexWeights {
  w1: number;
  w2: number;
  w3: number;
  w4: number;
}
