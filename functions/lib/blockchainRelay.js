"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relayCertificateToBlockchain = relayCertificateToBlockchain;
const ethers_1 = require("ethers");
const CERTIFICATE_REGISTRY_ABI = [
    "function registerCertificate(bytes32 certificateHash, string calldata certificateId) external",
    "function verifyCertificate(bytes32 certificateHash) external view returns (bool exists, string memory certificateId, uint256 registeredAt, address issuer)",
    "event CertificateRegistered(bytes32 indexed certificateHash, string certificateId, address indexed issuer, uint256 registeredAt)"
];
async function relayCertificateToBlockchain(certificateHash, certificateId, rpcUrl, privateKey, contractAddress) {
    try {
        const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
        const contract = new ethers_1.ethers.Contract(contractAddress, CERTIFICATE_REGISTRY_ABI, wallet);
        const tx = await contract.registerCertificate(certificateHash, certificateId);
        const receipt = await tx.wait();
        return {
            success: true,
            txHash: receipt.hash
        };
    }
    catch (err) {
        return {
            success: false,
            error: err.message || "Failed to relay certificate to blockchain"
        };
    }
}
//# sourceMappingURL=blockchainRelay.js.map