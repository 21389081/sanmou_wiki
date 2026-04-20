# 專案概覽

三國武將/戰法資料庫網站（三謀資料庫 Demo）。

## 技術棧

- **Next.js 16.2.4** (App Router)
- **React 19.2.4**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** — `@theme` 在 `src/app/globals.css` 定義自訂顏色
- **motion** (v12.38.0) — 從 `motion/react` 導入
- **ESLint 9** — flat config (`eslint.config.mjs`)
- **Supabase** — SSR client (`src/lib/supabase/`)

## 核心指令

```bash
npm run dev     # 開發伺服器 http://localhost:3000
npm run build   # 生產建置
npm run start   # 啟動已建置的生產伺服器
npm run lint    # ESLint 檢查
```

**無 test 腳本**。

## 資料架構（重要）

### 資料來源（全来自 Supabase）
- **首頁搜尋** → 直接 fetch `generals_info` + `tactics_info`，client 端 filter
- **Navbar 搜尋** → 直接 fetch `generals_info` + `tactics_info`，client 端 filter
- **武將/戰法列表** → `src/lib/api.ts`（Server Component）

### API 函式 (`src/lib/api.ts`)
- `getGenerals()` — 取得所有武將
- `getTactics()` — 取得所有戰法
- `getGeneralByName(name)` — 取得單一武將詳情
- `getTacticByName(name)` — 取得單一戰法詳情
- `getFatesByIds(ids)` — 取得武將緣分資料

### Supabase 資料表
- `generals_info` — 武將資訊
- `tactics_info` — 戰法資訊
- `fate_info` — 緣分資訊

## 目錄結構

```
src/
├── app/
│   ├── page.tsx                      # 首頁（搜尋 + 導覽）
│   ├── layout.tsx                    # 根佈局（含 Navbar + LayoutTransition）
│   ├── globals.css                   # Tailwind v4 theme + 自訂顏色
│   ├── generals/
│   │   ├── page.tsx                  # 武將列表（Server Component）
│   │   ├── general-grid.tsx           # 武將列表 client 元件（過濾邏輯）
│   │   └── [name]/page.tsx            # 武將詳情頁
│   ├── tactics/
│   │   ├── page.tsx                  # 戰法列表（Server Component）
│   │   ├── tactic-grid.tsx           # 戰法列表 client 元件（過濾邏輯）
│   │   └── [name]/page.tsx           # 戰法詳情頁
│   └── info/page.tsx                 # 關於頁面
├── components/
│   ├── navbar.tsx                    # 響應式導覽欄（含手機選單動畫）
│   ├── general-card.tsx               # 武將卡片
│   ├── tactic-card.tsx               # 戰法卡片
│   └── layout-transition.tsx          # 頁面轉場動畫
└── lib/
    ├── data.ts                       # 靜態 Demo 資料（legacy）
    ├── api.ts                        # Supabase 查詢函式
    ├── utils.ts                      # cn() 工具（clsx + twMerge）
    └── supabase/
        ├── client.ts                 # Client-side Supabase
        ├── server.ts                 # Server-side Supabase（用於 RSC）
        └── storage.ts                # 圖片儲存 URL 處理
```

## 已驗證功能

- **首頁即時搜尋** — 使用 Supabase 資料，支援武將/戰法名稱模糊搜尋
- **Navbar 搜尋** — 桌面/手機皆有即時搜尋結果下拉
- **武將圖鑑** — 陣營/品質/兵種 過濾 + 搜尋 + 結果計數
- **戰法圖鑑** — 類型/特性/品質 過濾 + 搜尋 + 結果計數
- **等級切換** — 武將詳情：自帶戰法「初級/滿級」數值對比；戰法詳情：效果「初級/滿級」描述對比
- **響應式 Navbar** — 手機選單有動畫效果，會鎖定 body 滾動
- **頁面轉場** — LayoutTransition 元件實現路由切換動畫

## 設計 token（globals.css）

| Token | 用途 |
|-------|------|
| `--color-wei/shu/wu/qun` | 陣營顏色 |
| `--color-accent-gold` | 金色點綴 (#c6a664) |
| `--color-background` | 深色背景 (#0d0d0d) |
| `--font-serif` | Noto Serif TC（中文標題） |
| `.glass` | 毛玻璃效果 utility class |

## 已載入技能

- `.agents/skills/nextjs-app-router-patterns`
- `.agents/skills/tailwind-design-system`

## 常見問題

- **Styling 無效？** — 使用 Tailwind v4，直接在 className 使用 `--color-` token 或 theme 定義的名稱
- **motion 動畫不運作？** — 確認從 `motion/react` 而非 `framer-motion` 導入
