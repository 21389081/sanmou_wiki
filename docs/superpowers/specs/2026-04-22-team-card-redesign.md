# 配將助手 - 陣容卡片重构设计

## 概述

重構 `TeamCard` 元件，将武將詳情從垂直展開改為武將卡片形式。

## 結構

### 陣容卡片 (TeamCard)
- **標題區**：隊伍名稱 (置中) + 戰法 (置中)
- ~~賽季~~、~~Tier~~
- **武將卡片區**：三張武將卡片水平並排 (`grid-cols-3`)

### 武將卡片 (GeneralCard)
每張卡片內容由上到下：
1. 頭像 (next/image, 56x56)
2. 武將名字
3. 戰法一
4. 戰法二
5. 詳情欄位：
   - 兵種
   - 專精
   - 兵書
   - 裝備屬性
   - 裝備特效
   - 坐騎
   - 加點
   - 技能備選

## UI/UX

- 使用現有配色：`bg-surface`, `border-white/10`, `hover:border-accent-gold/40`
- 每張武將卡片獨立的白色/5背景，間距 `gap-2` 或 `gap-3`
- 詳情欄位使用 `DetailRow` 元件顯示
- 隊伍標題區維持原樣

## 實作

修改 `src/components/team-card.tsx`：
1. 重構 `GeneralSlot` → `GeneralCard` 元件
2. 移除舊的詳情展開區塊
3. 三張卡片使用 `grid-cols-3` 水平排列