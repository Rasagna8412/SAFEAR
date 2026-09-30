# SafeAR — Environment Inspection & Architecture Report

**Date & Time**: 2026-08-25  
**Operating System**: Microsoft Windows 11 Home Single Language (64-bit, Version 10.0.26200)  
**Host App Data Directory**: C:/Users/LOQ/.gemini/antigravity  
**Workspace**: c:/Users/LOQ/OneDrive/Desktop/SIH_PROTOTYPE

---

## 1. Toolchain & Runtime Inspection

| Toolchain / Runtime | Status | Version / Details | Build & Demonstration Readiness |
| :--- | :--- | :--- | :--- |
| **Node.js** | Available | `v25.8.0` | Full support for modern JS/TS, Vite, React, Firebase Functions, Hardhat |
| **npm** | Available | `11.16.0` | Package manager ready |
| **Python** | Available | `3.14.3` | Scripting and utilities ready |
| **Java / JDK** | Available | `25.0.2` (`javac 25.0.2`) | Java Runtime & Compiler ready (required by Firebase Emulator) |
| **Android ADB** | Available | `1.0.41` (Version `37.0.0-14910828`) | Android device bridge present |
| **Android SDK / Gradle** | Incomplete / Not in PATH | Android Studio / Gradle CLI not present | Native Android Gradle build not available in host |
| **Unity / Unity Hub** | Not Installed | Not in PATH or standard Program Files | Native Unity compilation not available in host |
| **Git** | Not in PATH | Local versioning used | File management active |
| **Docker** | Not Installed | Not recognized | Local node processes used |
| **Firebase CLI** | Available via npx | Managed via `npx firebase-tools` | Full support for Firebase Emulator Suite (Auth, Firestore, Storage, Functions) |
| **EVM / Hardhat** | Available via npx | `npx hardhat` | Full local EVM node compilation, test & deployment |

---

## 2. Selected Platform & AR Strategy

### 2.1 Current Prototype: `FALLBACK_CAMERA_AR`
- **Application Type**: Responsive Web Application supporting Desktop, Tablet, and Mobile browsers.
- **Visual Engine**: Three.js WebGL rendering engine.
- **AR Experience**:
  - **Camera AR / Web AR-style training simulation**: Uses `navigator.mediaDevices.getUserMedia` for real-time video stream overlay, 3D equipment placement, interactive tap raycasting, and printable AR target marker tracking.
  - **3D Training Simulation Mode**: Full interactive 3D WebGL inspection viewport with orbit/first-person controls. Automatically offered if camera stream is unavailable or permission is denied.
- **Unified Domain Engine**: Both modes use the exact same framework-independent training and state machine engine.

### 2.2 Future Production Roadmap
- **Platform**: Native Android/iOS mobile application.
- **Technology**: Unity + AR Foundation + ARCore / ARKit.
- **Status**: Future production target; not part of the current prototype.

---

## 3. Backend Architecture: Real Firebase

- **Authentication**: Firebase Authentication with custom role claims (`Worker`, `Trainer`, `Admin`).
- **Database**: Cloud Firestore with role-based security rules and offline persistence.
- **Storage**: Firebase Storage for logs and certificate assets.
- **Cloud Functions**: Firebase Cloud Functions in `functions/` for trusted server-side blockchain relay and cryptographic signature verification.
- **Local Development**: Firebase Emulator Suite (`npx firebase emulators:start --only auth,firestore,storage,functions`).
- **No Express / No In-Memory Database**: All persistence is managed strictly via Cloud Firestore.
