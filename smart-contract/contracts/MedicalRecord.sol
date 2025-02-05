// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ERC4907.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IzkVerifyVerifier {
    function verifyProof(bytes calldata proof) external view returns (bool);
}

contract MedicalRecordNFT is ERC721, ERC721URIStorage, ERC4907, Ownable {
    // zkVerify verifier contract address
    IzkVerifyVerifier public zkVerifyVerifier;

    // Track used dataHashes to prevent duplicates
    mapping(bytes32 => bool) public usedDataHashes;

    // Track used zkProofs to prevent proof reuse (Replay Attack Prevention)
    mapping(bytes32 => bool) public usedProofs;

    // Token metadata
    struct Record {
        bytes32 dataHash;
        address hospital;
        uint256 timestamp;
    }
    mapping(uint256 => Record) public records;

    // Events
    event RecordCreated(uint256 tokenId, address patient, address hospital);
    event RecordLeased(uint256 tokenId, address researcher, uint64 expires);

    constructor(address _zkVerifyVerifierAddress) 
        ERC721("MedicalRecord", "MREC") 
        Ownable(msg.sender) 
    {
        zkVerifyVerifier = IzkVerifyVerifier(_zkVerifyVerifierAddress);
    }

    uint256 private _tokenIdCounter;
    /**
     * @notice Creates a medical record NFT for a patient
     * @dev Each proof must be unique and tied to the dataHash to prevent replay attacks
     * @param patient The address receiving the NFT
     * @param dataHash A unique hash representing the medical record
     * @param uri Metadata URI for the NFT
     * @param zkProof Zero-knowledge proof validating hospital authenticity and data integrity
     */
    function createRecord(
        address patient,
        bytes32 dataHash,
        string calldata uri,
        bytes calldata zkProof
    ) external {
        // Ensure dataHash is unique
        require(!usedDataHashes[dataHash], "Duplicate data hash");

        // Ensure zkProof is unique
        bytes32 proofHash = keccak256(zkProof);
        require(!usedProofs[proofHash], "Proof already used");

        // Construct proof input (hospital + dataHash) to make proof specific to each record
        bytes32 proofInput = keccak256(abi.encodePacked(msg.sender, dataHash));
        require(
            zkVerifyVerifier.verifyProof(abi.encodePacked(proofInput, zkProof)),
            "Invalid proof"
        );

        // Mark the dataHash and proof as used
        usedDataHashes[dataHash] = true;
        usedProofs[proofHash] = true;

        // Mint NFT to patient
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(patient, tokenId);
        _setTokenURI(tokenId, uri);

        // Store record metadata
        records[tokenId] = Record({
            dataHash: dataHash,
            hospital: msg.sender,
            timestamp: block.timestamp
        });

        emit RecordCreated(tokenId, patient, msg.sender);
    }

    /**
     * @notice Lease a medical record NFT to a researcher (ERC-4907),override if IERC4907
     * @param tokenId The ID of the NFT being leased
     * @param researcher The address of the researcher receiving temporary access
     * @param expires Timestamp when the lease expires
     */
    function leaseRecord(
        uint256 tokenId,
        address researcher,
        uint64 expires
    ) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only owner can lease"
        );

        emit RecordLeased(tokenId, researcher, expires);
    }


    // Override for ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Override for ERC721
    function supportsInterface(bytes4 interfaceId)
        public
        view 
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
