
"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, XCircle, AlertCircle, Coins, Loader2, Sparkles, RefreshCw } from "lucide-react";

export interface GeneRecordView {
  sequence: string;
  speciesName: string;
  traitType: string;
  researcher: string;
  exists: boolean;
  funding: string; 
}

// Mock dataset 
const MOCK_GENE_DATABASE: Record<string, GeneRecordView> = {
  ATCGATCGAT: {
    sequence: "ATCGATCGAT",
    speciesName: "Sorghum bicolor",
    traitType: "Drought Resistance",
    researcher: "0x71C8A36e6F313982e75D14299bB3b9942a138A9",
    exists: true,
    funding: "0.05",
  },
  GCTAGCTAGCTA: {
    sequence: "GCTAGCTAGCTA",
    speciesName: "Arabidopsis thaliana",
    traitType: "Salinity Tolerance",
    researcher: "0x3F911Ac83E31853d93F7D5e0bF5bca61A23e9812",
    exists: true,
    funding: "0.12",
  },
  NNNATCGNNN: {
    sequence: "NNNATCGNNN",
    speciesName: "Zea mays",
    traitType: "Nitrogen Efficiency",
    researcher: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    exists: true,
    funding: "0.00",
  },
};

export const SequenceQueryPanel = () => {
  const [searchInput, setSearchInput] = useState("");
  const [charValidationError, setCharValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queriedRecord, setQueriedRecord] = useState<GeneRecordView | null>(null);
  const [notFoundSequence, setNotFoundSequence] = useState<string | null>(null);

  const validateAndFormatSequence = (value: string) => {
    const upperValue = value.toUpperCase();
    setSearchInput(upperValue);
    setNotFoundSequence(null);

    if (upperValue.length === 0) {
      setCharValidationError(null);
      return;
    }

    const validDnaRegex = /^[ATCGN]+$/;
    if (!validDnaRegex.test(upperValue)) {
      setCharValidationError("Invalid nucleotide detected. Allowed characters: A, T, C, G, N");
    } else {
      setCharValidationError(null);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanSeq = searchInput.trim().toUpperCase();

    if (!cleanSeq) {
      setCharValidationError("Sequence cannot be empty");
      return;
    }

    if (charValidationError) return;

    setIsLoading(true);
    setQueriedRecord(null);
    setNotFoundSequence(null);

    setTimeout(() => {
      setIsLoading(false);
      const record = MOCK_GENE_DATABASE[cleanSeq];
      if (record) {
        setQueriedRecord(record);
      } else {
        setNotFoundSequence(cleanSeq);
      }
    }, 450);
  };

  const handleQuickFill = (seq: string) => {
    validateAndFormatSequence(seq);
  };

  return (
    <div className="rounded-2xl border border-pink-950/70 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 p-6 backdrop-blur-sm shadow-xl shadow-pink-950/10">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-pink-400">
          <Search className="h-5 w-5" />
          <h2 className="text-base font-semibold text-white">Query Genomic Sequence</h2>
        </div>
      </div>


      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="dna-search" className="text-xs font-medium text-pink-200/80">
            DNA Sequence Input
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {searchInput.length} bp length
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="dna-search"
              type="text"
              value={searchInput}
              onChange={(e) => validateAndFormatSequence(e.target.value)}
              placeholder="e.g. ATCGATCGAT..."
              className={`w-full rounded-xl border bg-zinc-950/90 px-4 py-2.5 text-sm font-mono tracking-wider text-pink-100 placeholder-zinc-600 transition-all focus:outline-none ${
                charValidationError
                  ? "border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  : "border-zinc-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchInput.trim() || !!charValidationError}
            className="rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 px-5 py-2.5 text-xs font-bold transition-all shadow-[0_0_12px_rgba(244,114,182,0.25)] flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Lookup</span>
            )}
          </button>
        </div>


        {charValidationError && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {charValidationError}
          </p>
        )}


        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-pink-400" /> Try sample:
          </span>
          {Object.keys(MOCK_GENE_DATABASE).map((seq) => (
            <button
              key={seq}
              type="button"
              onClick={() => handleQuickFill(seq)}
              className="text-[11px] font-mono text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/50 border border-pink-900/50 px-2 py-0.5 rounded-md transition-colors"
            >
              {seq}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleQuickFill("TTTTGGGGCCCCAAAA")}
            className="text-[11px] font-mono text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2 py-0.5 rounded-md transition-colors"
          >
            Unregistered Test
          </button>
        </div>
      </form>


      <div className="mt-6 border-t border-pink-950/60 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Ledger Status</span>
          {queriedRecord && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-800/60 bg-pink-950/40 px-2.5 py-0.5 text-xs font-medium text-pink-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" /> Gene is Registered
            </span>
          )}
          {notFoundSequence && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
              <XCircle className="h-3.5 w-3.5 text-rose-400" /> Gene Not Found
            </span>
          )}
          {!queriedRecord && !notFoundSequence && (
            <span className="text-xs text-zinc-600 font-mono">Awaiting query</span>
          )}
        </div>


        {queriedRecord && (
          <div className="rounded-xl border border-pink-950/60 bg-zinc-950/80 p-5 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] text-pink-400/80 font-medium uppercase tracking-wider">
                  Species Name
                </span>
                <span className="text-sm font-semibold text-zinc-100 italic">
                  {queriedRecord.speciesName}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-pink-400/80 font-medium uppercase tracking-wider">
                  Identified Trait
                </span>
                <span className="text-sm font-semibold text-zinc-100">
                  {queriedRecord.traitType}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-[11px] text-pink-400/80 font-medium uppercase tracking-wider mb-1">
                  Validated Sequence
                </span>
                <div className="bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800 font-mono text-xs text-pink-200 break-all select-all">
                  {queriedRecord.sequence}
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-[11px] text-pink-400/80 font-medium uppercase tracking-wider mb-1">
                  Researcher Address
                </span>
                <div className="bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800 font-mono text-xs text-zinc-300 break-all">
                  {queriedRecord.researcher}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-pink-950/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Coins className="h-4 w-4 text-pink-400" />
                <span>Crowdfunded Research Balance</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-pink-300">{queriedRecord.funding}</span>
                <span className="text-[11px] text-pink-400/70 font-mono">ETH</span>
              </div>
            </div>
          </div>
        )}


        {notFoundSequence && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 text-center space-y-2 animate-in fade-in duration-200">
            <AlertCircle className="h-6 w-6 text-zinc-500 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-200">Sequence Not Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">
              Sequence does not match any registered gene record.
            </p>
            <p className="text-[11px] text-pink-400 pt-1">
              You can register this sequence using the registration form.
            </p>
          </div>
        )}

        {!queriedRecord && !notFoundSequence && (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-8 text-center text-zinc-600 space-y-1">
            <RefreshCw className="h-5 w-5 mx-auto text-zinc-700 mb-2" />
            <p className="text-xs">Enter a raw nucleotide sequence above to query the registry.</p>
          </div>
        )}
      </div>
    </div>
  );
};