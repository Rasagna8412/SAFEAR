import { ethers } from "ethers";

const CERTIFICATE_REGISTRY_ABI = [
  "function registerCertificate(bytes32 certificateHash, string calldata certificateId) external",
  "function verifyCertificate(bytes32 certificateHash) external view returns (bool exists, string memory certificateId, uint256 registeredAt, address issuer)",
  "event CertificateRegistered(bytes32 indexed certificateHash, string certificateId, address indexed issuer, uint256 registeredAt)"
];

export async function relayCertificateToBlockchain(
  certificateHash: string,
  certificateId: string,
  rpcUrl: string,
  privateKey: string,
  contractAddress: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, CERTIFICATE_REGISTRY_ABI, wallet);

    const tx = await contract.registerCertificate(certificateHash, certificateId);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to relay certificate to blockchain"
    };
  }
}
