
"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { SequenceQueryPanel } from "@/components/SequenceQueryPanel";
import { RegisterGeneForm } from "@/components/RegisterGeneFrom";

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
            Query plant and organism DNA markers, inspect registered phenotypic traits, and simulate sequence registrations.
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
            <RegisterGeneForm />
          </section>
        </div>
      </main>

      <footer className="border-t border-pink-950/60 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        GeneRegistry Smart Contract Interface
      </footer>
    </div>
  );
}