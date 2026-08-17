// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title GeneRegistry
/// @notice A decentralized, tamper proof registry for storing plant and genomic DNA sequences.
/// @dev Implements....
contract GeneRegistry{

/// @notice Data structure representing a registered gene record.
/// @param sequence The DNA sequence string ("AATTGTCTGA").
/// @param speciesName The biological name of the organism ("Sorghum bicolor").
/// @param traitType The identified physiological trait ("Drought Resistance").
/// @param researcher The Ethereum address of the account that registered the gene.
/// @param exists Indicator for whether the sequence has been registered.
    struct GeneRecord {
        string sequence;
        string speciesName;
        string traitType;
        address researcher;
        bool exists;
    }

/// @notice Fee required to register a single gene sequence.
    uint256 public fee = 0.001 ether;

/// @notice Address of the contract deployer with administrative capabilities.
    address public immutable owner;

/// @notice Custom errors for gas efficient input validation. 
/// @param field Name of the string field that was submitted empty.
    error emptyField(string field);

/// @param sequence The DNA sequence string that has already been registered.
    error duplicateSequence(string sequence);

/// @param sequence The invalid sequence string containing invalid characters.
    error invalidSequence(string sequence);

/// @param required The expected minimum fee.
/// @param provided The actual amount sent.
    error insufficientFee(uint256 required, uint256 provided);

/// @param sequence The DNA sequence string that was not found in storage.
    error geneNotFound(string sequence);

/// @notice Reverted when the withdrawal to the owner fails.
    error withdrawFailed(); 

/// @notice Reverted when an address attempts to call an admin function.
    error unauthorized ();

/// @notice Emitted when a new DNA sequence is successfully registered.
/// @param sequence The DNA sequence.
/// @param reseacher The address of the researcher submitting the sequence.
/// @param speciesName The biological name of the organism.
/// @param traitType The targeted trait.
    event registered(
        string sequence,
        address reseacher,
        string speciesName,
        string traitType
    );

/// @notice Emitted when accumulated registration fees are withdrawn by the contract owner.
/// @param owner The recipient address of the withdrawn fees.
/// @param amount The total balance withdrawn in wei.
    event feesWithdrawn(address indexed owner, uint256 amount);

/// @dev Internal lookup mapping connecting keccak256 sequence hashes to GeneRecord structs.
    mapping(bytes32 => GeneRecord) private records;

/// @dev Throws if called by any account other than the contract owner.
    modifier onlyOwner() {
        if (msg.sender != owner) revert unauthorized(); 
        _;
    }

/// @notice Deploys the GeneRegistry contract and sets the deployer as owner.
    constructor (){
        owner = msg.sender;
    }

/// @notice Helper to validate character sequences.
/// @dev Checks string bytes against case insensitive DNA bases (A, T, C, G) and wildcard (N).
/// @param _sequence The DNA sequence string to evaluate.
/// @return bool True if sequence contains valid characters only, false otherwise.
    function isValidSequence (string memory _sequence) internal pure returns (bool){
        bytes memory sequenceBytes = bytes(_sequence);

        for (uint256 i = 0; i < sequenceBytes.length; i++) {
            bytes1 char = sequenceBytes[i];

            if (
                !(char == 'A' || char == 'a' ||
                char == 'T' || char == 't' ||
                char == 'C' || char == 'c' ||
                char == 'G' || char == 'g' ||
                char == 'N' || char == 'n')

                ) {return false;}
            }
            return true; 
    }

/// @notice Converts a string sequence to uppercase
/// @param _sequence The raw sequence string entered
/// @return The uppercase normalized sequence string
    function toUppercase(string memory _sequence) internal pure returns (string memory) {
        bytes memory sequenceBytes = bytes(_sequence);
        bytes memory sequenceUpper = new bytes(sequenceBytes.length);

        for (uint256 i = 0; i < sequenceBytes.length; i++) {
            uint8 char = uint8(sequenceBytes[i]);
            if (char >= 97 && char <= 122) {
                sequenceUpper[i] = bytes1(char - 32);
            } else {
                sequenceUpper[i] = sequenceBytes[i];
            }
        }
        return string(sequenceUpper);
    }


/// @notice Registers a new genomic sequence along with metadata.
/// @dev Requires msg.value > = fee. Reverts on empty inputs, invalid bases, or duplicate sequences.
/// @param _speciesName The biological name of the organism.
/// @param _traitType The identified physiological trait.
/// @param _sequence The DNA sequence string. 
    function registerGene(
        string memory _speciesName, string memory _traitType, string memory _sequence) external payable {
        
        if (msg.value < fee) revert insufficientFee(fee, msg.value);

        if (bytes(_speciesName).length == 0) revert emptyField("speciesName");
        if (bytes(_traitType).length == 0) revert emptyField("traitType");
        if (bytes(_sequence).length == 0) revert emptyField("sequence");
        
        if (!isValidSequence(_sequence)) revert invalidSequence(_sequence);

        string memory normalizedSequence = toUppercase(_sequence);

        bytes32 sequenceHash = keccak256(bytes(normalizedSequence));

        if (records[sequenceHash].exists) {
            revert duplicateSequence(normalizedSequence);
        }

        GeneRecord memory newRecord = GeneRecord({
            speciesName: _speciesName,
            traitType: _traitType,
            researcher: msg.sender,
            sequence: normalizedSequence,
            exists:true

        });

        records[sequenceHash] = newRecord;

        emit registered(normalizedSequence, msg.sender, _speciesName, _traitType);
    }


/// @notice Retrieves a gene record using its raw DNA sequence.
/// @dev Hashes the input string using keccak256 to look up the stored record.
/// @param _sequence The DNA sequence string of the gene to look up.
/// @return GeneRecord The full record associated with the given sequence.
/// @custom:throws emptyField If `_sequence` is an empty string.
/// @custom:throws geneNotFound If no record exists for the provided sequence hash.
    function getGeneBySequence(string memory _sequence) external view returns (GeneRecord memory) {

        if (bytes(_sequence).length == 0) revert emptyField("sequence");

        bytes32 sequenceHash = keccak256(bytes(_sequence));

        if (!records[sequenceHash].exists) {
            revert geneNotFound(_sequence);
        }
        return records[sequenceHash];
    }


// Function to check if a sequence string is already registered
    function isRegistered (string memory _sequence) external view returns (bool){
        if (bytes(_sequence).length == 0) revert emptyField("sequence");

        bytes32 sequenceHash = keccak256(bytes(_sequence));

        return records[sequenceHash].exists;
    }

// Function to withdraw the accumulated fees to contract owner
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;

        if (balance == 0) revert insufficientFee(0, 0);

        (bool success, ) = owner.call{value: balance}("");
        if (!success) revert withdrawFailed();

        emit feesWithdrawn(owner, balance);
    }
} 

