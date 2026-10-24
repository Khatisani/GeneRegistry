
"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, AlertCircle, CheckCircle2, Code2, Copy, Check, Sparkles, Hash } from "lucide-react";

interface FormErrors {
  speciesName?: string;
  traitType?: string;
  sequence?: string;
}

export const RegisterGeneForm = () => {
  const [speciesName, setSpeciesName] = useState("");
  const [traitType, setTraitType] = useState("");
  const [sequence, setSequence] = useState("");
  const [sequenceHash, setSequenceHash] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);
  const [showPayload, setShowPayload] = useState(false);


  useEffect(() => {
    async function computeHash() {
      if (!sequence.trim()) {
        setSequenceHash("");
        return;
      }
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(sequence.toUpperCase());
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setSequenceHash(hashHex);
      } catch {
        setSequenceHash("0x" + "0".repeat(64));
      }
    }
    computeHash();
  }, [sequence]);


  const handleSequenceChange = (val: string) => {
    const upper = val.toUpperCase().replace(/\s+/g, "");
    setSequence(upper);

    if (!upper) {
      setErrors((prev) => ({ ...prev, sequence: "Sequence cannot be empty" }));
      return;
    }

    const validDnaRegex = /^[ATCGN]+$/;
    if (!validDnaRegex.test(upper)) {
      setErrors((prev) => ({
        ...prev,
        sequence: "Invalid nucleotide. Only A, T, C, G, and N are permitted.",
      }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.sequence;
        return updated;
      });
    }
  };

  const validateAll = (): boolean => {
    const errs: FormErrors = {};
    if (!speciesName.trim()) errs.speciesName = "Species name is required (emptyField)";
    if (!traitType.trim()) errs.traitType = "Trait type is required (emptyField)";
    if (!sequence.trim()) {
      errs.sequence = "Sequence is required (emptyField)";
    } else if (!/^[ATCGN]+$/.test(sequence)) {
      errs.sequence = "Sequence contains invalid bases (invalidSequence)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setShowPayload(true);
    }
  };

  const payload = {
    contract: "GeneRegistry",
    function: "registerGene(string _speciesName, string _traitType, string _sequence)",
    payableValue: "0.001 ETH (1000000000000000 wei)",
    parameters: {
      _speciesName: speciesName.trim(),
      _traitType: traitType.trim(),
      _sequence: sequence.toUpperCase(),
    },
    computedHash: sequenceHash,
    expectedErrorChecks: ["emptyField", "invalidSequence", "insufficientFee", "duplicateSequence"],
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setSpeciesName("Oryza sativa");
    setTraitType("Submergence Tolerance");
    handleSequenceChange("ATCGATCGATCGTTTAAAGGCC");
    setShowPayload(false);
  };

  const isFormValid =
    speciesName.trim().length > 0 &&
    traitType.trim().length > 0 &&
    sequence.trim().length > 0 &&
    !errors.sequence;

  return (
    <div className="rounded-2xl border border-pink-950/70 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 p-6 backdrop-blur-sm shadow-xl shadow-pink-950/10 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-pink-400">
          <PlusCircle className="h-5 w-5" />
          <h2 className="text-base font-semibold text-white">Register Gene Sequence</h2>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-[11px] font-medium text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/50 border border-pink-900/60 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3 text-pink-400" />
          Fill Sample
        </button>
      </div>


      <form onSubmit={handlePreviewSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="species-name" className="text-xs font-medium text-pink-200/80">
              Species Name
            </label>
            {errors.speciesName && (
              <span className="text-[10px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.speciesName}
              </span>
            )}
          </div>
          <input
            id="species-name"
            type="text"
            value={speciesName}
            onChange={(e) => {
              setSpeciesName(e.target.value);
              if (errors.speciesName) {
                setErrors((prev) => ({ ...prev, speciesName: undefined }));
              }
            }}
            placeholder="e.g. Oryza sativa"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="trait-type" className="text-xs font-medium text-pink-200/80">
              Identified Trait Type
            </label>
            {errors.traitType && (
              <span className="text-[10px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.traitType}
              </span>
            )}
          </div>
          <input
            id="trait-type"
            type="text"
            value={traitType}
            onChange={(e) => {
              setTraitType(e.target.value);
              if (errors.traitType) {
                setErrors((prev) => ({ ...prev, traitType: undefined }));
              }
            }}
            placeholder="e.g. Submergence Tolerance"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="gene-sequence" className="text-xs font-medium text-pink-200/80">
              Raw DNA Sequence (A, T, C, G, N)
            </label>
            <span className="text-[10px] font-mono text-zinc-500">{sequence.length} bp</span>
          </div>
          <textarea
            id="gene-sequence"
            rows={3}
            value={sequence}
            onChange={(e) => handleSequenceChange(e.target.value)}
            placeholder="e.g. ATCGATCGATCG..."
            className={`w-full rounded-xl border bg-zinc-950/80 px-3.5 py-2.5 text-sm font-mono uppercase tracking-wider text-pink-100 placeholder-zinc-600 focus:outline-none resize-none transition-all ${
              errors.sequence ? "border-rose-500 focus:border-rose-400" : "border-zinc-800 focus:border-pink-500"
            }`}
          />
          {errors.sequence && (
            <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.sequence}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-pink-950/50 bg-pink-950/20 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Required Registration Fee</span>
            <span className="font-mono font-bold text-pink-300">0.001 ETH</span>
          </div>
          {sequenceHash && (
            <div className="flex items-center justify-between text-[11px] border-t border-pink-950/50 pt-2 text-zinc-400">
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-pink-400" /> Sequence Hash
              </span>
              <span className="font-mono text-pink-200/80 max-w-[200px] truncate" title={sequenceHash}>
                {sequenceHash.slice(0, 10)}...{sequenceHash.slice(-8)}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full rounded-xl border border-pink-600/40 bg-pink-500 hover:bg-pink-400 disabled:bg-zinc-800 disabled:border-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 py-2.5 text-xs font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(244,114,182,0.25)] flex items-center justify-center gap-2"
        >
          <Code2 className="h-4 w-4" />
          <span>Generate Call Payload</span>
        </button>
      </form>


      {showPayload && isFormValid && (
        <div className="rounded-xl border border-pink-900/60 bg-zinc-950/90 p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-pink-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
              <span>Simulated Calldata Ready</span>
            </div>
            <button
              type="button"
              onClick={handleCopyPayload}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-[11px] font-mono text-pink-200/90 overflow-x-auto leading-relaxed">
            {JSON.stringify(payload, null, 2)}
          </pre>

          <p className="text-[10px] text-zinc-500">
            No on-chain transaction was sent. This payload is ready to be bound to <code className="text-pink-400">useWriteContract</code> in the Web3 iteration.
          </p>
        </div>
      )}
    </div>
  );
};