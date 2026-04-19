"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import PageTransition from "@/components/page-transition";
import GeneralCard, { Faction, Profession } from "@/components/general-card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

import { generalsData } from "@/lib/data";

const factions: Faction[] = ["魏", "蜀", "吳", "群"];

export default function GeneralsPage() {
  const [selectedFaction, setSelectedFaction] = useState<Faction | "全部">("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGenerals = generalsData.filter(g => {
    const matchFaction = selectedFaction === "全部" || g.faction === selectedFaction;
    const matchSearch = g.name.includes(searchTerm);
    return matchFaction && matchSearch;
  });

  return (
    <PageTransition>
      <div className="py-8">
        <header className="mb-12">
          <h1 className="text-3xl font-serif mb-2">武將圖鑑</h1>
          <p className="text-foreground-muted">探索《三國：謀定天下》全系列英傑名將。</p>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-12 glass p-6 rounded-2xl border-white/5">
          {/* Faction Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-foreground-muted uppercase tracking-wider">陣營:</span>
            <div className="flex gap-2">
              {["全部", ...factions].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFaction(f as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm transition-all border",
                    selectedFaction === f 
                      ? "bg-accent-gold text-background border-accent-gold font-medium" 
                      : "bg-white/5 border-white/10 text-foreground-muted hover:border-white/30"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input
              type="text"
              placeholder="搜尋武將名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-foreground-muted">
            找到 <span className="text-accent-gold font-bold">{filteredGenerals.length}</span> 位武將
          </span>
          { (selectedFaction !== "全部" || searchTerm) && (
            <button 
              onClick={() => { setSelectedFaction("全部"); setSearchTerm(""); }}
              className="text-xs text-accent-gold hover:underline"
            >
              清除過濾
            </button>
          ) }
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[400px] items-start">
          <AnimatePresence mode="popLayout">
            {filteredGenerals.map(g => (
              <GeneralCard key={g.name} {...g} />
            ))}
          </AnimatePresence>
          {filteredGenerals.length === 0 && (
            <div className="col-span-full py-20 text-center text-foreground-muted border border-dashed border-white/10 rounded-xl">
              沒有符合條件的武將。
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
