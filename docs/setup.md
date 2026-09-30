# SafeAR — Setup & Execution Guide

## 1. Prerequisites
- Node.js >= 18 (Current system: `v25.8.0`)
- npm >= 9 (Current system: `11.16.0`)
- Python 3.x (Current system: `3.14.3`)
- Java JDK (Current system: `25.0.2` - required for Firebase Emulator)

---

## 2. Installation & Quickstart Commands

### Step 1: Install Dependencies
```bash
cd dashboard && npm install
cd ../blockchain && npm install
cd ../functions && npm install
```

### Step 2: Start Local Hardhat Blockchain Node
```bash
cd blockchain
npx hardhat node
```

### Step 3: Deploy Smart Contract
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### Step 4: Start Firebase Emulator Suite
```bash
npx firebase emulators:start --only auth,firestore,storage,functions
```

### Step 5: Start Frontend Dashboard & AR Client
```bash
cd dashboard
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 3. Running Automated Tests

```bash
# Hardhat Blockchain Tests
cd blockchain && npx hardhat test

# Frontend & Domain Unit Tests
cd dashboard && npm test

# Cloud Functions Tests
cd functions && npm test

# End-to-End Test Suite
node tests/e2e/e2e_training_flow.js
```

---

## 4. Development Demo Accounts
- **Worker**: `worker@safe-ar.local` / `Worker123!` (or 1-click Demo Worker button)
- **Trainer**: `trainer@safe-ar.local` / `Trainer123!` (or 1-click Demo Trainer button)
- **Admin**: `admin@safe-ar.local` / `Admin123!` (or 1-click Demo Admin button)
