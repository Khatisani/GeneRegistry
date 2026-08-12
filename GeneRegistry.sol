// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Gene registry Contract 
contract GeneRegistry{

// Define the data structure of the gene record
    struct GeneRecord {
        string sequence;
        string speciesName;
        string traitType;
        address researcher;
        bool exists;
    }

    uint256 public fee = 0.001 ether;

// Contract admin 
    address public immutable owner;

// Errors for input validation
    error emptyField(string field);
    error duplicateSequence(string sequence);
    error invalidSequence(string sequence);
    error insufficientFee(uint256 required, uint256 provided);
    error geneNotFound(string sequence);

// Event for when a gene is registered, emit to log registration
    event registered(
        string sequence,
        address reseacher,
        string speciesName,
        string traitType
    );

// Event for when fees are withdrawn, emit to log withdrawal
    event feesWithdrawn(address indexed owner, uint256 amount);

    mapping(bytes32 => GeneRecord) private records;

    modifier onlyOwner() {
        if (msg.sender != owner) revert ("Only owner can perform this. ");
        _;
    }

    constructor (){
        owner = msg.sender;
    }

    function isValidSequence (string memory _sequence) internal pure returns (bool){
        return true; 
    }


// Function to register a gene 
// Fee registration of 0.001 eth
    function registerGene(
        string memory _speciesName, string memory _traitType, string memory _sequence) external payable {
        
        if (msg.value < fee) revert insufficientFee(fee, msg.value);

        if (bytes(_speciesName).length == 0) revert emptyField("speciesName");
        if (bytes(_traitType).length == 0) revert emptyField("traitType");
        if (bytes(_sequence).length == 0) revert emptyField("sequence");
        
        if (!isValidSequence(_sequence)) revert invalidSequence(_sequence);

        bytes32 sequenceHash = keccak256(bytes(_sequence));

        if (records[sequenceHash].exists) {
            revert duplicateSequence(_sequence);
        }

        GeneRecord memory newRecord = GeneRecord({
            speciesName: _speciesName,
            traitType: _traitType,
            researcher: msg.sender,
            sequence: _sequence,
            exists:true

        });

        records[sequenceHash] = newRecord;

        emit registered(_sequence, msg.sender, _speciesName, _traitType);
    }


// Function to retrieve a gene based on its sequence
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
        if (!success) revert ("Withdrawal failed.");

        emit feesWithdrawn(owner, balance);
    }
} 

