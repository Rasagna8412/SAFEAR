// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CertificateRegistry
 * @dev Immutable on-chain registry for SafeAR vocational safety training certificates.
 * Stores only cryptographic hashes and IDs, preserving trainee privacy.
 */
contract CertificateRegistry {
    struct CertificateRecord {
        string certificateId;
        uint256 registeredAt;
        address issuer;
        bool exists;
    }

    // Mapping from SHA-256 certificate hash to CertificateRecord
    mapping(bytes32 => CertificateRecord) private _certificates;

    // Event emitted when a certificate is registered
    event CertificateRegistered(
        bytes32 indexed certificateHash,
        string certificateId,
        address indexed issuer,
        uint256 registeredAt
    );

    // Custom errors
    error CertificateAlreadyRegistered(bytes32 certificateHash);
    error InvalidCertificateHash();
    error EmptyCertificateId();

    /**
     * @notice Registers a new training certificate hash on-chain.
     * @param certificateHash The SHA-256 hash of the canonical certificate JSON.
     * @param certificateId The unique identifier of the certificate (e.g. SAFEAR-2026-000001).
     */
    function registerCertificate(
        bytes32 certificateHash,
        string calldata certificateId
    ) external {
        if (certificateHash == bytes32(0)) revert InvalidCertificateHash();
        if (bytes(certificateId).length == 0) revert EmptyCertificateId();
        if (_certificates[certificateHash].exists) {
            revert CertificateAlreadyRegistered(certificateHash);
        }

        _certificates[certificateHash] = CertificateRecord({
            certificateId: certificateId,
            registeredAt: block.timestamp,
            issuer: msg.sender,
            exists: true
        });

        emit CertificateRegistered(
            certificateHash,
            certificateId,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Verifies whether a certificate hash has been registered on-chain.
     * @param certificateHash The SHA-256 hash to verify.
     * @return exists True if the certificate is registered, false otherwise.
     * @return certificateId The registered certificate ID.
     * @return registeredAt The timestamp of registration.
     * @return issuer The address of the issuer who registered the certificate.
     */
    function verifyCertificate(bytes32 certificateHash)
        external
        view
        returns (
            bool exists,
            string memory certificateId,
            uint256 registeredAt,
            address issuer
        )
    {
        CertificateRecord memory record = _certificates[certificateHash];
        return (
            record.exists,
            record.certificateId,
            record.registeredAt,
            record.issuer
        );
    }
}
