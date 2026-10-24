
"use client";

import React, { useState } from "react";
import { Search, PlusCircle, Database, CheckCircle2, AlertCircle, Coins, User } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"search" | "register">("search");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Genomic Sequence Registry
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
            Query immutable plant and organism DNA markers, inspect registered phenotypic traits, and simulate sequence registrations.
          </p>
        </section>

        <div className="flex sm:hidden border-b border-zinc-800 mb-6 gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab("search")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "search" ? "border-emerald-400 text-white" : "border-transparent text-zinc-400"
            }`}
          >
            Sequence Search
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "register" ? "border-emerald-400 text-white" : "border-transparent text-zinc-400"
            }`}
          >
            Register Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <section className={`lg:col-span-7 space-y-6 ${activeTab === "search" ? "block" : "hidden sm:block"}`}>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <Search className="h-5 w-5" />
                <h2 className="text-base font-semibold text-white">Query Genomic Sequence</h2>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-zinc-400">Enter DNA Sequence (A, T, C, G, N)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ATCGATCGAT..."
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm font-mono tracking-wider text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-800/60 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Record Preview</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Registered
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4">
                  <div>
                    <span className="block text-[11px] text-zinc-500 uppercase tracking-wider">Species</span>
                    <span className="text-sm font-medium text-zinc-200">Sorghum bicolor</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-zinc-500 uppercase tracking-wider">Trait</span>
                    <span className="text-sm font-medium text-zinc-200">Drought Resistance</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[11px] text-zinc-500 uppercase tracking-wider">Registered Researcher</span>
                    <span className="text-xs font-mono text-zinc-300 break-all">0x71C...38A9</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-amber-400" /> Research Fund
                    </span>
                    <span className="text-xs font-semibold text-white">0.05 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`lg:col-span-5 space-y-6 ${activeTab === "register" ? "block" : "hidden sm:block"}`}>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <PlusCircle className="h-5 w-5" />
                <h2 className="text-base font-semibold text-white">Register Gene Sequence</h2>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Species Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arabidopsis thaliana"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Trait Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Salinity Tolerance"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">DNA Sequence</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. GCTAGCTAGCTA..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm font-mono uppercase tracking-wider text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                  <span>Required Deposit</span>
                  <span className="font-semibold text-white">0.001 ETH</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  <span>Preview Payload</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-800/60 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        GeneRegistry Smart Contract Interface &bull; Read-Only Preview Shell
      </footer>
    </div>
  );
}