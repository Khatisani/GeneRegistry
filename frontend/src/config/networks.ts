
export interface ChainConfig {
  chainId: number;
  hexChainId: string;
  name: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const SUPPORTED_NETWORKS: Record<number, ChainConfig> = {

  11155111: {
    chainId: 11155111,
    hexChainId: "0xaa36a7",
    name: "Ethereum Sepolia",
    currency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: [
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      "https://ethereum-sepolia-rpc.publicnode.com",
    ],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },

  17000: {
    chainId: 17000,
    hexChainId: "0x4268",
    name: "Ethereum Holesky",
    currency: { name: "Holesky Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: [
      process.env.NEXT_PUBLIC_HOLESKY_RPC_URL || "https://ethereum-holesky-rpc.publicnode.com",
    ],
    blockExplorerUrls: ["https://holesky.etherscan.io"],
  },

  31337: {
    chainId: 31337,
    hexChainId: "0x7a69",
    name: "Foundry Anvil (Local)",
    currency: { name: "Anvil ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: [],
  },
};

export const DEFAULT_CHAIN_ID = 11155111;