
import React from "react";
import { Dna } from "lucide-react";
import { WalletModal } from "@/components/WalletModal";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-950/60 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(244,114,182,0.15)]">
            <Dna className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">GeneRegistry</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-300 bg-pink-950/70 border border-pink-800/60 px-2.5 py-0.5 rounded-full">
                Ethereum Testnet
              </span>
            </div>
            <p className="text-xs text-zinc-400">Decentralized Genomic DNA Sequence Ledger</p>
          </div>
        </div>


        <div className="flex items-center gap-3">
          <WalletModal />
        </div>
      </div>
    </header>
  );
};