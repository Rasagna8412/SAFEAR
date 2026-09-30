# SafeAR — System Architecture Specification

## 1. Executive Summary

SafeAR is an industrial vocational safety training platform built as a high-performance, responsive Web Application. It cleanly decouples presentation from 3D/Camera AR rendering, domain-driven training execution, deterministic scoring, real Firebase persistence, and EVM blockchain certificate verification.

```text
+-----------------------------------------------------------------------------+
|                    PRESENTATION LAYER (React 18 + TypeScript)               |
|  - Reusable Design Tokens & UI Components (Button, Card, Modal, Badges)    |
|  - Responsive Viewports: Desktop, Tablet, and Mobile Browsers              |
|  - Routes (/login, /register, /home, /courses, /profile, /settings, /verify)|
|  - Multilingual I18n & Voice Audio Synthesis (en, hi, te)                   |
+----------------------+-+-----------------------------+-----------------------+
                       |                               |
                       v                               v
+-----------------------------------------+  +--------------------------------+
|      3D & CAMERA AR ENGINE (Three.js)   |  |     TRAINING DOMAIN ENGINE     |
|  - Camera AR / Web AR-style Simulation  |  |  - TrainingManager & Scenarios |
|  - 3D Training Simulation Mode          |  |  - Step State Transitions      |
|  - SceneManager, ScenarioLoader         |  |  - Lockout/Tagout State Machine|
|  - ObjectInteraction & Tap Raycasting   |  |  - Emergency Evacuation SM     |
|  - 3D Hazard Visualization & Cues       |  |  - Zero React Dependencies     |
+----------------------+-+----------------+  +----------------+---------------+
                       |                                      |
                       +------------------+-------------------+
                                          |
                                          v
                       +-------------------------------------+
                       |      DETERMINISTIC SCORING ENGINE   |
                       |  - Pure Functional Scoring Rules    |
                       |  - Category Breakdown & Mistakes    |
                       |  - Automated Unit Test Coverage     |
                       +------------------+------------------+
                                          |
       +----------------------------------+----------------------------------+
       |                                                                     |
       v                                                                     v
+-----------------------------------------+         +--------------------------------+
|       FIREBASE PERSISTENCE LAYER        |         |   EVM BLOCKCHAIN SUBNETWORK    |
|  - FirebaseAuthService (Role Claims)    |         |  - CertificateRegistry.sol     |
|  - Cloud Firestore Repositories         |         |  - Hardhat Local EVM Node      |
|  - Offline Persistence & Sync Queue     |         |  - Canonical SHA-256 Hashes    |
|  - Cloud Functions (Blockchain Relay)   |         |  - On-Chain Status Check       |
|  - Firebase Emulator Suite (Dev)        |         |  - QR & Public Live Verify     |
+-----------------------------------------+         +--------------------------------+
```

---

## 2. Platform & AR Strategy

### 2.1 Current Prototype: `FALLBACK_CAMERA_AR`
- **Supported Environments**: Desktop, Tablet, and Mobile web browsers.
- **Dual Visual Modes**:
  1. **Camera AR / Web AR-style training simulation**: Uses `navigator.mediaDevices.getUserMedia` for video stream overlay, 3D equipment placement, interactive tap raycasting, and printable AR target marker tracking.
  2. **3D Training Simulation Mode**: Full interactive 3D WebGL viewport with orbit and first-person controls. Automatically offered if camera stream is unavailable or permission is denied.
- **Unified Domain Logic**: Both visual modes run against the identical framework-independent training domain engine.

### 2.2 Future Production Target
- **Target**: Native Android/iOS Mobile Application.
- **Technology**: Unity + AR Foundation + ARCore / ARKit.
- *Note: This is a future roadmap item and is not part of the current web prototype.*

---

## 3. Backend Architecture: Real Firebase

SafeAR connects directly to Google Firebase as its official backend:
1. **Firebase Authentication**: Manages identity and custom role claims (`Worker`, `Trainer`, `Admin`).
2. **Cloud Firestore**: Primary NoSQL document store with strict role-based security rules and offline persistence.
3. **Firebase Storage**: Stores training inspection logs and certificate assets.
4. **Firebase Cloud Functions** (`functions/`): Trusted server-side operations, including canonical certificate verification and the secure blockchain transaction relay. The frontend NEVER contains blockchain private keys.
5. **Firebase Emulator Suite**: Development runtime providing local Auth (9099), Firestore (8080), Storage (9199), and Functions (5001).

---

## 4. Blockchain Architecture & Certificate Pipeline

### 4.1 Smart Contract: `CertificateRegistry.sol`
Deployed to a local Hardhat EVM network during development:
- `registerCertificate(bytes32 certificateHash, string calldata certificateId)`: Stores registration with duplicate prevention.
- `verifyCertificate(bytes32 certificateHash)`: Returns `(bool exists, uint256 registeredAt, address issuer)`.

### 4.2 Certificate Lifecycle & Verification Statuses
```text
Training Completed (Passed >= 70%)
       |
       v
Generate Canonical Certificate JSON
       |
       v
Compute SHA-256 Hash
       |
       v
Trigger Cloud Function Blockchain Relay
       |
       v
Register on CertificateRegistry Contract
       |
       v
Record Tx Hash in Firestore (Status: VERIFIED)
       |
       v
Generate QR Code -> /verify/:certificateId
```

**Verification Statuses**:
- `VALID`: Certificate exists in Firestore, hash matches canonical data, and hash is confirmed on the blockchain.
- `INVALID_HASH`: Canonical data does not match stored hash (tampering detected).
- `NOT_FOUND`: Certificate ID does not exist.
- `PENDING_BLOCKCHAIN`: Certificate issued but blockchain confirmation is in progress.
- `BLOCKCHAIN_FAILED`: Blockchain relay transaction failed.

---

## 5. Security & Role-Based Authorization

- **Roles**:
  - `Worker`: Accesses personal training, assigned courses, personal certificates.
  - `Trainer`: Views assigned workers, reviews results, issues training assignments.
  - `Admin`: System-wide analytics, course management, audit logs.
- **Self-Registration Rule**: Normal registration creates `Worker` accounts only. Role elevation to Trainer or Admin is prohibited on registration and enforced by Firestore security rules.
- **Demo Accounts**: Fixed local development accounts (`Demo Worker`, `Demo Trainer`, `Demo Admin`).
