
"use client";

import React, { useState } from "react";
import { ethers, parseEther } from "ethers";
import { useWeb3 } from "@/context/Web3Context";
import { GENE_REGISTRY_ADDRESS, GENE_REGISTRY_ABI } from "@/config/contract";
import { decodeContractError } from "@/utils/errorDecoder";
import {
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Sparkles,
  Wallet,
} from "lucide-react";

interface FormErrors {
  speciesName?: string;
  traitType?: string;
  sequence?: string;
}

type TxStatus = "idle" | "awaiting_signature" | "pending" | "confirmed" | "error";

export const RegisterGeneForm = () => {
  const { account, signer, currentNetwork, refreshBalance, connectWallet } = useWeb3();

  const [speciesName, setSpeciesName] = useState("");
  const [traitType, setTraitType] = useState("");
  const [sequence, setSequence] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});


  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSequenceChange = (val: string) => {
    const upper = val.toUpperCase().replace(/\s+/g, "");
    setSequence(upper);

    if (!upper) {
      setErrors((prev) => ({ ...prev, sequence: "Sequence cannot be empty" }));
      return;
    }

    if (!/^[ATCGN]+$/.test(upper)) {
      setErrors((prev) => ({
        ...prev,
        sequence: "Invalid nucleotide. Only A, T, C, G, and N are allowed.",
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.sequence;
        return next;
      });
    }
  };

  const validateAll = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!speciesName.trim()) nextErrors.speciesName = "Species name is required";
    if (!traitType.trim()) nextErrors.traitType = "Trait type is required";
    if (!sequence.trim()) {
      nextErrors.sequence = "Sequence is required";
    } else if (!/^[ATCGN]+$/.test(sequence)) {
      nextErrors.sequence = "Only A, T, C, G, and N allowed";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    if (!signer || !account) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    try {
      setErrorMessage(null);
      setTxHash(null);
      setStatus("awaiting_signature");

      const contract = new ethers.Contract(GENE_REGISTRY_ADDRESS, GENE_REGISTRY_ABI, signer);


      const tx = await contract.registerGene(
        speciesName.trim(),
        traitType.trim(),
        sequence.toUpperCase(),
        {
          value: parseEther("0.001"),
        }
      );

      setTxHash(tx.hash);
      setStatus("pending");

      const receipt = await tx.wait(1);

      if (receipt.status === 1) {
        setStatus("confirmed");
        refreshBalance();
        setSpeciesName("");
        setTraitType("");
        setSequence("");
      } else {
        throw new Error("Transaction execution reverted by EVM.");
      }
    } catch (err: any) {
      console.error("registerGene transaction error:", err);
      setStatus("error");
      setErrorMessage(decodeContractError(err));
    }
  };

  const handleLoadSample = () => {
    setSpeciesName("Oryza sativa");
    setTraitType("Submergence Tolerance");
    handleSequenceChange("ATCGATCGATCGTTTAAAGGCC");
    setStatus("idle");
    setErrorMessage(null);
    setTxHash(null);
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
          disabled={status === "awaiting_signature" || status === "pending"}
          className="text-[11px] font-medium text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/50 border border-pink-900/60 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <Sparkles className="h-3 w-3 text-pink-400" />
          Fill Sample
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">

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
            disabled={status === "awaiting_signature" || status === "pending"}
            value={speciesName}
            onChange={(e) => {
              setSpeciesName(e.target.value);
              if (errors.speciesName) setErrors((prev) => ({ ...prev, speciesName: undefined }));
            }}
            placeholder="e.g. Oryza sativa"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all disabled:opacity-60"
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
            disabled={status === "awaiting_signature" || status === "pending"}
            value={traitType}
            onChange={(e) => {
              setTraitType(e.target.value);
              if (errors.traitType) setErrors((prev) => ({ ...prev, traitType: undefined }));
            }}
            placeholder="e.g. Submergence Tolerance"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all disabled:opacity-60"
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
            disabled={status === "awaiting_signature" || status === "pending"}
            value={sequence}
            onChange={(e) => handleSequenceChange(e.target.value)}
            placeholder="e.g. ATCGATCGATCG..."
            className={`w-full rounded-xl border bg-zinc-950/80 px-3.5 py-2.5 text-sm font-mono uppercase tracking-wider text-pink-100 placeholder-zinc-600 focus:outline-none resize-none transition-all disabled:opacity-60 ${
              errors.sequence ? "border-rose-500 focus:border-rose-400" : "border-zinc-800 focus:border-pink-500"
            }`}
          />
          {errors.sequence && (
            <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.sequence}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-pink-950/50 bg-pink-950/20 p-3.5 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Required Registration Fee</span>
          <span className="font-mono font-bold text-pink-300">0.001 ETH</span>
        </div>


        {!account ? (
          <button
            type="button"
            onClick={connectWallet}
            className="w-full rounded-xl border border-pink-600/40 bg-pink-500 hover:bg-pink-400 text-zinc-950 py-2.5 text-xs font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(244,114,182,0.25)] flex items-center justify-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet to Register</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isFormValid || status === "awaiting_signature" || status === "pending"}
            className="w-full rounded-xl border border-pink-600/40 bg-pink-500 hover:bg-pink-400 disabled:bg-zinc-800 disabled:border-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 py-2.5 text-xs font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(244,114,182,0.25)] flex items-center justify-center gap-2"
          >
            {status === "awaiting_signature" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Confirming in Wallet...</span>
              </>
            )}
            {status === "pending" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting to Sepolia...</span>
              </>
            )}
            {status !== "awaiting_signature" && status !== "pending" && (
              <span>Register Gene (0.001 ETH)</span>
            )}
          </button>
        )}
      </form>

      {status === "confirmed" && (
        <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Gene Successfully Registered on-chain!</span>
          </div>
          {txHash && currentNetwork?.blockExplorerUrls?.[0] && (
            <a
              href={`${currentNetwork.blockExplorerUrls[0]}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-pink-300 font-mono transition-colors"
            >
              <span>View on Etherscan: {txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}


      {status === "pending" && txHash && (
        <div className="rounded-xl border border-pink-900/60 bg-pink-950/20 p-4 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-medium text-pink-300">
            <Loader2 className="h-4 w-4 animate-spin text-pink-400" />
            <span>Waiting for block confirmation...</span>
          </div>
          {currentNetwork?.blockExplorerUrls?.[0] && (
            <a
              href={`${currentNetwork.blockExplorerUrls[0]}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-pink-300 font-mono transition-colors"
            >
              <span>Track Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}


      {status === "error" && errorMessage && (
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-4 space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Registration Failed</span>
          </div>
          <p className="text-[11px] text-rose-300/90 pl-6 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};