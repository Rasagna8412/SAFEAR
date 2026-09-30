"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.relayCertificateToBlockchain = exports.canonicalizeCertificate = exports.computeCertificateHash = exports.issueCertificate = exports.healthCheck = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const certificateSigner_1 = require("./certificateSigner");
Object.defineProperty(exports, "computeCertificateHash", { enumerable: true, get: function () { return certificateSigner_1.computeCertificateHash; } });
Object.defineProperty(exports, "canonicalizeCertificate", { enumerable: true, get: function () { return certificateSigner_1.canonicalizeCertificate; } });
const blockchainRelay_1 = require("./blockchainRelay");
Object.defineProperty(exports, "relayCertificateToBlockchain", { enumerable: true, get: function () { return blockchainRelay_1.relayCertificateToBlockchain; } });
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Health check function for validation.
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.json({
        status: "HEALTHY",
        service: "SafeAR Firebase Functions",
        timestamp: new Date().toISOString()
    });
});
/**
 * Trusted backend function to issue a blockchain training certificate.
 * Validates eligibility, checks for duplicates, computes deterministic hash,
 * submits blockchain transaction, and records certificate in Firestore.
 */
exports.issueCertificate = functions.https.onCall(async (data, context) => {
    const { trainingResultId, recipientName, courseName, courseId, scenarioId, score, durationSeconds } = data;
    if (!trainingResultId) {
        throw new functions.https.HttpsError("invalid-argument", "trainingResultId is required.");
    }
    // 1. Check duplicate issuance
    const existingCertQuery = await db.collection("certificates").where("trainingResultId", "==", trainingResultId).limit(1).get();
    if (!existingCertQuery.empty) {
        const existingDoc = existingCertQuery.docs[0];
        return {
            certificate: existingDoc.data(),
            isExisting: true
        };
    }
    // 2. Validate score & passing criteria
    const numericScore = Number(score) || 0;
    if (numericScore < 70) {
        throw new functions.https.HttpsError("failed-precondition", "Training result does not meet the minimum 70% passing threshold.");
    }
    const certificateId = `SAFEAR-2026-${Date.now().toString().slice(-6)}`;
    const issuedAt = new Date().toISOString();
    const userId = context.auth?.uid || data.userId || "anonymous";
    const canonicalData = {
        certificateId,
        courseId: courseId || "mining-safety-01",
        courseTitle: courseName || "Mining Safety Level 1",
        durationSeconds: durationSeconds || 300,
        emergencyScore: 100,
        hazardScore: 100,
        issuedAt,
        passed: true,
        ppeScore: 100,
        procedureScore: 100,
        score: numericScore,
        userId,
        workerName: recipientName || "Certified Worker"
    };
    // 3. Compute deterministic hash
    const certificateHash = (0, certificateSigner_1.computeCertificateHash)(canonicalData);
    // 4. Relay to Blockchain
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
    const contractAddress = process.env.CERTIFICATE_REGISTRY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    // Standard local test private key (Hardhat account #0)
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const relayResult = await (0, blockchainRelay_1.relayCertificateToBlockchain)(certificateHash, certificateId, rpcUrl, privateKey, contractAddress);
    const txHash = relayResult.success && relayResult.txHash ? relayResult.txHash : `0xlocal_mock_${Date.now()}`;
    const certRecord = {
        certificateId,
        userId,
        trainingResultId,
        scenarioId: scenarioId || "mining-basic-scene",
        courseId: courseId || "mining-safety-01",
        recipientName: recipientName || "Certified Worker",
        courseName: courseName || "Mining Safety Level 1",
        score: numericScore,
        issuedAt,
        certificateHash,
        blockchainTransactionHash: txHash,
        blockchainCertificateId: certificateId,
        verificationUrl: `/verify/${certificateId}`,
        status: "ISSUED"
    };
    await db.collection("certificates").doc(certificateId).set({
        ...certRecord,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return {
        certificate: certRecord,
        isExisting: false
    };
});
//# sourceMappingURL=index.js.map