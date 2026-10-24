
"use client";

import React, { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { SUPPORTED_NETWORKS, DEFAULT_CHAIN_ID } from "@/config/networks";
import {
  Wallet,
  ChevronDown,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  Radio,
  TestTube,
} from "lucide-react";

export const WalletModal = () => {
  const {
    account,
    chainId,
    currentNetwork,
    balance,
    isConnecting,
    isUnsupportedNetwork,
    connectWallet,
    disconnectWallet,
    switchToNetwork,
  } = useWeb3();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!account) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        type="button"
        className="flex items-center gap-2 rounded-xl border border-pink-500/40 bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-zinc-950 px-4 py-2 text-xs font-bold transition-all shadow-[0_0_12px_rgba(244,114,182,0.25)]"
      >
        <Wallet className="h-3.5 w-3.5" />
        <span>{isConnecting ? "Connecting..." : "Connect Testnet Wallet"}</span>
      </button>
    );
  }


  if (isUnsupportedNetwork) {
    return (
      <div className="relative">
        <button
          onClick={() => switchToNetwork(DEFAULT_CHAIN_ID)}
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-rose-500/60 bg-rose-500/20 text-rose-300 px-3.5 py-1.5 text-xs font-semibold hover:bg-rose-500/30 transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)]"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          <span>Switch to Sepolia</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-pink-950/80 bg-zinc-900/80 hover:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-all"
        >
          <TestTube className="h-3.5 w-3.5 text-pink-400" />
          <span className="text-[11px] font-medium">{currentNetwork?.name}</span>
          <ChevronDown className="h-3 w-3 text-zinc-500" />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center gap-2 rounded-xl border border-pink-900/50 bg-pink-950/30 hover:bg-pink-950/50 px-3 py-1.5 text-xs font-mono text-pink-200 transition-all"
        >
          <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          {balance !== null && (
            <span className="text-[11px] font-semibold text-pink-400/90 bg-pink-900/40 px-1.5 py-0.5 rounded border border-pink-800/40">
              {balance} ETH
            </span>
          )}
        </button>
      </div>


      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-pink-950/80 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">

          <div className="space-y-1 pb-3 border-b border-pink-950/60">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Connected Testnet Wallet
            </span>
            <div className="flex items-center justify-between bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-xs font-mono text-pink-200 truncate max-w-[170px]">
                {account}
              </span>
              <button
                onClick={handleCopy}
                title="Copy Address"
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Ethereum Testnets
            </span>
            <div className="space-y-1">
              {Object.values(SUPPORTED_NETWORKS).map((net) => {
                const isSelected = net.chainId === chainId;
                return (
                  <button
                    key={net.chainId}
                    onClick={() => {
                      switchToNetwork(net.chainId);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
                      isSelected
                        ? "border-pink-500/50 bg-pink-500/15 text-pink-200"
                        : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Radio className={`h-3 w-3 ${isSelected ? "text-pink-400" : "text-zinc-600"}`} />
                      {net.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">ID: {net.chainId}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-pink-950/60 flex items-center justify-between">
            {currentNetwork?.blockExplorerUrls?.[0] ? (
              <a
                href={`${currentNetwork.blockExplorerUrls[0]}/address/${account}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-zinc-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
              >
                <span>Sepolia Etherscan</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div />
            )}

            <button
              onClick={() => {
                disconnectWallet();
                setIsOpen(false);
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
            >
              <LogOut className="h-3 w-3" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};