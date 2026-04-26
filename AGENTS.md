@CLAUDE.md

## 開發命令

```bash
npm run dev    # 開發伺服器 http://localhost:3000
npm run build  # 生產建置（含 typecheck）
npm run start  # 啟動已建置的生產伺服器
npm run lint   # ESLint 9 (flat config)
```

## 環境設定

必需 `.env.local`：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 專案架構

- **框架**：Next.js 16.2.4 (App Router)
- **語言**：TypeScript (strict mode)
- **樣式**：Tailwind CSS v4，自定義 token 在 `src/app/globals.css`
- **後端**：Supabase (SSR Client)
- **動畫**：Motion v12
- **無 test framework**，無單獨 typecheck 命令（`build` 會進行 typecheck）

## 主要目錄

| 目錄 | 用途 |
|------|------|
| `src/app/` | 頁面路由 (`generals/`, `tactics/`, `buffs/`, `stats/`, `info/`, `builder/`, `admin_join_team/`) |
| `src/components/` | 共用元件 (`Navbar`, `GeneralCard`, `TacticCard`, `LayoutTransition`) |
| `src/lib/api.ts` | Supabase 查詢函式（Server Component 用） |
| `src/lib/supabase/` | `server.ts` 用於 RSC；`storage.ts` 處理圖片 URL |
| `.agents/skills/` | 專案專用 skills（frontend-design） |
| `.claude/skills/` | Claude 內建 skills（playwright-cli） |

## API 函式 (`src/lib/api.ts`)

- `getGenerals()` - 取得所有武將
- `getTactics()` - 取得所有戰法
- `getGeneralByName(name)` - 武將詳情
- `getTacticByName(name)` - 戰法詳情
- `getFatesByIds(ids)` - 緣分資料
- `getTeams(filters?)` - 隊伍與配將，含 tier 排序（T0 > T0.5 > ... > T3）

## 特殊約定

- **Supabase SSR**：`createClient()` 只能在 Server Component 或 Server Action 中呼叫（使用 cookies）
- **圖片 Storage bucket**：`img`，路徑格式 `generals/`, `tactics/`, `general's tactics/`
- **rarity 轉換**：API 回傳 `orange/purple/blue`，需映射為 `橙/紫/藍`
- **Tier 排序**：`src/lib/api.ts` 內有 `tierOrder` 映射，修改順序需同步更新

## 代理指令

當您在執行任何任務時，如果遇到以下情況，請使用對應的指令：

- **啟動開發伺服器**：`npm run dev`
- **建置專案**：`npm run build`
- **啟動生產伺服器**：`npm run start`
- **程式碼檢查**：`npm run lint`

這些指令是您在開發過程中最常需要用到的，可以幫助您快速進行開發、測試和部署。