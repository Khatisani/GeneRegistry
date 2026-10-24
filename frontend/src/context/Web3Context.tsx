
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ethers, BrowserProvider, JsonRpcSigner, formatEther } from "ethers";
import {
  SUPPORTED_NETWORKS,
  ChainConfig,
  DEFAULT_CHAIN_ID,
} from "@/config/networks";

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  currentNetwork: ChainConfig | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  balance: string | null;
  isConnecting: boolean;
  isUnsupportedNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToNetwork: (targetChainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  currentNetwork: null,
  provider: null,
  signer: null,
  balance: null,
  isConnecting: false,
  isUnsupportedNetwork: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchToNetwork: async () => {},
  refreshBalance: async () => {},
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isUnsupportedNetwork = chainId !== null && !SUPPORTED_NETWORKS[chainId];
  const currentNetwork = chainId ? SUPPORTED_NETWORKS[chainId] ?? null : null;

  const refreshBalance = useCallback(async () => {
    if (provider && account) {
      try {
        const rawBalance = await provider.getBalance(account);
        setBalance(parseFloat(formatEther(rawBalance)).toFixed(4));
      } catch (err) {
        console.error("Failed to fetch testnet balance:", err);
      }
    }
  }, [provider, account]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setChainId(null);
    setBalance(null);
  }, []);

  const switchToNetwork = async (targetChainId: number) => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;
    const targetConfig = SUPPORTED_NETWORKS[targetChainId];
    if (!targetConfig) return;

    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetConfig.hexChainId }],
      });
      setChainId(targetChainId);
    } catch (switchError: any) {

      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetConfig.hexChainId,
                chainName: targetConfig.name,
                nativeCurrency: targetConfig.currency,
                rpcUrls: targetConfig.rpcUrls,
                blockExplorerUrls: targetConfig.blockExplorerUrls,
              },
            ],
          });
          setChainId(targetChainId);
        } catch (addError) {
          console.error("Failed to add testnet to wallet:", addError);
        }
      } else {
        console.error("Failed to switch Ethereum testnet:", switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
        alert("No Ethereum browser wallet detected. Please install MetaMask or Rabby.");
        return;
    }

    try {
        setIsConnecting(true);

        const browserProvider = new BrowserProvider(ethereum);

        const accounts = await browserProvider.send("eth_requestAccounts", []);
        if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found or permission was denied.");
        }

        const userSigner = await browserProvider.getSigner();
        const userAddress = await userSigner.getAddress();
        const network = await browserProvider.getNetwork();
        const currentChainId = Number(network.chainId);

        setProvider(browserProvider);
        setSigner(userSigner);
        setAccount(userAddress);
        setChainId(currentChainId);

        if (!SUPPORTED_NETWORKS[currentChainId]) {
        await switchToNetwork(DEFAULT_CHAIN_ID);
        } else {
        const rawBalance = await browserProvider.getBalance(userAddress);
        setBalance(parseFloat(formatEther(rawBalance)).toFixed(4));
        }
    } catch (err: any) {
        console.error("Wallet connection error:", err);
        if (err.code === -32002) {
        alert("A wallet connection request is already pending. Please open your MetaMask extension popup.");
        } else if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        console.warn("User cancelled connection request.");
        } else {
        alert(`Connection failed: ${err.message || "Unknown error"}`);
        }
    } finally {
        setIsConnecting(false);
    }
    };

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;
    const ethereum = (window as any).ethereum;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainHex: string) => {
      const newChainId = parseInt(chainHex, 16);
      setChainId(newChainId);
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnectWallet]);

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        currentNetwork,
        provider,
        signer,
        balance,
        isConnecting,
        isUnsupportedNetwork,
        connectWallet,
        disconnectWallet,
        switchToNetwork,
        refreshBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);