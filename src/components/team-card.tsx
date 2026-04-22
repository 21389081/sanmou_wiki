"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Team } from "@/lib/api";

interface TeamCardProps {
  team: Team;
}

function GeneralCard({ member }: { member: Team["members"][0] }) {
  return (
    <div className="p-3 bg-white/5 rounded-lg space-y-2">
      <div className="relative w-14 h-14 rounded overflow-hidden bg-white/10 mx-auto mt-2">
        {member.general_img && (
          <Image
            src={member.general_img}
            alt={member.general_name}
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </div>
      <div className="font-medium text-center">{member.general_name}</div>
      <div className="border-t border-white/10" />
      <DetailRow label="戰法一" value={member.skill_1 || "-"} />
      <DetailRow label="戰法二" value={member.skill_2 || "-"} />
      <DetailRow label="兵種" value={member.soldier_type} />
      <DetailRow label="專精" value={member.soldier_skills} />
      <DetailRow label="兵書一" value={member.book_1} />
      <DetailRow label="兵書二" value={member.book_2} />
      <DetailRow label="兵書三" value={member.book_3} />
      <DetailRow label="裝備屬性" value={member.equip_point} />
      <DetailRow label="裝備特效" value={member.equip_stats} />
      <DetailRow label="坐騎" value={member.horse_stats} />
      <DetailRow label="加點" value={member.plus_points} />
      <DetailRow label="技能備選" value={[member.skill_1_alt, member.skill_2_alt].filter(Boolean).join(" / ")} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-foreground-muted w-20 flex-shrink-0">{label}</span>
      <span className="whitespace-pre-wrap">{value}</span>
    </div>
  );
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl overflow-hidden border border-white/10 hover:border-accent-gold/40 transition-colors"
    >
      <div className="p-4 border-b border-white/10">
        <div className="text-center mb-2">
          <h3 className="text-xl font-serif">{team.team_name}</h3>
        </div>
        <div className="text-center text-lg text-foreground-muted">
          <span>{team.formation || "-"}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {team.members.map((member) => (
            <GeneralCard key={member.members_id} member={member} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}