# SafeAR — Firebase Backend Specification

## 1. Firebase Backend Overview

SafeAR utilizes Google Firebase as its core production-like backend:
1. **Firebase Authentication**: User identity management and role-based custom claims (`Worker`, `Trainer`, `Admin`).
2. **Cloud Firestore**: Real-time NoSQL document database with strict security rules and offline persistence.
3. **Firebase Storage**: Secure storage for training inspection logs and certificate exports.
4. **Firebase Cloud Functions**: Serverless functions in `functions/` for trusted server-side blockchain relay and cryptographic signature verification.
5. **Firebase Local Emulator Suite**: Local runtime for development and testing (`npx firebase emulators:start --only auth,firestore,storage,functions`).

---

## 2. Cloud Firestore Collections & Schemas

- **`/users/{userId}`**: `id`, `email`, `name`, `role` (`Worker` | `Trainer` | `Admin`), `assignedTrainerId`, `preferredLanguage`, `createdAt`, `updatedAt`
- **`/courses/{courseId}`**: `id`, `title`, `description`, `category`, `difficulty`, `durationMinutes`, `scenarioId`, `enabled`, `topics`, `createdAt`
- **`/scenarios/{scenarioId}`**: `id`, `title`, `courseId`, `environmentType`, `steps`
- **`/trainingSessions/{sessionId}`**: `id`, `userId`, `courseId`, `scenarioId`, `status`, `currentStepId`, `startedAt`, `actions`
- **`/trainingResults/{resultId}`**: `id`, `sessionId`, `userId`, `courseId`, `score`, `ppeScore`, `hazardScore`, `procedureScore`, `emergencyScore`, `passed`, `durationSeconds`, `mistakes`, `syncStatus`, `completedAt`
- **`/assignments/{assignmentId}`**: `id`, `trainerId`, `workerId`, `courseId`, `status`, `dueDate`, `assignedAt`
- **`/certificates/{certificateId}`**: `id`, `userId`, `workerName`, `courseId`, `courseTitle`, `score`, `passed`, `certificateHash`, `blockchainTx`, `blockchainStatus`, `issuedAt`, `qrCodeUrl`
- **`/auditLogs/{logId}`**: `id`, `actorId`, `action`, `targetResource`, `timestamp`, `metadata`

---

## 3. Firestore Security Rules

Strict role-based rules enforce that:
- Workers can only view and mutate their own profile, sessions, and training results.
- Trainers can inspect assigned workers and create assignments.
- Admins possess system-wide configuration, course management, and audit access.
- Certificates are publicly readable to support QR code verification.
- Self-registration creates `Worker` role documents exclusively.
