"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Target, Scroll, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export type TacticType = "主動" | "被動" | "指揮" | "追擊";
export type TacticRank = "橙" | "紫" | "藍";
export type Characteristic = "兵刃" | "謀略" | "治療" | "防禦" | "輔助" | "文武";

interface TacticCardProps {
  name: string;
  type: TacticType;
  rank: TacticRank;
  characteristic: Characteristic;
  rate: string;
  lv1: string;
  lv10: string;
  image: string;
  source?: string;
}

const typeIcons: Record<TacticType, any> = {
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

export default function TacticCard({ name, type, rank, rate, image }: TacticCardProps) {
  return (
    <Link href={`/tactics/${encodeURIComponent(name)}`}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -8 }}
        title={name}
        className="relative group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-accent-gold/40 shadow-2xl aspect-[159/248] w-full"
      >
        {/* Tactic Image */}
        <div className="relative w-full h-full">
          <motion.div 
            className="relative w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Hover Reveal Details */}
        <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>
    </Link>
  );
}
