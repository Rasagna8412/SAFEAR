const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry Smart Contract", function () {
  let CertificateRegistry;
  let registry;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    registry = await CertificateRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully with a valid contract address", async function () {
      const address = await registry.getAddress();
      expect(address).to.properAddress;
    });
  });

  describe("Certificate Registration", function () {
    it("Should register a valid certificate hash and emit CertificateRegistered event", async function () {
      const testHash = ethers.keccak256(ethers.toUtf8Bytes("SAFEAR_CANONICAL_CERT_JSON_001"));
      const certId = "SAFEAR-2026-000001";

      await expect(registry.registerCertificate(testHash, certId))
        .to.emit(registry, "CertificateRegistered")
        .withArgs(testHash, certId, owner.address, (val) => val > 0);

      const [exists, returnedCertId, registeredAt, issuer] = await registry.verifyCertificate(testHash);
      expect(exists).to.be.true;
      expect(returnedCertId).to.equal(certId);
      expect(registeredAt).to.be.greaterThan(0);
      expect(issuer).to.equal(owner.address);
    });

    it("Should reject duplicate registration of the same certificate hash", async function () {
      const testHash = ethers.keccak256(ethers.toUtf8Bytes("SAFEAR_CANONICAL_CERT_JSON_002"));
      const certId = "SAFEAR-2026-000002";

      await registry.registerCertificate(testHash, certId);

      await expect(
        registry.registerCertificate(testHash, certId)
      ).to.be.revertedWithCustomError(registry, "CertificateAlreadyRegistered");
    });

    it("Should reject registration with empty hash or empty ID", async function () {
      const zeroHash = ethers.ZeroHash;
      await expect(
        registry.registerCertificate(zeroHash, "SAFEAR-2026-000003")
      ).to.be.revertedWithCustomError(registry, "InvalidCertificateHash");

      const testHash = ethers.keccak256(ethers.toUtf8Bytes("SAFEAR_VALID_HASH"));
      await expect(
        registry.registerCertificate(testHash, "")
      ).to.be.revertedWithCustomError(registry, "EmptyCertificateId");
    });
  });

  describe("Certificate Verification", function () {
    it("Should return exists=false for an unregistered certificate hash", async function () {
      const unregisteredHash = ethers.keccak256(ethers.toUtf8Bytes("UNREGISTERED_CERT"));
      const [exists, returnedCertId, registeredAt, issuer] = await registry.verifyCertificate(unregisteredHash);

      expect(exists).to.be.false;
      expect(returnedCertId).to.equal("");
      expect(registeredAt).to.equal(0);
      expect(issuer).to.equal(ethers.ZeroAddress);
    });
  });
});
