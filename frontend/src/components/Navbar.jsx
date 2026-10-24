import React from "react";
import { Dna, ShieldAlert } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Dna className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">GeneRegistry</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400">Decentralized Genomic DNA Sequence Ledger</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Read-Only Mode</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all cursor-not-allowed opacity-80"
            title="Wallet connection disabled in read-only preview"
          >
            <ShieldAlert className="h-4 w-4 text-zinc-400" />
            <span>Connect Wallet (Disabled)</span>
          </button>
        </div>
      </div>
    </header>
  );
};