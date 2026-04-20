"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Scroll, Zap, Flame, Target, Shield, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Tactic } from "@/lib/api";

type TacticType = "主動" | "被動" | "指揮" | "追擊";
type TacticRank = "橙" | "紫" | "藍";

const typeIcons: Record<TacticType, LucideIcon> = {
  主動: Flame,
  被動: Shield,
  指揮: Target,
  追擊: Zap,
};

const rankStyles: Record<TacticRank, string> = {
  橙: "text-accent-gold border-accent-gold/40 bg-accent-gold/5",
  紫: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  藍: "text-blue-400 border-blue-400/30 bg-blue-400/5",
};

export default function TacticDetailContent({ tactic }: { tactic: Tactic }) {
  const [tacticLevel, setTacticLevel] = useState<1 | 10>(10);

  const Icon = typeIcons[tactic.戰法類型 as TacticType];

  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <Link 
        href="/tactics"
        className="flex items-center gap-2 text-foreground-muted hover:text-accent-gold transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        返回戰法圖鑑
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Image */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col items-center lg:items-stretch">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] bg-surface rounded-3xl overflow-hidden border border-white/5 shadow-2xl w-full max-w-[280px] lg:max-w-none mx-auto"
          >
            <Image
              src={tactic.圖示}
              alt={tactic.戰法名稱}
              fill
              sizes="(max-width: 1024px) 280px, 400px"
              className="object-contain p-4"
              loading="eager"
            />
          </motion.div>
        </div>

        {/* Right Side: Details */}
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
          <header>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-accent-gold text-sm font-mono tracking-widest uppercase">戰法詳情卡</span>
              <div className="h-px flex-grow bg-gradient-to-r from-accent-gold/30 to-transparent" />
            </div>
            <h1 className="text-5xl font-serif mb-4">{tactic.戰法名稱}</h1>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Rank Tag */}
              <div className={cn(
                "px-4 py-1.5 border rounded-full text-xs font-bold flex items-center justify-center",
                rankStyles[tactic.品質 as TacticRank]
              )}>
                品質: {tactic.品質}
              </div>
              {/* Rate Tag */}
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-accent-gold font-bold flex items-center justify-center">
                發動率: {tactic.發動概率}
              </div>
              {/* Type Tag */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-foreground-muted">
                <Icon size={14} className="text-accent-gold" />
                <span>{tactic.戰法類型}</span>
              </div>
              {/* Characteristic Tag */}
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-foreground-muted flex items-center justify-center">
                特性: {tactic.戰法特性}
              </div>
              {/* Season Tag */}
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-foreground-muted flex items-center justify-center">
                {tactic.登場賽季}
              </div>
            </div>

          </header>

          <section className="glass rounded-3xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-xl font-serif flex items-center gap-3 text-accent-gold">
                <Scroll size={22} /> 戰法效果
              </h2>
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                <button 
                  onClick={() => setTacticLevel(1)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs transition-all",
                    tacticLevel === 1 ? "bg-accent-gold text-background font-bold" : "text-foreground-muted"
                  )}
                >
                  初級
                </button>
                <button 
                  onClick={() => setTacticLevel(10)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs transition-all",
                    tacticLevel === 10 ? "bg-accent-gold text-background font-bold" : "text-foreground-muted"
                  )}
                >
                  滿級
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/5 leading-relaxed text-lg italic text-foreground-muted min-h-[120px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tacticLevel}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    「{tacticLevel === 1 ? tactic.初級效果 : tactic.滿級效果}」
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}