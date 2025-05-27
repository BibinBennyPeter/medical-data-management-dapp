# Medical Data Management DApp
> **Note**:
This project is ongoing and currently under development. Not all features are fully implemented or integrated. Contributions and feedback are welcome.

A decentralized application (DApp) designed to manage, verify, and share sensitive medical records on the blockchain in a secure and privacy-preserving manner.

It is a continuation and upgrade of the academic project [Me.D](https://github.com/BibinBennyPeter/Me.D), adding zero-knowledge proof verification, access control, on-chain file anchoring, and decentralized identity integration.

## Features

* Mint medical records as ERC-721 NFTs with metadata.
* Secure and private verification of medical records using ZK-SNARKs.
* Replay attack protection using data and proof uniqueness checks.
* Leasing records using ERC-4907 to researchers with temporary access.
* On-chain proof-of-storage using protocols like Irys.
* Decentralized identity (DID) support for hospitals, researchers, and patients.
* Integration with TACo for fine-grained access control.

## Architecture

* **Smart Contracts**:

  * `MedicalRecordNFT`: Main contract handling record creation, leasing, and metadata storage.
  * `zkVerifyVerifier`: Interface for the ZK-SNARK verifier contract used to validate hospital-issued proofs.
* **Frontend**: React-based UI for users to interact with the contracts.
* **Storage**: Metadata and optionally encrypted files are pinned on-chain using Irys (Arweave).
* **Access Control**: Planned integration with TACo network to manage permissioned access based on roles and policies.

## Zero-Knowledge Proof Integration (`zkVerify`)

This project integrates Zero-Knowledge SNARKs to verify the authenticity and integrity of medical records issued by hospitals without exposing sensitive patient data.

### Why ZK-SNARKs?

* Verifies that a hospital is authorized to create a record
* Proves that the medical data hasn’t been tampered with
* Prevents replay attacks by binding proofs to specific data

### How It Works

1. A Circom circuit is compiled off-chain to enforce rules (e.g., hospital approval + valid hash).
2. The hospital generates a ZK-SNARK proof from that circuit and sends it with the record.
3. The smart contract calls the `zkVerifyVerifier.verifyProof(...)` function to validate the proof on-chain.

### zkVerify Verifier Contract

This verifier contract is auto-generated using SnarkJS and deployed separately.
The interface is defined as:

```solidity
interface IzkVerifyVerifier {
    function verifyProof(bytes calldata proof) external view returns (bool);
}
```

## Work in Progress

* Integration with Irys for file anchoring.
* Setup of decentralized identities (DIDs) for all user roles.
* Circuit and verifier setup for zkVerify using Circom and SnarkJS.
* Access control using TACo network.
* Full UI for patients, hospitals, and researchers.
