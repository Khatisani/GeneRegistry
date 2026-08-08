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
    }

    error emptyField();
    error duplicateSequence(string sequence);


// Event for when a gene is registered, emit to log registration
    event registered(
        string sequence,
        address reseacher,
        string speciesName,
        string traitType
    );

GeneRecord[] public records;

// Function to register a gene 
    function registerGene(string memory _speciesName, string memory _traitType, string memory _sequence) external {
        
        if (bytes(_speciesName).length == 0 || bytes(_traitType).length == 0 || bytes(_sequence).length == 0) {
            revert emptyField();
        }

        for (uint256 i = 0; i < records.length; i++){
            if (keccak256(bytes(records[i].sequence)) == keccak256(bytes(_sequence))){
                revert duplicateSequence(_sequence);
            }
        }
        
        GeneRecord memory newRecord = GeneRecord({
            speciesName: _speciesName,
            traitType: _traitType,
            researcher: msg.sender,
            sequence: _sequence

        });
        records.push(newRecord);

        emit registered(_sequence, msg.sender, _speciesName, _traitType);
    }


// Function to retrieve a gene based on its sequence
    function getGeneBySequence(string memory _sequence) external view returns (GeneRecord memory) {
        for (uint256 i = 0; i < records.length; i++) {
            if (keccak256(bytes(records[i].sequence)) == keccak256(bytes(_sequence))) {
                return records[i];
            }
        }
        revert("Gene not found");
    }


// Function to check if a sequence string is already registered
    function isRegistered (string memory _sequence) external view returns (bool){
        for (uint256 i = 0; i < records.length; i++){
            if (keccak256(bytes(records[i].sequence)) == keccak256(bytes(_sequence))){
                return true;
            }
        }
        return false;
    } 
}
