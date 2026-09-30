# SafeAR — Testing Strategy & Verification Plan

## 1. Automated Test Suites

### 1.1 Hardhat Blockchain Tests (`blockchain/test/`)
- Contract deployment and initialization
- Certificate hash registration
- Duplicate registration rejection
- Certificate verification query
- Tamper detection / invalid hash rejection

### 1.2 Domain Unit Tests (`dashboard/src/domain/`)
- Deterministic scoring:
  - Perfect training session = 100 points
  - Wrong hazard tap = 95 points (-5)
  - Wrong action sequence = 90 points (-10)
  - Dangerous action = 80 points (-20)
  - Skipped step = 90 points (-10)
  - Clamping lower bound (>= 0) and upper bound (<= 100)
  - Retries and repeated actions
- Training State Machine transitions:
  - Mining Safety step sequence (PPE -> Hazard -> LOTO -> Emergency -> Assembly)
  - Manufacturing Safety sequence
- AI PPE Detection Evaluation:
  - 5-class evaluation (helmet, vest, gloves, goggles, shoes)
  - Confidence threshold filtering (0.70)
  - Compliance percentage calculation

### 1.3 Firebase Security Rules Tests
- Worker isolation (cannot access peer private records)
- Worker role privilege boundary (cannot elevate to Admin)
- Trainer assignment authorization
- Admin ledger write permissions

### 1.4 End-to-End Test Suite (`tests/e2e/`)
- Complete 23-step workflow simulation testing the full user journey from login to QR verification and admin dashboard confirmation.
