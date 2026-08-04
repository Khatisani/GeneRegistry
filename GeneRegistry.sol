// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Gene registry Contract 
contract GeneRegistry{

// Define the data structure of the gene record
    struct GeneRecord {
        string speciesName;
        string traitType;
        address researcher;
        string sequence;
    }

// Events 

GeneRecord[] public records;

// Function to register a gene 
    function registerGene(string memory _speciesName, string memory _traitType, string memory _sequence) external {
        GeneRecord memory newRecord = GeneRecord({
            speciesName: _speciesName,
            traitType: _traitType,
            researcher: msg.sender,
            sequence: _sequence

        });
        records.push(newRecord);
    }


// Function to retrieve a gene based on its sequence


// Function to check if a sequence string is already registered


}
