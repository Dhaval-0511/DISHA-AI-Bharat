# Implementation Plan: DISHA Governance Engine

## Overview

This implementation plan breaks down the DISHA system into discrete, incremental coding tasks. The system will be built as a Python-based AWS cloud application with five main layers: Data, AI, Optimization, Intelligence, and Presentation. Each task builds on previous work, with testing integrated throughout to validate correctness early.

The implementation follows a bottom-up approach: core data processing → ML prediction → optimization → intelligence → visualization, with configuration and error handling integrated at each stage.

## Tasks

- [ ] 1. Set up project structure and core infrastructure
  - Create Python project with virtual environment
  - Set up directory structure: `src/`, `tests/`, `config/`, `scripts/`
  - Create `requirements.txt` with dependencies: pandas, numpy, boto3, xgboost, scipy, hypothesis, pytest
  - Create AWS resource configuration file template (`config/aws_config.json`)
  - Set up logging configuration with CloudWatch format
  - _Requirements: 13.1, 12.1_

- [ ] 2. Implement configuration management
  - [ ] 2.1 Create configuration loader module
    - Implement `load_config_from_s3()` function to read JSON from S3
    - Implement `parse_config()` function to validate and parse configuration
    - Implement `get_default_config()` function with documented defaults
    - Handle missing/invalid configuration with fallback to defaults
    - _Requirements: 13.1, 13.5_
  
  - [ ]* 2.2 Write property test for configuration round trip
    - **Property 25: Configuration Round Trip**
    - **Validates: Requirements 13.1**
    - Generate random valid configurations, save to JSON, load back, verify equality
  
  - [ ] 2.3 Create configuration schema and validation
    - Define configuration dataclass with type hints
    - Implement weight normalization for Need Index weights
    - Validate AES thresholds, model hyperparameters
    - _Requirements: 13.2, 13.3, 13.4, 2.6_
  
  - [ ]* 2.4 Write unit tests for configuration validation
    - Test default configuration loading
    - Test weight normalization
    - Test invalid configuration handling

- [ ] 3. Implement data ingestion module
  - [ ] 3.1 Create schema validation functions
    - Implement `validate_schema()` to check required columns
    - Implement `validate_numeric_ranges()` for range checking
    - Implement `check_duplicates()` for (District_ID, Period) uniqueness
    - Return structured validation results with error details
    - _Requirements: 1.1, 1.2, 1.5, 12.2, 12.3_
  
  - [ ]* 3.2 Write property test for schema validation
    - **Property 1: Schema Validation Correctness**
    - **Validates: Requirements 1.1, 1.3**
    - Generate random CSV structures, verify correct accept/reject behavior
  
  - [ ]* 3.3 Write property test for duplicate detection
    - **Property 2: Duplicate Detection**
    - **Validates: Requirements 1.5**
    - Generate datasets with/without duplicates, verify detection
  
  - [ ]* 3.4 Write property test for input validation
    - **Property 22: Input Validation Range Checking**
    - **Validates: Requirements 12.2, 12.3**
    - Generate data with out-of-range values, verify rejection
  
  - [ ] 3.5 Implement data loading from S3
    - Implement `load_raw_data()` to read CSV from S3 using boto3
    - Integrate validation functions
    - Implement batch error reporting
    - _Requirements: 1.3, 12.4_
  
  - [ ]* 3.6 Write property test for batch error reporting
    - **Property 23: Batch Error Reporting**
    - **Validates: Requirements 12.4**
    - Generate data with multiple errors, verify all reported together

- [ ] 4. Implement preprocessing module - feature engineering
  - [ ] 4.1 Create normalization functions
    - Implement `normalize_minmax()` for min-max scaling
    - Handle edge cases (all values identical, single value)
    - _Requirements: 2.2_
  
  - [ ]* 4.2 Write property test for normalization
    - **Property 4: Normalization Range Invariant**
    - **Validates: Requirements 2.2, 2.3**
    - Generate random numeric series, verify normalized output in [0,1]
  
  - [ ] 4.3 Implement Need Index computation
    - Implement `compute_complaint_rate()` (per 100k population)
    - Implement `compute_infrastructure_deficit()` (1 - index)
    - Implement `compute_need_index()` with weighted formula
    - _Requirements: 2.1, 2.3, 2.4, 2.5_
  
  - [ ]* 4.4 Write property test for Need Index computation
    - **Property 3: Need Index Computation Correctness**
    - **Validates: Requirements 2.1, 2.4**
    - Generate random district data and weights, verify formula correctness
  
  - [ ]* 4.5 Write property test for weight normalization
    - **Property 5: Weight Normalization**
    - **Validates: Requirements 2.6**
    - Generate non-normalized weights, verify proportional normalization

- [ ] 5. Implement preprocessing module - AES computation
  - [ ] 5.1 Create AES calculation functions
    - Implement `compute_aes()` (Current / Predicted)
    - Handle division by zero (flag as invalid)
    - Implement `classify_districts()` based on AES thresholds
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 5.2 Write property test for AES computation
    - **Property 11: AES Computation Correctness**
    - **Validates: Requirements 6.1**
    - Generate random allocations and needs, verify AES = Current/Predicted
  
  - [ ]* 5.3 Write property test for AES classification
    - **Property 12: AES Classification Correctness**
    - **Validates: Requirements 6.3, 6.4, 6.5**
    - Generate random AES values, verify correct classification (Under/Over/Balanced)

- [ ] 6. Implement preprocessing module - data persistence
  - [ ] 6.1 Create S3 write functions
    - Implement `write_to_s3_parquet()` with partitioning by Period
    - Implement `register_with_glue()` for catalog registration
    - Add Need_Index and AES columns to output
    - _Requirements: 2.7, 3.1, 3.2, 3.4, 6.6_
  
  - [ ]* 6.2 Write property test for Need Index persistence
    - **Property 6: Need Index Persistence**
    - **Validates: Requirements 2.7**
    - Process random data, verify output contains Need_Index column
  
  - [ ]* 6.3 Write unit tests for S3 operations
    - Test Parquet writing with mocked S3
    - Test partitioning by Period
    - Test Glue catalog registration

- [ ] 7. Checkpoint - Validate data pipeline
  - Run all data ingestion and preprocessing tests
  - Test with sample 10-district dataset
  - Verify processed data written to S3 in correct format
  - Ensure all tests pass, ask the user if questions arise

- [ ] 8. Implement prediction module - model training
  - [ ] 8.1 Create feature preparation functions
    - Implement `prepare_features()` to extract feature matrix and target
    - Define feature set: Population, Population_Density, Complaint_Count, Infrastructure_Index, Poverty_Rate, Literacy_Rate, Need_Index
    - Implement train/test split (80/20)
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [ ]* 8.2 Write property test for train-test split
    - **Property 7: Train-Test Split Ratio**
    - **Validates: Requirements 4.4**
    - Generate random datasets, verify split ratio within 1% tolerance
  
  - [ ] 8.3 Implement XGBoost model training
    - Implement `train_xgboost_model()` using xgboost library
    - Use hyperparameters from configuration
    - Implement `evaluate_model()` to compute RMSE and MAPE
    - Log warning if RMSE exceeds threshold
    - _Requirements: 4.1, 4.5, 4.6_
  
  - [ ] 8.4 Implement model serialization
    - Implement `save_model_to_s3()` with metadata (training date, metrics)
    - Implement `load_model_from_s3()` for model retrieval
    - Store model metadata in JSON alongside model file
    - _Requirements: 4.7, 11.4_
  
  - [ ]* 8.5 Write property test for model serialization
    - **Property 8: Model Serialization Round Trip**
    - **Validates: Requirements 4.7**
    - Train model, serialize, deserialize, verify identical predictions
  
  - [ ]* 8.6 Write unit tests for model training
    - Test training with small dataset
    - Test evaluation metric calculation
    - Test model metadata storage
    - Test RMSE warning threshold

- [ ] 9. Implement prediction module - inference
  - [ ] 9.1 Create prediction functions
    - Implement `predict_allocations()` using loaded model
    - Validate required features are present
    - Handle missing model error
    - Clip negative predictions to zero with warning
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 12.5, 12.6_
  
  - [ ]* 9.2 Write property test for prediction completeness
    - **Property 9: Prediction Completeness**
    - **Validates: Requirements 5.1**
    - Generate N districts, verify N predictions produced
  
  - [ ]* 9.3 Write property test for prediction unit consistency
    - **Property 10: Prediction Unit Consistency**
    - **Validates: Requirements 5.4**
    - Verify predictions have similar magnitude to training data
  
  - [ ]* 9.4 Write property test for feature validation
    - **Property 24: Feature Presence Validation**
    - **Validates: Requirements 12.5**
    - Provide incomplete features, verify error before prediction
  
  - [ ] 9.5 Integrate predictions with preprocessing
    - Add predicted allocations to processed dataset
    - Store predictions in S3 alongside district data
    - _Requirements: 5.5_

- [ ] 10. Checkpoint - Validate ML pipeline
  - Train model on sample dataset
  - Generate predictions for test period
  - Verify predictions are reasonable (positive, similar scale to training data)
  - Ensure all tests pass, ask the user if questions arise

- [ ] 11. Implement optimization module
  - [ ] 11.1 Create optimization functions
    - Implement `optimize_allocation()` using scipy.optimize
    - Define objective: minimize sum of squared deviations
    - Define constraints: budget equality, non-negativity
    - Implement `compute_percentage_change()`
    - Handle convergence failures with diagnostic errors
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 11.2 Write property test for budget constraint
    - **Property 13: Optimization Budget Constraint**
    - **Validates: Requirements 7.2, 7.3**
    - Generate random inputs, verify sum equals budget and all non-negative
  
  - [ ]* 11.3 Write property test for optimization objective
    - **Property 14: Optimization Objective Minimization**
    - **Validates: Requirements 7.1**
    - Verify optimized allocation has lower deviation than current
  
  - [ ]* 11.4 Write property test for percentage change
    - **Property 15: Percentage Change Calculation**
    - **Validates: Requirements 7.4**
    - Generate random current/recommended pairs, verify formula
  
  - [ ] 11.5 Create optimization result formatter
    - Format output with District_ID, Current, Recommended, Percentage_Change
    - Store optimization results to S3
    - _Requirements: 7.6_
  
  - [ ]* 11.6 Write unit tests for optimization
    - Test simple 3-district case with known solution
    - Test edge cases (all districts need same amount)
    - Test convergence failure handling

- [ ] 12. Implement intelligence module
  - [ ] 12.1 Create summary context preparation
    - Implement `prepare_summary_context()` to extract key statistics
    - Identify top 3 under-allocated and over-allocated districts
    - Calculate deficit/excess amounts
    - _Requirements: 8.2_
  
  - [ ] 12.2 Implement Bedrock integration
    - Implement `generate_bedrock_summary()` using boto3 Bedrock client
    - Create prompt template with context injection
    - Configure Claude model (Sonnet/Haiku) with temperature 0.3
    - Implement retry logic for transient failures
    - _Requirements: 8.1_
  
  - [ ] 12.3 Create fallback summary generator
    - Implement `generate_fallback_summary()` with template
    - Use when Bedrock fails
    - _Requirements: 8.5_
  
  - [ ]* 12.4 Write property test for summary completeness
    - **Property 16: Executive Summary Completeness**
    - **Validates: Requirements 8.2**
    - Generate random analysis results, verify summary contains required elements
  
  - [ ]* 12.5 Write property test for summary length
    - **Property 17: Summary Length Constraint**
    - **Validates: Requirements 8.4**
    - Generate summaries, verify word count ≤ 500
  
  - [ ]* 12.6 Write unit tests for intelligence module
    - Test context preparation with sample data
    - Test Bedrock integration with mocked API
    - Test fallback summary generation
    - Test API failure handling

- [ ] 13. Implement error handling and logging
  - [ ] 13.1 Create structured logging module
    - Implement `log_error()` with CloudWatch JSON format
    - Include module name, timestamp, error type, message, context
    - Implement `log_warning()` and `log_info()` variants
    - _Requirements: 12.1_
  
  - [ ]* 13.2 Write property test for error logging format
    - **Property 21: Error Logging Format**
    - **Validates: Requirements 12.1**
    - Trigger errors in different modules, verify log format
  
  - [ ] 13.3 Integrate error handling across modules
    - Add try-except blocks with structured logging
    - Implement retry logic for AWS service calls
    - Add validation error collection and batch reporting
    - _Requirements: 1.2, 7.5, 8.5_

- [ ] 14. Implement reproducibility and isolation features
  - [ ] 14.1 Add processing timestamps
    - Add Processing_Timestamp to all output records
    - Log configuration at start of each run
    - _Requirements: 11.3, 13.6_
  
  - [ ] 14.2 Implement period isolation
    - Ensure reprocessing only affects target period
    - Use period-based partitioning in S3
    - _Requirements: 11.1_
  
  - [ ]* 14.3 Write property test for period isolation
    - **Property 19: Period Isolation**
    - **Validates: Requirements 11.1**
    - Reprocess one period, verify others unchanged
  
  - [ ]* 14.4 Write property test for processing idempotence
    - **Property 20: Processing Idempotence**
    - **Validates: Requirements 11.2**
    - Process same data twice, verify identical outputs
  
  - [ ] 14.5 Implement model versioning
    - Store model metadata with version, date, metrics
    - Maintain model history in S3
    - Support loading specific model versions
    - _Requirements: 11.4, 11.5, 14.2, 14.3, 14.4_

- [ ] 15. Implement scenario testing support
  - [ ] 15.1 Add scenario mode flag to configuration
    - Accept scenario_id parameter
    - Route scenario data to separate S3 prefix
    - _Requirements: 15.1, 15.3_
  
  - [ ] 15.2 Implement scenario data isolation
    - Ensure scenario processing doesn't affect production data
    - Add scenario_id label to all scenario outputs
    - _Requirements: 15.2, 15.4_
  
  - [ ]* 15.3 Write property test for scenario isolation
    - **Property 26: Scenario Data Isolation**
    - **Validates: Requirements 15.2**
    - Run scenario, verify production data unchanged
  
  - [ ]* 15.4 Write property test for scenario labeling
    - **Property 27: Scenario Output Labeling**
    - **Validates: Requirements 15.4**
    - Run scenario with ID, verify all outputs contain ID

- [ ] 16. Checkpoint - Validate complete pipeline
  - Run end-to-end test with 10-district sample dataset
  - Verify data flows through all stages: ingestion → preprocessing → prediction → optimization → intelligence
  - Verify all outputs created in correct S3 locations
  - Verify error handling works correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 17. Create pipeline orchestration
  - [ ] 17.1 Implement main pipeline coordinator
    - Create `run_pipeline()` function that orchestrates all modules
    - Load configuration
    - Execute stages in sequence: ingest → preprocess → predict → optimize → summarize
    - Handle errors and log progress
    - _Requirements: All_
  
  - [ ] 17.2 Create CLI interface
    - Implement command-line interface using argparse
    - Support commands: train, predict, optimize, full-pipeline
    - Accept parameters: config-path, input-data-path, period, scenario-id
  
  - [ ]* 17.3 Write integration tests
    - Test full pipeline with small dataset
    - Test scenario mode
    - Test error recovery
    - Test reprocessing

- [ ] 18. Implement visualization module (QuickSight setup)
  - [ ] 18.1 Create Athena query definitions
    - Define SQL queries for dashboard data
    - Create views for: district summary, allocation comparison, trend analysis
    - _Requirements: 3.5_
  
  - [ ] 18.2 Create QuickSight dashboard configuration
    - Define dashboard layout with 5 visualizations
    - Configure geographic heatmap (AES by district)
    - Configure allocation comparison bar chart
    - Configure Need Index distribution histogram
    - Configure allocation trends line chart
    - Configure summary KPIs
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 18.3 Implement data freshness checking
    - Add timestamp comparison logic
    - Display warning if data > 7 days old
    - _Requirements: 9.7_
  
  - [ ]* 18.4 Write property test for staleness detection
    - **Property 18: Dashboard Data Staleness Detection**
    - **Validates: Requirements 9.7**
    - Generate timestamps, verify warning displayed when > 7 days
  
  - [ ] 18.5 Configure dashboard filters
    - Add Period selector
    - Add District classification filter
    - Add AES range slider
    - _Requirements: 9.6_

- [ ] 19. Create deployment and infrastructure scripts
  - [ ] 19.1 Create S3 bucket setup script
    - Script to create raw, processed, and model buckets
    - Set up bucket policies and lifecycle rules
    - _Requirements: 3.3_
  
  - [ ] 19.2 Create Glue catalog setup script
    - Script to create database and table definitions
    - Register schemas for processed data
    - _Requirements: 3.2_
  
  - [ ] 19.3 Create IAM role and policy definitions
    - Define roles for Lambda, SageMaker, QuickSight
    - Define policies for S3, Glue, Athena, Bedrock access
  
  - [ ] 19.4 Create deployment documentation
    - Document AWS resource setup steps
    - Document configuration file format
    - Document how to run the pipeline
    - Document troubleshooting common issues

- [ ] 20. Create sample datasets and documentation
  - [ ] 20.1 Generate mock datasets
    - Create small (10 districts), medium (50 districts), large (200 districts) datasets
    - Include multiple periods for trend analysis
    - Include edge cases for testing
  
  - [ ] 20.2 Create usage examples
    - Example: Training a model
    - Example: Running predictions
    - Example: Optimizing allocations
    - Example: Scenario testing
  
  - [ ] 20.3 Create API documentation
    - Document all public functions with docstrings
    - Create module-level documentation
    - Generate API reference using Sphinx

- [ ] 21. Final checkpoint and validation
  - Run complete test suite (unit + property tests)
  - Verify all 27 correctness properties pass
  - Run end-to-end test with medium dataset (50 districts)
  - Verify dashboard displays correctly
  - Review error handling and logging
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and integration points
- AWS service interactions should be mocked in unit tests, tested with LocalStack in integration tests
- Configuration should be externalized to support different environments (dev, staging, production)
- All modules should use structured logging for observability
