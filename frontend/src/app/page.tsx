
"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { SequenceQueryPanel } from "@/components/SequenceQueryPanel";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"search" | "register">("search");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Genomic Sequence Registry
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
            Query immutable plant and organism DNA markers, inspect registered phenotypic traits, and simulate sequence registrations.
          </p>
        </section>

        <div className="flex sm:hidden border-b border-pink-950 mb-6 gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab("search")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "search" ? "border-pink-500 text-pink-300 font-semibold" : "border-transparent text-zinc-400"
            }`}
          >
            Sequence Search
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "register" ? "border-pink-500 text-pink-300 font-semibold" : "border-transparent text-zinc-400"
            }`}
          >
            Register Preview
          </button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <section className={`lg:col-span-7 space-y-6 ${activeTab === "search" ? "block" : "hidden sm:block"}`}>
            <SequenceQueryPanel />
          </section>

          <section className={`lg:col-span-5 space-y-6 ${activeTab === "register" ? "block" : "hidden sm:block"}`}>
            <div className="rounded-2xl border border-pink-950/70 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 p-6 backdrop-blur-sm shadow-xl shadow-pink-950/10">
              <div className="flex items-center gap-2 mb-4 text-pink-400">
                <PlusCircle className="h-5 w-5" />
                <h2 className="text-base font-semibold text-white">Register Gene Sequence</h2>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Species Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arabidopsis thaliana"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-sm text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Trait Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Salinity Tolerance"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-sm text-pink-100 placeholder-zinc-600 focus:border-pink-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">DNA Sequence</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. GCTAGCTAGCTA..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-sm font-mono uppercase tracking-wider text-pink-200 placeholder-zinc-600 focus:border-pink-500 focus:outline-none resize-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-300 bg-pink-950/20 p-3 rounded-xl border border-pink-900/40">
                  <span className="text-pink-300">Required Deposit</span>
                  <span className="font-bold text-white">0.001 ETH</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl border border-pink-600/30 bg-pink-500/15 hover:bg-pink-500/25 text-pink-200 hover:text-white py-2.5 text-xs font-semibold tracking-wide transition-all shadow-[0_0_10px_rgba(244,114,182,0.1)]"
                >
                  Preview Payload
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-pink-950/60 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        GeneRegistry Smart Contract Interface
      </footer>
    </div>
  );
}