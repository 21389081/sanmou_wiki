# 專案概覽

Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion 的三國武將/戰法資料庫網站。

## 核心指令

```bash
npm run dev     # 開發伺服器 http://localhost:3000
npm run build   # 生產建置
npm run start   # 啟動已建置的生產伺服器
npm run lint    # ESLint 檢查
```

無 test 腳本，專案目前無單元測試。

## 目錄結構

- `src/app/` — App Router 頁面：`page.tsx`（主頁）、`generals/[name]/page.tsx`（武將詳情）、`tactics/[name]/page.tsx`（戰法詳情）、`info/page.tsx`（關於頁面）
- `src/components/` — UI 元件：Navbar、GeneralCard、TacticCard、LayoutTransition
- `src/lib/data.ts` — 靜態武將與戰法資料（目前為 Demo 測試資料）
- `public/images/` — 立繪與戰法圖示資源

## 技術重點

Next.js 16 有 breaking changes，寫碼前參閱 `node_modules/next/dist/docs/`。
Tailwind CSS v4 使用 `@tailwindcss/postcss` 而非傳統 tailwindcss 外掛。
使用 Framer Motion (`motion` package) 實現頁面轉場與動畫效果。

## 已載入技能

可用技能在 `.agents/skills/`：
- `nextjs-app-router-patterns` — Next.js App Router 模式
- `tailwind-design-system` — Tailwind CSS v4 設計系統