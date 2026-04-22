# 陣容卡片重構 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重構 TeamCard 元件，將武將詳情改為武將卡片形式呈現

**Architecture:** 修改現有 team-card.tsx，重構 GeneralSlot 為 GeneralCard 元件，三張卡片水平排列

**Tech Stack:** Next.js, React, Tailwind CSS, motion/react

---

### Task 1: 重構 GeneralSlot 為 GeneralCard 元件

**Files:**
- Modify: `src/components/team-card.tsx:11-36`

- [ ] **Step 1: 閱讀現有 GeneralSlot 代碼**

確認目前實作：

```tsx
function GeneralSlot({ member }: { member: Team["members"][0] }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
      <div className="relative w-14 h-14 rounded overflow-hidden bg-white/10 flex-shrink-0">
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
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{member.general_name}</div>
        <div className="text-xs text-foreground-muted truncate">
          {member.skill_1 || "-"}
        </div>
        <div className="text-xs text-foreground-muted truncate">
          {member.skill_2 || "-"}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 重構為 GeneralCard**

用以下代碼取代 GeneralSlot：

```tsx
function GeneralCard({ member }: { member: Team["members"][0] }) {
  return (
    <div className="p-3 bg-white/5 rounded-lg space-y-2">
      <div className="relative w-14 h-14 rounded overflow-hidden bg-white/10">
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
      <div className="font-medium">{member.general_name}</div>
      <div className="text-xs text-foreground-muted truncate">
        {member.skill_1 || "-"}
      </div>
      <div className="text-xs text-foreground-muted truncate">
        {member.skill_2 || "-"}
      </div>
      <div className="space-y-1 pt-2 border-t border-white/10">
        <DetailRow label="兵種" value={member.soldier_type} />
        <DetailRow label="專精" value={member.soldier_skills} />
        <DetailRow label="兵書" value={[member.book_1, member.book_2, member.book_3].filter(Boolean).join(" / ")} />
        <DetailRow label="裝備屬性" value={member.equip_point} />
        <DetailRow label="裝備特效" value={member.equip_stats} />
        <DetailRow label="坐騎" value={member.horse_stats} />
        <DetailRow label="加點" value={member.plus_points} />
        <DetailRow label="技能備選" value={[member.skill_1_alt, member.skill_2_alt].filter(Boolean).join(" / ")} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 驗證建置**

Run: `npm run build`
Expected: 編譯成功，無錯誤

---

### Task 2: 修改 TeamCard 標題區

**Files:**
- Modify: `src/components/team-card.tsx:60-76`

- [ ] **Step 1: 閱讀現有標題區代碼**

```tsx
<div className="p-4 border-b border-white/10">
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-xl font-serif">{team.team_name}</h3>
    <span className={tierColor[team.tier] || ""}>{team.tier}</span>
  </div>
  <div className="flex gap-4 text-sm text-foreground-muted">
    <span>{team.season}</span>
    <span>{team.formation || "-"}</span>
  </div>
</div>
```

- [ ] **Step 2: 修改為置中顯示，移除 season/tier**

```tsx
<div className="p-4 border-b border-white/10">
  <div className="text-center mb-2">
    <h3 className="text-xl font-serif">{team.team_name}</h3>
  </div>
  <div className="text-center text-sm text-foreground-muted">
    <span>{team.formation || "-"}</span>
  </div>
</div>
```

- [ ] **Step 3: 驗證建置**

Run: `npm run build`
Expected: 編譯成功，無錯誤

---

### Task 3: 修改武將卡片排列方式

**Files:**
- Modify: `src/components/team-card.tsx:78-104`

- [ ] **Step 1: 閱讀現有武將配置區代碼**

```tsx
<div className="p-4 space-y-3">
  <h4 className="text-sm text-accent-gold font-medium">武將配置</h4>
  <div className="grid grid-cols-3 gap-2">
    {team.members.map((member) => (
      <GeneralSlot key={member.members_id} member={member} />
    ))}
  </div>
</div>
```

- [ ] **Step 2: 修改為水平排列**

```tsx
<div className="p-4">
  <div className="grid grid-cols-3 gap-3">
    {team.members.map((member) => (
      <GeneralCard key={member.members_id} member={member} />
    ))}
  </div>
</div>
```

- [ ] **Step 3: 移除舊的詳情展開區塊**

刪除以下代碼 (約 line 87-104)：

```tsx
<div className="p-4 border-t border-white/10 space-y-1">
  {team.members.map((member, idx) => (
    <div key={member.members_id} className="space-y-1">
      {idx > 0 && <div className="border-t border-white/5 my-3" />}
      <h4 className="text-xs text-foreground-muted mb-2">
        {member.general_name} 詳情
      </h4>
      <DetailRow label="兵種" value={member.soldier_type} />
      <DetailRow label="專精" value={member.soldier_skills} />
      <DetailRow label="兵書" value={[member.book_1, member.book_2, member.book_3].filter(Boolean).join(" / ")} />
      <DetailRow label="裝備屬性" value={member.equip_point} />
      <DetailRow label="裝備特效" value={member.equip_stats} />
      <DetailRow label="坐騎" value={member.horse_stats} />
      <DetailRow label="加點" value={member.plus_points} />
      <DetailRow label="技能備選" value={[member.skill_1_alt, member.skill_2_alt].filter(Boolean).join(" / ")} />
    </div>
  ))}
</div>
```

- [ ] **Step 4: 驗證建置**

Run: `npm run build`
Expected: 編譯成功，無錯誤

---

### Task 4: 驗證與 lint

- [ ] **Step 1: 執行 lint**

Run: `npm run lint`
Expected: 無 warning/error

- [ ] **Step 2: 執行 build**

Run: `npm run build`
Expected: 編譯成功

- [ ] **Step 3: 提交**

```bash
git add src/components/team-card.tsx
git commit -m "refactor: 重構 TeamCard 為武將卡片形式"
```