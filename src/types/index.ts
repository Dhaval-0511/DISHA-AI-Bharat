export type Role = "ADMIN" | "ANALYST" | "VIEWER";
export type AllocationStatus = "UNDER" | "OVER" | "OPTIMAL";
export type SummaryType = "DISTRICT" | "STATE";
export type UserStatus = "Active" | "Inactive";
export type UtilizationStatus = "Poor" | "Moderate" | "Good";
export type NeedLevel = "Low" | "Medium" | "High";
export type RegionType = "Urban" | "Rural" | "Tribal";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  region: RegionType;
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
  population_contribution: number;
  complaint_contribution: number;
  poverty_contribution: number;
  infra_contribution: number;
}

export interface PredictionResult {
  id: string;
  districtId: string;
  year: number;
  quarter: number;
  predicted_need: number;
  current_allocation: number;
  aes_score: number;
  allocation_status: AllocationStatus;
  confidence_score: number;
  gap: number;
}

export interface RedistributionPlan {
  id: string;
  createdBy: string;
  total_budget: number;
  year: number;
  quarter: number;
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
  status: "INCREASE" | "DECREASE" | "SAME";
}

export interface ExecutiveSummary {
  id: string;
  districtId: string | null;
  district_name?: string;
  summary_type: SummaryType;
  year: number;
  quarter: number;
  problem_text: string;
  analysis_text: string;
  recommendation_text: string;
  generated_by: string;
  createdAt: string;
}

export interface NeedIndexWeights {
  w1: number;
  w2: number;
  w3: number;
  w4: number;
}

export interface AESThresholds {
  under: number;
  over: number;
}

export interface SystemSettings {
  weights: NeedIndexWeights;
  thresholds: AESThresholds;
  primaryModel: string;
  fallbackModel: string;
  modelStatus: "connected" | "unreachable";
}

export interface DataUploadLog {
  id: string;
  fileName: string;
  uploadType: "districts" | "allocations";
  rowCount: number;
  status: "PROCESSING" | "SUCCESS" | "FAILED";
  error?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface DashboardKPIs {
  totalDistricts: number;
  underCount: number;
  overCount: number;
  optimalCount: number;
  underPct: number;
  overPct: number;
  optimalPct: number;
  avgAES: number;
}
