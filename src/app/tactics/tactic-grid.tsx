"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import TacticCard from "@/components/tactic-card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Tactic = {
  tid: number
  戰法名稱: string
  圖示: string
  品質: "橙" | "紫" | "藍"
  戰法類型: string
  戰法特性: string
  發動概率: string
  初級效果: string
  滿級效果: string
  登場賽季: string
}

type TacticType = "主動" | "被動" | "指揮" | "追擊"
type Characteristic = "兵刃" | "謀略" | "治療" | "防禦" | "輔助" | "文武"
type Quality = "橙" | "紫" | "藍"

const types: TacticType[] = ["主動", "被動", "指揮", "追擊"]
const characteristics: Characteristic[] = ["兵刃", "謀略", "治療", "防禦", "輔助", "文武"]
const qualities: Quality[] = ["橙", "紫", "藍"]

const rankOrder: Record<string, number> = {
  "橙": 3,
  "紫": 2,
  "藍": 1,
}

export default function TacticGrid({ tactics }: { tactics: Tactic[] }) {
  const [selectedType, setSelectedType] = useState<TacticType | "全部">("全部");
  const [selectedChar, setSelectedChar] = useState<Characteristic | "全部">("全部");
  const [selectedQuality, setSelectedQuality] = useState<Quality | "全部">("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTactics = tactics
    .filter(t => {
      const matchType = selectedType === "全部" || t.戰法類型 === selectedType;
      const matchChar = selectedChar === "全部" || t.戰法特性 === selectedChar;
      const matchQuality = selectedQuality === "全部" || t.品質 === selectedQuality;
      const matchSearch = t.戰法名稱.includes(searchTerm);
      return matchType && matchChar && matchQuality && matchSearch;
    })
    .sort((a, b) => rankOrder[b.品質] - rankOrder[a.品質]);

  return (
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
                onClick={() => setSelectedType(t as TacticType | "全部")}
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
                onClick={() => setSelectedChar(c as Characteristic | "全部")}
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

        {/* Quality Filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-foreground-muted uppercase tracking-wider">品質:</span>
          <div className="flex gap-2">
            {["全部", ...qualities].map(q => (
              <button
                key={q}
                onClick={() => setSelectedQuality(q as Quality | "全部")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all border",
                  selectedQuality === q 
                    ? "bg-accent-gold text-background border-accent-gold font-medium" 
                    : "bg-white/5 border-white/10 text-foreground-muted hover:border-white/30"
                )}
              >
                {q}
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
        { (selectedType !== "全部" || selectedChar !== "全部" || selectedQuality !== "全部" || searchTerm) && (
          <button 
            onClick={() => { setSelectedType("全部"); setSelectedChar("全部"); setSelectedQuality("全部"); setSearchTerm(""); }}
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
            <TacticCard key={t.tid} {...t} />
          ))}
        </AnimatePresence>
        {filteredTactics.length === 0 && (
          <div className="col-span-full py-20 text-center text-foreground-muted border border-dashed border-white/10 rounded-xl">
            未找到相關戰法。
          </div>
        )}
      </div>
    </div>
  );
}