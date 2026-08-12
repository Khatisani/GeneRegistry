# Gene Registry
The African Indigenous Biodiversity & Crop Resilience Vault

Gene Registry leverages Ethereum smart contracts to create a tamper-proof timestamped 
registry for indigenous plant DNA sequences, protecting researcher ownership and providing
 an immutable audit trail for genetic variants.

Sub-Saharan Africa is home to incredible drought tolerant, disease resistant crop variants and 
unique native flora. However, local researchers face two challenges:
* Foreign entities claiming patents on indigenous traits discovered by African researchers.
* Centralised university databases going offline, losing mutation records, or having sequence
 data altered without an audit trail.

When an agricultural researcher at a local institute identifies a novel drought-resistance gene 
variant or sequences a rare native plant, they don't just log it in a private spreadsheet, 
they submit the DNA sequence, species name, and metadata to the smart contract.

## Current Features

* Gene record registration: Register plant traits with species metadata, trait types, and DNA sequence strings. 
For now, input sequences are assumed to be standard fragments of 10 base pairs (bp).
* On chain Existence Verification: Query whether a specific DNA sequence has already been registered.
* Sequence Lookup: Retrieve full metadata for registered genes using their sequence string.
* Registration Fee Enforcement: A required fee of 0.001 ETH per registration to protect against spam.
* Withrawal: Only owner of contract is permitted to withdraw the funds in the contract.

### Next step:
Crowdfunding: Allow funding to the wallet that registered the gene. 
The funding goes towards further research on the gene. Only owner of the gene is permitted to withdraw funds. 

## Development Environment: 
* This project was developed in Solidity `^0.8.20`
* Testing framework used is Foundry

## Repository Setup
```
git clone https://github.com/Khatisani/GeneRegistry.git
cd GeneRegistry
./setup.sh
```

## Running Unit Tests
```
# Run all unit tests
forge test

# Run tests with details
forge test -vvv

# Run a specific test function
forge test --match-test test_FunctionName -vvv

# Generate test coverage report 
forge coverage
```



