# Requirements Document: DISHA Governance Engine

## Introduction

DISHA (Data Intelligence for Smart Handling of Allocation) is a Public Resource Misallocation Intelligence System (PRMIS) that detects under-allocation and over-allocation of public resources across districts using predictive modeling and optimization. The system addresses the critical problem of inefficient budget allocation in governance by replacing historical trend-based allocation with data-driven, predictive optimization.

The system operates as an AI-powered cloud governance engine (not an application or chatbot) that:
1. Ingests district-level socioeconomic indicators
2. Computes need-based allocation scores
3. Predicts optimal resource distribution
4. Identifies allocation imbalances
5. Generates actionable policy recommendations

## Glossary

- **DISHA_System**: The complete Public Resource Misallocation Intelligence System
- **Need_Index (NI)**: A weighted composite score representing district-level resource requirements
- **Allocation_Efficiency_Score (AES)**: Ratio of current allocation to predicted need (Current/Predicted)
- **District**: A geographic administrative unit for which resource allocation is managed
- **Period**: A time unit (year or quarter) for which allocations and indicators are measured
- **Data_Ingestion_Module**: Component responsible for loading and validating raw data from S3
- **Preprocessing_Module**: Component that cleans, transforms, and engineers features
- **Prediction_Module**: ML component that forecasts required allocations using XGBoost
- **Optimization_Module**: Component that computes optimal allocation distribution under budget constraints
- **Intelligence_Module**: Component that generates executive summaries using AWS Bedrock
- **Visualization_Module**: Component that renders dashboards using AWS QuickSight
- **Under_Allocated_District**: District with AES < 0.9
- **Over_Allocated_District**: District with AES > 1.1
- **Balanced_District**: District with 0.9 ≤ AES ≤ 1.1

## Requirements

### Requirement 1: Data Ingestion

**User Story:** As a system administrator, I want to ingest district-level data from S3, so that the system has current socioeconomic indicators for analysis.

#### Acceptance Criteria

1. WHEN a CSV file is uploaded to the raw data S3 bucket, THE Data_Ingestion_Module SHALL validate the file schema against required columns
2. WHEN the file schema is invalid, THE Data_Ingestion_Module SHALL log a descriptive error and halt processing
3. WHEN the file schema is valid, THE Data_Ingestion_Module SHALL load all records into memory for preprocessing
4. THE Data_Ingestion_Module SHALL support the following required columns: District_ID, District_Name, Population, Population_Density, Historical_Allocation, Complaint_Count, Infrastructure_Index, Poverty_Rate, Literacy_Rate, Period
5. WHEN duplicate District_ID-Period combinations exist, THE Data_Ingestion_Module SHALL reject the file and report the duplicates

### Requirement 2: Need Index Computation

**User Story:** As a policy analyst, I want the system to compute a Need Index for each district, so that I can quantify relative resource requirements.

#### Acceptance Criteria

1. THE Preprocessing_Module SHALL compute Need_Index using the formula: NI = (w1 × Population_Density) + (w2 × Complaint_Rate) + (w3 × Poverty_Rate) + (w4 × Infrastructure_Deficit_Score)
2. THE Preprocessing_Module SHALL normalize Population_Density to range [0, 1] using min-max scaling across all districts in the dataset
3. THE Preprocessing_Module SHALL compute Complaint_Rate as Complaint_Count per 100,000 population, then normalize to [0, 1]
4. THE Preprocessing_Module SHALL compute Infrastructure_Deficit_Score as (1 - Infrastructure_Index)
5. THE Preprocessing_Module SHALL use configurable weights (w1, w2, w3, w4) that sum to 1.0
6. WHEN weights do not sum to 1.0, THE Preprocessing_Module SHALL normalize them proportionally
7. THE Preprocessing_Module SHALL store the computed Need_Index as a new column in the processed dataset

### Requirement 3: Data Storage and Cataloging

**User Story:** As a data engineer, I want processed data stored in a queryable format, so that downstream modules can access clean data efficiently.

#### Acceptance Criteria

1. WHEN preprocessing completes successfully, THE Preprocessing_Module SHALL write the processed dataset to the processed data S3 bucket in Parquet format
2. THE Preprocessing_Module SHALL register the processed dataset with AWS Glue Data Catalog
3. THE DISHA_System SHALL maintain separate S3 buckets for raw data and processed data
4. WHEN a new dataset is processed, THE Preprocessing_Module SHALL partition data by Period for efficient querying
5. THE DISHA_System SHALL enable SQL queries on processed data via AWS Athena

### Requirement 4: Predictive Model Training

**User Story:** As a data scientist, I want to train a regression model to predict required allocations, so that the system can forecast resource needs.

#### Acceptance Criteria

1. THE Prediction_Module SHALL train an XGBoost regression model using historical data
2. THE Prediction_Module SHALL use the following features: Population, Population_Density, Complaint_Count, Infrastructure_Index, Poverty_Rate, Literacy_Rate, Need_Index
3. THE Prediction_Module SHALL use Historical_Allocation as the target variable during training
4. THE Prediction_Module SHALL split data into 80% training and 20% testing sets
5. THE Prediction_Module SHALL evaluate model performance using RMSE and MAPE metrics
6. WHEN RMSE exceeds a configurable threshold, THE Prediction_Module SHALL log a warning about model quality
7. THE Prediction_Module SHALL serialize the trained model to S3 for reuse
8. THE Prediction_Module SHALL support retraining when new historical data becomes available

### Requirement 5: Allocation Prediction

**User Story:** As a budget planner, I want predictions of required allocations for the upcoming period, so that I can identify potential imbalances.

#### Acceptance Criteria

1. WHEN the Prediction_Module receives current period district data, THE Prediction_Module SHALL generate predicted required allocation for each district
2. THE Prediction_Module SHALL load the most recently trained model from S3
3. WHEN no trained model exists, THE Prediction_Module SHALL return an error indicating training is required
4. THE Prediction_Module SHALL output predictions in the same currency units as Historical_Allocation
5. THE Prediction_Module SHALL store predictions alongside district data in the processed S3 bucket

### Requirement 6: Allocation Efficiency Scoring

**User Story:** As a governance officer, I want to see which districts are under-allocated or over-allocated, so that I can prioritize reallocation efforts.

#### Acceptance Criteria

1. THE Preprocessing_Module SHALL compute Allocation_Efficiency_Score as: AES = Current_Allocation / Predicted_Need
2. WHEN Predicted_Need is zero or negative, THE Preprocessing_Module SHALL flag the district as having invalid data
3. THE Preprocessing_Module SHALL classify districts as Under_Allocated_District when AES < 0.9
4. THE Preprocessing_Module SHALL classify districts as Over_Allocated_District when AES > 1.1
5. THE Preprocessing_Module SHALL classify districts as Balanced_District when 0.9 ≤ AES ≤ 1.1
6. THE Preprocessing_Module SHALL store AES and classification labels in the processed dataset

### Requirement 7: Budget-Constrained Optimization

**User Story:** As a finance minister, I want to see optimal allocation recommendations under a fixed total budget, so that I can minimize imbalances without increasing spending.

#### Acceptance Criteria

1. WHEN the Optimization_Module receives a total budget constraint, THE Optimization_Module SHALL compute recommended allocations that minimize the sum of squared deviations from predicted needs
2. THE Optimization_Module SHALL ensure the sum of recommended allocations equals the total budget constraint
3. THE Optimization_Module SHALL ensure all recommended allocations are non-negative
4. THE Optimization_Module SHALL compute percentage change from current allocation for each district
5. WHEN optimization fails to converge, THE Optimization_Module SHALL return an error with diagnostic information
6. THE Optimization_Module SHALL output recommended allocations in a structured format with District_ID, Current_Allocation, Recommended_Allocation, Percentage_Change

### Requirement 8: Executive Summary Generation

**User Story:** As a policy maker, I want AI-generated executive summaries of allocation analysis, so that I can quickly understand key findings without reviewing raw data.

#### Acceptance Criteria

1. WHEN the Intelligence_Module receives allocation analysis results, THE Intelligence_Module SHALL generate an executive summary using AWS Bedrock
2. THE Intelligence_Module SHALL include the following in summaries: total number of under-allocated districts, total number of over-allocated districts, top 3 most under-allocated districts with specific deficit amounts, top 3 most over-allocated districts with specific excess amounts, key policy recommendations
3. THE Intelligence_Module SHALL format summaries in clear, non-technical language suitable for executive audiences
4. THE Intelligence_Module SHALL limit summaries to 500 words or fewer
5. WHEN Bedrock API calls fail, THE Intelligence_Module SHALL return a fallback template-based summary

### Requirement 9: Dashboard Visualization

**User Story:** As a governance analyst, I want interactive dashboards showing allocation patterns, so that I can explore data visually and identify trends.

#### Acceptance Criteria

1. THE Visualization_Module SHALL create an AWS QuickSight dashboard connected to the processed data in Athena
2. THE Visualization_Module SHALL include a geographic heatmap showing AES by district
3. THE Visualization_Module SHALL include a bar chart comparing current allocation vs predicted need for all districts
4. THE Visualization_Module SHALL include a distribution histogram of Need_Index values
5. THE Visualization_Module SHALL include a time-series line chart showing allocation trends by period
6. THE Visualization_Module SHALL enable filtering by Period, District classification (under/over/balanced), and AES range
7. WHEN dashboard data is older than 7 days, THE Visualization_Module SHALL display a staleness warning

### Requirement 10: Modular Architecture

**User Story:** As a system architect, I want clear separation between data, prediction, optimization, and intelligence layers, so that the system is maintainable and extensible.

#### Acceptance Criteria

1. WHEN the Data_Ingestion_Module is modified, THE Prediction_Module, Optimization_Module, and Intelligence_Module SHALL remain unaffected
2. WHEN the Prediction_Module is modified, THE Optimization_Module and Intelligence_Module SHALL continue functioning with updated predictions
3. THE DISHA_System SHALL define clear interfaces between modules using standardized data schemas
4. THE DISHA_System SHALL enable independent testing of each module
5. THE DISHA_System SHALL support adding new features (e.g., additional indicators) without modifying core module logic

### Requirement 11: Reprocessing and Reproducibility

**User Story:** As a data engineer, I want to rerun the entire pipeline for new budget cycles, so that the system produces consistent results for each period.

#### Acceptance Criteria

1. THE DISHA_System SHALL support reprocessing all data for a specific Period without affecting other periods
2. WHEN the same input data is processed multiple times, THE DISHA_System SHALL produce identical outputs
3. THE DISHA_System SHALL log all processing steps with timestamps for audit trails
4. THE DISHA_System SHALL version trained models with training date and performance metrics
5. THE DISHA_System SHALL enable rollback to previous model versions if needed

### Requirement 12: Error Handling and Validation

**User Story:** As a system operator, I want clear error messages and data validation, so that I can quickly diagnose and fix issues.

#### Acceptance Criteria

1. WHEN any module encounters an error, THE DISHA_System SHALL log the error with module name, timestamp, and descriptive message
2. THE Data_Ingestion_Module SHALL validate that numeric columns contain valid numbers within expected ranges
3. THE Data_Ingestion_Module SHALL validate that Infrastructure_Index, Poverty_Rate, and Literacy_Rate are in range [0, 1]
4. WHEN validation fails, THE Data_Ingestion_Module SHALL report all validation errors in a single batch
5. THE Prediction_Module SHALL validate that all required features are present before making predictions
6. WHEN predictions produce negative values, THE Prediction_Module SHALL log a warning and clip values to zero

### Requirement 13: Configuration Management

**User Story:** As a system administrator, I want configurable parameters for weights and thresholds, so that the system can be tuned for different governance contexts.

#### Acceptance Criteria

1. THE DISHA_System SHALL load configuration from a JSON file stored in S3
2. THE DISHA_System SHALL support configuring Need_Index weights (w1, w2, w3, w4)
3. THE DISHA_System SHALL support configuring AES classification thresholds (under_threshold, over_threshold)
4. THE DISHA_System SHALL support configuring model hyperparameters (learning_rate, max_depth, n_estimators)
5. WHEN configuration file is missing or invalid, THE DISHA_System SHALL use documented default values
6. THE DISHA_System SHALL log the active configuration at the start of each processing run

### Requirement 14: Model Evaluation and Monitoring

**User Story:** As a data scientist, I want to track model performance over time, so that I can identify when retraining is needed.

#### Acceptance Criteria

1. THE Prediction_Module SHALL compute and log RMSE and MAPE after each training run
2. THE Prediction_Module SHALL store evaluation metrics alongside the trained model in S3
3. THE Prediction_Module SHALL compare current model performance against the previous model
4. WHEN current model performance is worse than previous model by more than 10%, THE Prediction_Module SHALL log a warning
5. THE DISHA_System SHALL maintain a model performance history table accessible via Athena

### Requirement 15: Scenario Testing Support

**User Story:** As a policy analyst, I want to test "what-if" scenarios with modified inputs, so that I can evaluate policy impacts before implementation.

#### Acceptance Criteria

1. WHERE scenario testing is enabled, THE DISHA_System SHALL accept modified district data as input
2. WHERE scenario testing is enabled, THE DISHA_System SHALL process scenario data through the full pipeline without affecting production data
3. WHERE scenario testing is enabled, THE DISHA_System SHALL store scenario results in a separate S3 prefix
4. WHERE scenario testing is enabled, THE DISHA_System SHALL label all scenario outputs with a scenario identifier
5. WHERE scenario testing is enabled, THE Visualization_Module SHALL support comparing scenario results against baseline allocations
