"use client";

import { motion } from "motion/react";
import { Info, Settings, Shield, Zap } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-qun/10 text-qun border border-qun/20"
        >
          <Info size={32} />
        </motion.div>
        <h1 className="text-4xl font-serif mb-4 text-accent-gold">系統說明</h1>
        <p className="text-foreground-muted text-lg">
          詳細拆解《三國：謀定天下》的核心遊戲機制與賽季規律。
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard 
          icon={Settings} 
          title="核心機制" 
          description="了解資源獲取、城建升級與部隊編成的基礎邏輯，建立穩固的發展基石。"
          color="text-blue-400"
          bg="bg-blue-400/5"
          border="border-blue-400/20"
        />
        <InfoCard 
          icon={Shield} 
          title="職業特性" 
          description="解析鎮軍、青囊、奇佐等六大職業的專屬技能與團隊定位，選擇最適合的發展路線。"
          color="text-green-400"
          bg="bg-green-400/5"
          border="border-green-400/20"
        />
        <InfoCard 
          icon={Zap} 
          title="賽季規律" 
          description="掌握賽季更迭的節奏，提前佈局霸業與霸業獎勵的獲取策略。"
          color="text-purple-400"
          bg="bg-purple-400/5"
          border="border-purple-400/20"
          className="md:col-span-2"
        />
      </div>

      <div className="mt-16 p-8 glass rounded-2xl border-white/5 text-center">
        <h3 className="text-xl font-serif mb-2">更多內容即將推出</h3>
        <p className="text-foreground-muted">
          我們正在持續整理與更新更多深度的系統解析，敬請期待。
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description, color, bg, border, className = "" }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-xl border ${border} ${bg} ${className} transition-all duration-300 hover:shadow-lg`}
    >
      <div className={`mb-4 ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-serif mb-2">{title}</h3>
      <p className="text-foreground-muted leading-relaxed">{description}</p>
    </motion.div>
  );
}
