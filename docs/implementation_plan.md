# SafeAR — Revised Master Implementation Plan

SafeAR is an industrial vocational safety training platform designed for mining and manufacturing workers. This revised implementation plan establishes a clean architecture separating the frontend UI, Three.js 3D/Camera AR simulation, domain-driven training engine, deterministic scoring, real Firebase persistence & authentication layer (with Firebase Emulator for local development), Hardhat EVM blockchain certificate registry, and an administrative dashboard.

---

## 1. Architectural Strategy & Environmental Distinctions

### 1.1 Prototype vs Production Architecture

```text
Current Prototype:
Camera / 3D AR Simulation (React + TypeScript + Vite + Three.js + Web Camera API)

Future Production:
Native Mobile (Unity + AR Foundation + ARCore / C# Engine)
```

### 1.2 Two Operational Environments

| Dimension | DEVELOPMENT ENVIRONMENT | PRODUCTION-LIKE ENVIRONMENT |
| :--- | :--- | :--- |
| **AR Experience** | WebGL 3D Simulation + Camera Feed Overlay (`FALLBACK_CAMERA_AR`) | AR Foundation + ARCore on Native Mobile Device |
| **Authentication & Database** | Firebase Emulator Suite (Auth + Firestore + Storage + Functions) | Production Firebase Project (Cloud Firestore, Auth, Storage) |
| **Blockchain** | Hardhat Local EVM Node (`http://127.0.0.1:8545`) | EVM Testnet / Mainnet Node with Deployed Contract |
| **AI / PPE Detection** | `DemoPPEDetector` (Labeled `AI DEMO MODE`) | Real TFLite / WebAI Model (`REAL_AI`) |
| **UI Indicators** | Visual Badges: `DEVELOPMENT MODE`, `AI DEMO MODE`, `LOCAL BLOCKCHAIN` | Standard Production UI Badges |

### 1.3 Backend Architecture: Real Firebase

```text
Frontend Client (Web/Mobile)
       |
       v
Firebase Authentication (Auth tokens & role claims)
       |
       v
Cloud Firestore (Role-based security rules & offline persistence)
       |
       v
Firebase Storage (Inspection logs, assets & certificate exports)
       |
       v
Firebase Cloud Functions (Blockchain relay, audit hashing, administrative triggers)
```

---

## 2. Monorepo Repository Structure

```text
safe-ar/
├── README.md                          # Master documentation & runnable commands
├── .gitignore                         # Standard git ignore
├── .env.example                       # Environment template
├── firebase.json                      # Firebase Emulator & Hosting configuration
├── firestore.rules                    # Cloud Firestore security rules
├── firestore.indexes.json             # Firestore composite indexes
├── storage.rules                      # Firebase Storage security rules
│
├── blockchain/                        # Hardhat EVM Smart Contract Subsystem
│   ├── contracts/CertificateRegistry.sol
│   ├── scripts/deploy.js
│   ├── test/CertificateRegistry.test.js
│   ├── hardhat.config.cjs
│   └── package.json
│
├── functions/                         # Firebase Cloud Functions
│   ├── src/
│   │   ├── blockchainRelay.ts         # Secure backend blockchain transaction caller
│   │   └── certificateSigner.ts       # Canonical hashing & audit logger
│   ├── package.json
│   └── tsconfig.json
│
├── dashboard/                         # React 18 + TypeScript + Vite + Three.js Client
│   ├── src/
│   │   ├── components/ui/             # Reusable Design System tokens (Button, Card, Modal, Input, etc.)
│   │   ├── services/
│   │   │   ├── auth/                  # AuthService interface, LocalAuthService (Phase 1), FirebaseAuthService (Phase 5)
│   │   │   ├── firestore/             # Repositories for courses, sessions, results, certificates
│   │   │   ├── ppe/                   # IPPEDetector, DemoPPEDetector, RealPPEDetector
│   │   │   ├── blockchain/            # Certificate verification and ethers.js client
│   │   │   ├── localization/          # I18nService (en, hi, te)
│   │   │   └── voice/                 # VoiceService (Web Speech TTS)
│   │   ├── domain/                    # Independent domain logic (NO React dependencies)
│   │   │   ├── training/              # TrainingManager, TrainingScenario, TrainingStep, Hazards
│   │   │   └── scoring/               # Deterministic ScoringService & Mistake Evaluator
│   │   ├── features/
│   │   │   ├── auth/                  # Splash, Login, Register, Demo Login
│   │   │   ├── home/                  # Home Dashboard, Stats, Course List
│   │   │   ├── courses/               # Course Details, Scenario Overview
│   │   │   ├── training/              # 3D Three.js & Camera AR Simulation Scenes
│   │   │   ├── certificates/          # Certificate UI, QR generator, Print/Download
│   │   │   ├── verify/                # Public `/verify/:id` verification page
│   │   │   └── admin/                 # Admin/Trainer Analytics, Worker Management, Assignments
│   │   ├── types/                     # Shared domain interfaces & data contracts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── tests/                             # Root E2E automated verification suite
│   ├── domain/                        # Scoring & Training engine unit tests
│   ├── security/                      # Firestore security rules unit tests
│   └── e2e/                           # 23-step mandatory E2E test runner
│
└── docs/                              # Technical documentation suite
    ├── environment-report.md
    ├── implementation_plan.md
    ├── architecture.md
    ├── setup.md
    ├── firebase.md
    ├── ai.md
    ├── blockchain.md
    ├── dashboard.md
    ├── testing.md
    ├── demo.md
    ├── troubleshooting.md
    └── limitations.md
```

---

## 3. Revised 11-Phase Implementation Roadmap

### PHASE 0: Environment + Architecture + Project Foundation
- Initialize project directory structure (`blockchain/`, `functions/`, `dashboard/`, `tests/`, `docs/`).
- Define `.gitignore`, `.env.example`, `firebase.json`, `firestore.rules`, `storage.rules`, and package configs.
- Complete documentation baseline.

### PHASE 1: Core Application Shell + Navigation + UI
- Establish stable application shell and design system foundation.
- Standardized colors, spacing, typography, high-contrast accessible borders, large touch targets.
- Reusable UI Components: Button, Card, Input, Modal, Badge, ProgressBar, LoadingSpinner, ErrorMessage, EmptyState, NavigationBar, Sidebar, Header, CourseCard, StatCard.
- `AuthService` interface with `LocalAuthService` (Phase 1) supporting fixed demo accounts:
  - Demo Worker (`worker@safe-ar.local` / role: `Worker`)
  - Demo Trainer (`trainer@safe-ar.local` / role: `Trainer`)
  - Demo Admin (`admin@safe-ar.local` / role: `Admin`)
  - Self-registration creates `Worker` role accounts only.
- Routes: `/`, `/login`, `/register`, `/home`, `/courses`, `/courses/:courseId`, `/profile`, `/settings`, and `*` 404 handler.
- Typed Seed Data for Mining Safety, Manufacturing Safety, Emergency Response.
- Phase Gate status report.

### PHASE 2: 3D Training Environment + Camera AR Simulation
- Modular Three.js scene manager decoupled from React state (`SceneManager`, `ScenarioLoader`, `CameraController`, `ObjectInteraction`, `HazardVisualization`).
- Dual Display Engine: Camera AR mode (`getUserMedia` + overlay + marker) and 3D simulation mode.

### PHASE 3: Interactive Safety Training Engine
- Independent domain model (Zero React dependencies): `TrainingManager`, `TrainingScenario`, `TrainingStep`, `SafetyAction`, `TrainingSession`, `TrainingState`.
- Interactive Workflows: PPE Safety Inspection, Hazard Identification, 5-step Lockout/Tagout, Emergency Evacuation state machine.

### PHASE 4: Deterministic Scoring + Remediation Feedback
- Dedicated `ScoringService`: 100 baseline, -5 wrong hazard, -10 wrong action, -20 dangerous action, -10 skipped step, +5/+10 rewards, clamped to $[0, 100]$.
- Categorized scores: Overall, PPE, Hazard Detection, Procedure, Emergency Response.
- Mistake Engine and comprehensive unit tests.

### PHASE 5: Real Firebase Backend + Authentication + Persistence
- Configure `firebase.json` for Firebase Emulator Suite.
- `FirebaseAuthService`, `FirestoreTrainingRepository`, `FirestoreCourseRepository`, `FirestoreCertificateRepository`.
- Offline-first resilience queue (`LOCAL_ONLY`, `PENDING_SYNC`, `SYNCED`, `SYNC_FAILED`).

### PHASE 6: AI PPE Detection Subsystem
- `IPPEDetector` interface with 5 PPE classes (`helmet`, `safety_vest`, `gloves`, `goggles`, `safety_shoes`).
- `DemoPPEDetector` (`AI DEMO MODE`) and `RealPPEDetector` (`REAL_AI`), confidence threshold 0.70, throttling, caching.

### PHASE 7: Certificate + Blockchain + QR Verification
- Solidity `CertificateRegistry.sol` on Hardhat local node.
- Canonical JSON serialization and SHA-256 hash generation.
- Cloud Functions secure relay.
- QR Code and live `/verify/:certificateId` route verifying certificate status (`VALID`, `INVALID_HASH`, `NOT_FOUND`, `PENDING_BLOCKCHAIN`, `BLOCKCHAIN_FAILED`).

### PHASE 8: Admin & Trainer Dashboard
- Real-time KPI analytics reading real Firestore data.
- Worker management, trainer course assignment, certificate ledger, audit logging.

### PHASE 9: Localization + Accessibility + Voice
- `I18nService` with full translations for English, Hindi, and Telugu.
- `VoiceService` with Web Speech API TTS and graceful text fallback.

### PHASE 10: Full Integration + E2E Testing + Build Verification
- Hardhat tests, unit tests, Firebase security rules tests, and mandatory 23-step E2E test runner.
- Clean build verification (`npm run build`).
