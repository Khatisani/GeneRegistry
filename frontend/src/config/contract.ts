
export const GENE_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_GENE_REGISTRY_ADDRESS || "NEXT_PUBLIC_GENE_REGISTRY_ADDRESS=0x99608442C57CAB86Ed61EC117bA45853BF75b96b";

export const GENE_REGISTRY_ABI = [

  "function registerGene(string _speciesName, string _traitType, string _sequence) external payable",
  "function isRegistered(string _sequence) external view returns (bool)",
  "function getGeneBySequence(string _sequence) external view returns (tuple(string sequence, string speciesName, string traitType, address researcher, bool exists))",
  "function geneFunding(bytes32 sequenceHash) external view returns (uint256)",
  "function totalGeneFunding() external view returns (uint256)",
  "function fundGene(string _sequence) external payable",
  "function withdrawGeneFunds(string _sequence) external",
  "function withdrawFees() external",
  "function fee() external view returns (uint256)",
  "function owner() external view returns (address)",


  "error duplicateSequence(string sequence)",
  "error invalidSequence(string sequence)",
  "error emptyField(string field)",
  "error insufficientFee(uint256 sent, uint256 required)",
  "error geneNotFound(string sequence)",
  "error zeroDonation()",
  "error onlyResearcher()",
  "error noFundsAvailable()",
  "error transferFailed()",
  "error withdrawFailed()",
  "error unauthorized()",


  "event registered(string sequence, address reseacher, string speciesName, string traitType)",
  "event geneFunded(bytes32 indexed sequenceHash, address indexed funder, uint256 amount)",
  "event researchFundsWithdrawn(bytes32 indexed sequenceHash, address indexed researcher, uint256 amount)",
  "event feesWithdrawn(address indexed owner, uint256 amount)",
] as const;