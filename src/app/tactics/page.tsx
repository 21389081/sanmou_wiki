"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";
import TacticCard, { TacticType, TacticRank, Characteristic } from "@/components/tactic-card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

import { tacticsData } from "@/lib/data";

const types: TacticType[] = ["主動", "被動", "指揮", "追擊"];
const characteristics: Characteristic[] = ["兵刃", "謀略", "治療", "防禦", "輔助", "文武"];

export default function TacticsPage() {
  const [selectedType, setSelectedType] = useState<TacticType | "全部">("全部");
  const [selectedChar, setSelectedChar] = useState<Characteristic | "全部">("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTactics = tacticsData.filter(t => {
    const matchType = selectedType === "全部" || t.type === selectedType;
    const matchChar = selectedChar === "全部" || t.characteristic === selectedChar;
    const matchSearch = t.name.includes(searchTerm);
    return matchType && matchChar && matchSearch;
  });

  return (
    <PageTransition>
      <div className="py-8">
        <header className="mb-12">
          <h1 className="text-3xl font-serif mb-2">戰法圖鑑</h1>
          <p className="text-foreground-muted">收錄古今神策妙計，助您決勝千里之外。</p>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-12 glass p-6 rounded-2xl border-white/5">
          {/* Type Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-foreground-muted uppercase tracking-wider">類型:</span>
            <div className="flex gap-2">
              {["全部", ...types].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm transition-all border",
                    selectedType === t 
                      ? "bg-accent-gold text-background border-accent-gold font-medium" 
                      : "bg-white/5 border-white/10 text-foreground-muted hover:border-white/30"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Characteristic Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-foreground-muted uppercase tracking-wider">特性:</span>
            <div className="flex gap-2">
              {["全部", ...characteristics].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedChar(c as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm transition-all border",
                    selectedChar === c 
                      ? "bg-accent-gold text-background border-accent-gold font-medium" 
                      : "bg-white/5 border-white/10 text-foreground-muted hover:border-white/30"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input
              type="text"
              placeholder="搜尋戰法名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-foreground-muted">
            找到 <span className="text-accent-gold font-bold">{filteredTactics.length}</span> 個戰法
          </span>
          { (selectedType !== "全部" || selectedChar !== "全部" || searchTerm) && (
            <button 
              onClick={() => { setSelectedType("全部"); setSelectedChar("全部"); setSearchTerm(""); }}
              className="text-xs text-accent-gold hover:underline"
            >
              清除過濾
            </button>
          ) }
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[400px] items-start">
          <AnimatePresence mode="popLayout">
            {filteredTactics.map(t => (
              <TacticCard key={t.name} {...t} />
            ))}
          </AnimatePresence>
          {filteredTactics.length === 0 && (
            <div className="col-span-full py-20 text-center text-foreground-muted border border-dashed border-white/10 rounded-xl">
              未找到相關戰法。
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
