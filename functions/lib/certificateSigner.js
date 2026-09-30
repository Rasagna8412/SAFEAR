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
exports.canonicalizeCertificate = canonicalizeCertificate;
exports.computeCertificateHash = computeCertificateHash;
const crypto = __importStar(require("crypto"));
/**
 * Produces a canonical sorted JSON string representation of a certificate.
 */
function canonicalizeCertificate(data) {
    const sortedKeys = Object.keys(data).sort();
    const sortedObj = {};
    for (const key of sortedKeys) {
        sortedObj[key] = data[key];
    }
    return JSON.stringify(sortedObj);
}
/**
 * Computes deterministic SHA-256 hash of canonical certificate data.
 */
function computeCertificateHash(data) {
    const canonicalJson = canonicalizeCertificate(data);
    return "0x" + crypto.createHash("sha256").update(canonicalJson, "utf8").digest("hex");
}
//# sourceMappingURL=certificateSigner.js.map