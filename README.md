# SafeAR — Industrial Safety Training Platform

SafeAR is a vocational safety training simulator prototype engineered for mining and manufacturing environments.

## Platform & Architecture Mode: `FALLBACK_CAMERA_AR`

- **Current Prototype**: Responsive Web Application (Desktop, Tablet, Mobile Browsers) utilizing **React 18, TypeScript, Vite, Tailwind CSS, Three.js, and Web Camera API (`getUserMedia`)**.
  - **Camera AR / Web AR-style training simulation**: Real-time camera feed overlay with 3D hazard placement and printable AR target marker tracking.
  - **3D Training Simulation Mode**: Full interactive 3D WebGL viewport with orbit and first-person inspection controls.
- **Future Production Target**: Native Mobile Application (Unity + AR Foundation + ARCore / ARKit).

## Backend & Subsystems

- **Backend**: Google Firebase (Firebase Authentication, Cloud Firestore, Firebase Storage, Firebase Cloud Functions in `functions/`, Firebase Emulator Suite).
- **Blockchain**: Solidity `CertificateRegistry.sol` smart contract on a local Hardhat EVM network with SHA-256 canonical certificate hashing.
- **AI PPE Detection**: `IPPEDetector` with `DemoPPEDetector` (`AI DEMO MODE`) and `RealPPEDetector` (`REAL_AI`).
- **Scoring**: Pure deterministic functional scoring engine (100 baseline, strict penalties, categorized metrics).

## Quickstart

```bash
# 1. Install dependencies
cd dashboard && npm install
cd ../blockchain && npm install
cd ../functions && npm install

# 2. Start local Hardhat blockchain
cd blockchain && npx hardhat node

# 3. Deploy smart contract
cd blockchain && npx hardhat run scripts/deploy.js --network localhost

# 4. Start Firebase Emulator
npx firebase emulators:start --only auth,firestore,storage,functions

# 5. Start Dashboard & AR Client
cd dashboard && npm run dev
```

Open `http://localhost:5173`.
