"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function TacticCard({ name, icon }: { name: string; icon: string }) {
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
              src={icon}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="object-contain"
              loading="eager"
            />
          </motion.div>
        </div>

        {/* Hover Reveal Details */}
        <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>
    </Link>
  );
}
