"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Sword, Shield, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export type Faction = "魏" | "蜀" | "吳" | "群";
export type Profession = "鎮軍" | "青囊" | "奇佐" | "天工" | "司倉" | "神武";

interface GeneralCardProps {
  name: string;
  faction: Faction;
  rarity: number;
  image: string;
  tags?: string[];
}

const factionColors: Record<Faction, string> = {
  魏: "text-wei border-wei/30 bg-wei/5",
  蜀: "text-shu border-shu/30 bg-shu/5",
  吳: "text-wu border-wu/30 bg-wu/5",
  群: "text-qun border-qun/30 bg-qun/5",
};

export default function GeneralCard({ name, faction, profession, rarity, image, tags }: GeneralCardProps) {
  return (
    <Link href={`/generals/${encodeURIComponent(name)}`}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -8 }}
        title={name}
        className="relative group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-accent-gold/40 shadow-2xl aspect-[159/248] w-full"
      >
        {/* Character Image */}
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

        {/* Hover Reveal Details - Subtlest hint of interaction */}
        <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>
    </Link>
  );
}

