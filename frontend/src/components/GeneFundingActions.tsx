
"use client";

import React, { useState } from "react";
import { ethers, parseEther } from "ethers";
import { useWeb3 } from "@/context/Web3Context";
import { GENE_REGISTRY_ADDRESS, GENE_REGISTRY_ABI } from "@/config/contract";
import { decodeContractError } from "@/utils/errorDecoder";
import {
  Coins,
  ArrowDownToLine,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
} from "lucide-react";

interface GeneFundingActionsProps {
  sequence: string;
  researcher: string;
  currentFunding: string;
  onActionComplete?: () => void;
}

type ActionStatus = "idle" | "awaiting_signature" | "pending" | "confirmed" | "error";

export const GeneFundingActions: React.FC<GeneFundingActionsProps> = ({
  sequence,
  researcher,
  currentFunding,
  onActionComplete,
}) => {
  const { account, signer, currentNetwork, refreshBalance, connectWallet } = useWeb3();


  const [donationAmount, setDonationAmount] = useState<string>("0.01");
  const [donateStatus, setDonateStatus] = useState<ActionStatus>("idle");
  const [donateTxHash, setDonateTxHash] = useState<string | null>(null);
  const [donateError, setDonateError] = useState<string | null>(null);


  const [withdrawStatus, setWithdrawStatus] = useState<ActionStatus>("idle");
  const [withdrawTxHash, setWithdrawTxHash] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const isResearcher =
    account && researcher && account.toLowerCase() === researcher.toLowerCase();
  const hasFundsToWithdraw = parseFloat(currentFunding) > 0;


  const handleFundGene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !account) {
      await connectWallet();
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setDonateError("Donation amount must be greater than 0");
      return;
    }

    try {
      setDonateError(null);
      setDonateTxHash(null);
      setDonateStatus("awaiting_signature");

      const contract = new ethers.Contract(GENE_REGISTRY_ADDRESS, GENE_REGISTRY_ABI, signer);
      const parsedAmount = parseEther(donationAmount);

      const tx = await contract.fundGene(sequence, {
        value: parsedAmount,
      });

      setDonateTxHash(tx.hash);
      setDonateStatus("pending");

      const receipt = await tx.wait(1);
      if (receipt.status === 1) {
        setDonateStatus("confirmed");
        refreshBalance();
        if (onActionComplete) onActionComplete();
      } else {
        throw new Error("Transaction execution reverted.");
      }
    } catch (err: any) {
      console.error("fundGene error:", err);
      setDonateStatus("error");
      setDonateError(decodeContractError(err));
    }
  };


  const handleWithdrawFunds = async () => {
    if (!signer || !account) {
      await connectWallet();
      return;
    }

    try {
      setWithdrawError(null);
      setWithdrawTxHash(null);
      setWithdrawStatus("awaiting_signature");

      const contract = new ethers.Contract(GENE_REGISTRY_ADDRESS, GENE_REGISTRY_ABI, signer);
      const tx = await contract.withdrawGeneFunds(sequence);

      setWithdrawTxHash(tx.hash);
      setWithdrawStatus("pending");

      const receipt = await tx.wait(1);
      if (receipt.status === 1) {
        setWithdrawStatus("confirmed");
        refreshBalance();
        if (onActionComplete) onActionComplete();
      } else {
        throw new Error("Withdrawal transaction execution reverted.");
      }
    } catch (err: any) {
      console.error("withdrawGeneFunds error:", err);
      setWithdrawStatus("error");
      setWithdrawError(decodeContractError(err));
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-pink-950/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
          <HeartHandshake className="h-4 w-4 text-pink-400" />
          Crowdfunding & Research Grants
        </span>
        <span className="text-xs font-mono font-bold text-pink-200">
          Vault: {currentFunding} ETH
        </span>
      </div>


      <form onSubmit={handleFundGene} className="space-y-2">
        <label className="block text-[11px] font-medium text-zinc-400">
          Fund this sequence research (ETH)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.001"
            min="0.001"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            disabled={donateStatus === "awaiting_signature" || donateStatus === "pending"}
            placeholder="0.01"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-mono text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={donateStatus === "awaiting_signature" || donateStatus === "pending"}
            className="rounded-xl border border-pink-600/40 bg-pink-500 hover:bg-pink-400 disabled:bg-zinc-800 disabled:border-zinc-700 disabled:text-zinc-500 text-zinc-950 px-4 py-2 text-xs font-bold transition-all shadow-[0_0_10px_rgba(244,114,182,0.2)] flex items-center gap-1.5 cursor-pointer"
          >
            {donateStatus === "awaiting_signature" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {donateStatus === "pending" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {donateStatus !== "awaiting_signature" && donateStatus !== "pending" && (
              <Coins className="h-3.5 w-3.5" />
            )}
            <span>
              {donateStatus === "awaiting_signature"
                ? "Sign in Wallet..."
                : donateStatus === "pending"
                ? "Funding..."
                : "Fund Gene"}
            </span>
          </button>
        </div>

        {donateStatus === "confirmed" && (
          <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/60">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Research grant successfully sent!
            </span>
            {donateTxHash && currentNetwork?.blockExplorerUrls?.[0] && (
              <a
                href={`${currentNetwork.blockExplorerUrls[0]}/tx/${donateTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white flex items-center gap-0.5"
              >
                <span>View</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {donateStatus === "error" && donateError && (
          <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/60">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{donateError}</span>
          </div>
        )}
      </form>

      <div className="pt-3 border-t border-pink-950/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-zinc-200">
              Researcher Payout
            </span>
            <span className="text-[10px] text-zinc-500">
              {isResearcher
                ? "You registered this sequence. You can claim accumulated donations."
                : "Only the registering wallet can claim funds for this sequence."}
            </span>
          </div>

          <button
            type="button"
            onClick={handleWithdrawFunds}
            disabled={
              !isResearcher ||
              !hasFundsToWithdraw ||
              withdrawStatus === "awaiting_signature" ||
              withdrawStatus === "pending"
            }
            className="rounded-xl border border-pink-900/60 bg-pink-950/40 hover:bg-pink-900/50 disabled:bg-zinc-900 disabled:border-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-pink-200 px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            {withdrawStatus === "awaiting_signature" || withdrawStatus === "pending" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-pink-400" />
            ) : (
              <ArrowDownToLine className="h-3.5 w-3.5 text-pink-400" />
            )}
            <span>
              {withdrawStatus === "awaiting_signature"
                ? "Confirming..."
                : withdrawStatus === "pending"
                ? "Withdrawing..."
                : "Withdraw Funds"}
            </span>
          </button>
        </div>


        {withdrawStatus === "confirmed" && (
          <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/60">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Funds paid out to your wallet!
            </span>
            {withdrawTxHash && currentNetwork?.blockExplorerUrls?.[0] && (
              <a
                href={`${currentNetwork.blockExplorerUrls[0]}/tx/${withdrawTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white flex items-center gap-0.5"
              >
                <span>View</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {withdrawStatus === "error" && withdrawError && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/60">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{withdrawError}</span>
          </div>
        )}
      </div>
    </div>
  );
};