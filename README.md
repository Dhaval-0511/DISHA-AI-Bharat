# DISHA – Data Intelligence for Smart Handling of Allocation 🇮🇳

DISHA (Data Intelligence for Smart Handling of Allocation) is an AI-driven public finance decision-support engine that detects budget misallocation across districts and recommends optimized redistribution under fixed budget constraints.

Built on an AWS analytics + ML stack, DISHA ingests district-level socio-economic indicators, computes a composite Need Index, predicts required allocations, and flags under- or over-funded regions using data-driven intelligence.

---

## 📌 Problem Statement

Public budgets are often allocated using historical expenditure trends rather than real-time need assessment. This results in:

- Under-funded high-need districts
- Over-funded relatively stable districts
- Lack of continuous validation of allocation efficiency
- Limited analytical capacity for forward-looking governance

DISHA addresses this gap by transforming public budgeting into a measurable, explainable, and optimization-driven process.

---

## 🎯 Objectives

- Compute a **Need Index (NI)** per district using socio-economic indicators
- Predict next-period required budget using ML regression
- Calculate **Allocation Efficiency Score (AES)**
- Classify districts as under-allocated, balanced, or over-allocated
- Recommend optimized redistribution under a fixed total budget
- Generate executive-level summaries for policymakers

---

## 🧠 Core Analytical Framework

### 1️⃣ Need Index (NI)

For each district:

NI_d = w1·PD_d + w2·CR_d + w3·PI_d + w4·IDS_d

Where:

- PD = Normalized Population Density  
- CR = Complaint Rate per 1000 citizens  
- PI = Poverty Index  
- IDS = Infrastructure Deficit Score (1 - Infrastructure_Index)

Weights are configurable and sum to 1.

---

### 2️⃣ Predicted Need (Budget Requirement)

Target:
Predicted_Need_d (₹ for next period)

Model:
- XGBoost Regression (Amazon SageMaker)
- Optional time-series extension (AWS Forecast)

Features include:
- Need Index
- Historical Allocation (lags)
- Population
- Poverty Rate
- Infrastructure Index
- Complaint Rate
- Period features

---

### 3️⃣ Allocation Efficiency Score (AES)

AES_d = CurrentAllocation_d / PredictedNeed_d

Classification:

- AES < 0.9 → Under-allocated
- 0.9 ≤ AES ≤ 1.1 → Balanced
- AES > 1.1 → Over-allocated

---

## 🏗️ High-Level AWS Architecture

DISHA is built entirely on AWS managed services.

### 🔹 Data Layer
- Amazon S3 (Raw & Processed Buckets)
- AWS Glue (ETL + Data Catalog)
- Amazon Athena (SQL analytics)

### 🔹 AI Layer
- Amazon SageMaker (XGBoost regression)
- Batch transform / real-time inference

### 🔹 Optimization Layer
- AWS Lambda or SageMaker Processing
- Linear optimization (PuLP / SciPy)
- Constrained redistribution under fixed total budget

### 🔹 Intelligence Layer
- AWS Bedrock
- Auto-generated executive summaries

### 🔹 Presentation Layer
- Amazon QuickSight
- District-level dashboards & heatmaps

---

## 📊 Core Dashboard Insights

- District heatmap (Under / Balanced / Over)
- Current Allocation vs Predicted Need
- Need Index trend over time
- Recommended Allocation changes (%)

Color scheme:
- 🔴 Under-allocated
- 🟡 Balanced
- 🟢 Over-allocated

---

## ⚙️ Functional Requirements

### Data & Processing
- Ingest district-level CSV files from S3
- Compute Need Index automatically
- Store processed datasets in Glue Catalog

### Prediction & Scoring
- Train XGBoost regression model
- Predict district-level budget requirements
- Compute AES classification

### Optimization
- Accept total budget constraint
- Generate optimized district allocations
- Output % change vs current allocation

### Intelligence & Reporting
- Generate executive summary via Bedrock
- Provide QuickSight dashboard for policymakers

---

## 🔒 Non-Functional Requirements

- Modular architecture (independent layers)
- Low-cost MVP (AWS free-tier optimized)
- Re-runnable for new budget cycles
- Extendable to sector-specific allocations (health, water, education)

---

## 🚀 Development Roadmap

### Phase 1 – MVP
- Mock dataset (10–20 districts)
- NI computation via Glue ETL
- XGBoost model in SageMaker
- AES classification
- QuickSight visualization
- Basic executive summary

### Phase 2 – Advanced
- Constrained linear optimization
- Scenario simulator (Population +5%, Complaints +20%)
- Sector-wise allocation engine
- Model explainability (SHAP values)
- Drift tracking across cycles

---

## 🔁 End-to-End Data Flow

1. District CSV uploaded to S3
2. Glue ETL computes NI and features
3. Athena prepares training dataset
4. SageMaker predicts required allocation
5. Lambda runs optimization (optional)
6. Bedrock generates summary
7. QuickSight refreshes dashboards

---

## 🧪 Model Evaluation

- Train-test split validation
- RMSE / MAPE metrics
- Policy sanity checks
- Feature importance validation

---

## 🌍 Impact Potential

DISHA transforms budgeting from reactive to predictive.

It enables:
- Transparent allocation logic
- Evidence-based policymaking
- Data-backed redistribution
- Scalable governance intelligence

---

## 🛠️ Tech Stack

Cloud:
- AWS (S3, Glue, Athena, SageMaker, Lambda, Bedrock, QuickSight)

ML:
- XGBoost Regression

Optimization:
- Linear Programming (PuLP / SciPy)

Analytics:
- SQL (Athena)
- Dashboarding (QuickSight)

---

## 🔮 Future Extensions

- Real grievance portal integration
- SHAP-based explainability
- Participatory budgeting integration
- Integration with state finance dashboards
- API exposure for automated governance workflows

