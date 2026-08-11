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

// Errors for input validation
    error emptyField(string field);
    error duplicateSequence(string sequence);
    error invalidSequence(string sequence);

// Event for when a gene is registered, emit to log registration
    event registered(
        string sequence,
        address reseacher,
        string speciesName,
        string traitType
    );

mapping(bytes32 => GeneRecord) private records;

// Function to register a gene 
// Fee registration of 0.001 eth
    uint256 public fee = 0.001 ether;

    function registerGene(
        string memory _speciesName, string memory _traitType, string memory _sequence) external payable {
        
        if (bytes(_speciesName).length == 0) revert emptyField("speciesName");
        if (bytes(_traitType).length == 0) revert emptyField("traitType");
        if (bytes(_sequence).length == 0) revert emptyField("sequence");

        if (records[keccak256(bytes(_sequence))].exists) {
            revert duplicateSequence(_sequence);
        }

        if (msg.value < fee){
            revert ("Insufficient funds. Registration fee is 0.001 ETH");
        }
        

    // NB: Check if the sequence is valid first
        GeneRecord memory newRecord = GeneRecord({
            speciesName: _speciesName,
            traitType: _traitType,
            researcher: msg.sender,
            sequence: _sequence,
            exists:true

        });

        records[keccak256(bytes(_sequence))] = newRecord;

        emit registered(_sequence, msg.sender, _speciesName, _traitType);
    }


// Function to retrieve a gene based on its sequence
    function getGeneBySequence(string memory _sequence) external view returns (GeneRecord memory) {

        if (bytes(_sequence).length == 0) revert emptyField("sequence");
        

        if (records[keccak256(bytes(_sequence))].exists) {
            return records[keccak256(bytes(_sequence))];
        }
        revert("Gene not found");
    }


// Function to check if a sequence string is already registered
    function isRegistered (string memory _sequence) external view returns (bool){
        if (bytes(_sequence).length == 0) revert emptyField("sequence");

        return records[keccak256(bytes(_sequence))].exists;
    }
} 

