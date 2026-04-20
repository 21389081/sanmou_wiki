"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Shield, Sword, Zap, Heart, Star, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { General, Fate } from "@/lib/api";

type Faction = "魏" | "蜀" | "吳" | "群"
type Quality = "橙" | "紫" | "藍"

const factionColors: Record<Faction, string> = {
  魏: "text-wei border-wei/30 bg-wei/10",
  蜀: "text-green-400 border-green-400/30 bg-green-400/10",
  吳: "text-amber-600 border-amber-600/30 bg-amber-600/10",
  群: "text-purple-400 border-purple-400/30 bg-purple-400/10",
};

const qualityColors: Record<Quality, string> = {
  橙: "text-accent-gold border-accent-gold/30 bg-accent-gold/10",
  紫: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  藍: "text-blue-400 border-blue-400/30 bg-blue-400/10",
};

export default function GeneralDetailContent({ 
  general, 
  fates 
}: { 
  general: General; 
  fates: Fate[] 
}) {
  const [tacticLevel, setTacticLevel] = useState<1 | 10>(10);

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <Link 
        href="/generals"
        className="flex items-center gap-2 text-foreground-muted hover:text-accent-gold transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        返回武將圖鑑
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Large Image */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col items-center lg:items-stretch">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] bg-surface rounded-3xl overflow-hidden border border-white/5 shadow-2xl w-full max-w-[280px] lg:max-w-none mx-auto"
          >
            <Image
              src={general.avatar}
              alt={general.name}
              fill
              sizes="(max-width: 1024px) 280px, 400px"
              className="object-contain p-4"
              loading="eager"
            />
          </motion.div>

          {/* Basic Attributes Grid */}
          <div className="glass rounded-2xl p-6 border-white/5 grid grid-cols-2 gap-4 w-full">
            <AttributeBox icon={Sword} label="武力" value={general.strength} color="text-red-400" />
            <AttributeBox icon={Zap} label="先攻" value={general.initiative} color="text-blue-400" />
            <AttributeBox icon={Star} label="智力" value={general.intelligence} color="text-purple-400" />
            <AttributeBox icon={Shield} label="統率" value={general.leadership} color="text-green-400" />
          </div>
        </div>

        {/* Right Side: Details Content */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <header>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-accent-gold text-sm font-mono tracking-widest uppercase">名將資料卡</span>
              <div className="h-px flex-grow bg-gradient-to-r from-accent-gold/30 to-transparent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif mb-6">{general.name}</h1>
            <div className="flex flex-wrap gap-2">
              {/* Faction Tag */}
              <span className={cn(
                "px-4 py-1.5 border rounded-full text-xs font-bold",
                factionColors[general.camp]
              )}>
                {general.camp}
              </span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-foreground-muted">
                {general.soldier_type}
              </span>
              {/* Quality Tag */}
              <span className={cn(
                "px-4 py-1.5 border rounded-full text-xs font-bold",
                qualityColors[general.rarity]
              )}>
                {general.rarity}
              </span>
              {/* Season Tag */}
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-foreground-muted">
                {general.season}
              </span>
            </div>
          </header>

          {/* Tactic Section */}
          <section className="glass rounded-3xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-xl font-serif flex items-center gap-3 text-accent-gold">
                <Sword size={22} /> 自帶戰法
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
            <div className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative w-20 h-20 shrink-0 rounded-2xl border border-accent-gold/20 overflow-hidden bg-black/40">
                  <Image 
                    src={general.tactic_icon} 
                    alt={general.tactic_name} 
                    fill 
                    sizes="80px"
                    className="object-cover opacity-80" 
                    loading="eager"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-white mb-2">{general.tactic_name}</h3>
                  <p className="text-foreground-muted leading-relaxed text-lg min-h-[80px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={tacticLevel}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tacticLevel === 1 ? general.tactic_effect_base : general.tactic_effect_max}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Affinity Section */}
          {fates.length > 0 && (
            <section className="glass rounded-3xl p-8 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-3 text-accent-gold">
                <Heart size={22} /> 緣分效果
              </h2>
              <div className="space-y-4">
                {fates.map(fate => (
                  <div key={fate.fid} className="space-y-3">
                    <div className="inline-block px-3 py-1 rounded border border-accent-gold/30 text-accent-gold text-sm font-serif">
                      {fate.name}
                    </div>
                    {fate.members && (
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span className="text-accent-gold/80">緣分成員：</span>
                        <span className="text-foreground">{fate.members}</span>
                      </div>
                    )}
                    <p className="text-foreground-muted leading-relaxed italic border-l-2 border-accent-gold/20 pl-4">
                      {fate.effect}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function AttributeBox({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.03] flex flex-col items-center justify-center space-y-1">
      <div className={cn("flex items-center gap-2 text-lg font-serif", color)}>
        <Icon size={20} />
        <span className="tracking-widest">{label}</span>
      </div>
      <div className="text-base font-mono tracking-tight text-foreground-muted">{value}</div>
    </div>
  );
}