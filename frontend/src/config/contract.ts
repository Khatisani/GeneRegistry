
export const GENE_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_GENE_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000";

export const GENE_REGISTRY_ABI = [

  "function registerGene(string _speciesName, string _traitType, string _sequence) external payable",
  "function isRegistered(string _sequence) external view returns (bool)",
  "function getGeneBySequence(string _sequence) external view returns (tuple(string speciesName, string traitType, address researcher, string sequence, bool exists))",
  "function geneFunding(bytes32) external view returns (uint256)",
  "function fundGene(string _sequence) external payable",
  "function withdrawGeneFunds(string _sequence) external",
  "function withdrawFees() external",
  "function owner() external view returns (address)",
  "function registrationFee() external view returns (uint256)",


  "error emptyField(string field)",
  "error invalidSequence(string sequence)",
  "error duplicateSequence(string sequence)",
  "error insufficientFee(uint256 required, uint256 provided)",
  "error geneNotFound(string sequence)",
  "error zeroDonation()",
  "error onlyResearcher()",
  "error noFundsAvailable()",
  "error transferFailed()",
  "error onlyContractOwner()",


  "event geneRegistered(string indexed sequenceHash, string speciesName, string traitType, address indexed researcher)",
  "event geneFunded(string sequence, address indexed donor, uint256 amount)",
  "event fundingWithdrawn(string sequence, address indexed researcher, uint256 amount)",
  "event feesWithdrawn(address indexed owner, uint256 amount)"
] as const;