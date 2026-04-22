@CLAUDE.md

## 開發命令

```bash
npm run dev    # 開發伺服器 http://localhost:3000
npm run build # 生產建置（含 typecheck）
npm run start # 啟動已建置的生產伺服器
npm run lint  # ESLint 檢查
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

### 主要目錄

| 目錄 | 用途 |
|------|------|
| `src/app/` | 頁面路由 (`generals/`, `tactics/`, `buffs/`, `stats/`, `info/`, `builder/`, `api/`) |
| `src/components/` | 共用元件 (`Navbar`, `GeneralCard`, `TacticCard`, `LayoutTransition`) |
| `src/lib/api.ts` | Supabase 查詢函式 |
| `src/lib/supabase/` | Client/Server/Storage 相關函式 |

### API 函式 (`src/lib/api.ts`)

- `getGenerals()` - 取得所有武將
- `getTactics()` - 取得所有戰法
- `getGeneralByName(name)` - 武將詳情
- `getTacticByName(name)` - 戰法詳情
- `getFatesByIds(ids)` - 緣分資料
- `getTeams(filters?)` - 取得所有隊伍與配將資料

## 注意事項

- 無 test framework，無單獨 typecheck 命令（`build` 會進行 typecheck）
- 圖片來自 Supabase Storage，需設定 `next.config.ts` remotePatterns
- `buff&debuff.md` 包含遊戲數值參考文件