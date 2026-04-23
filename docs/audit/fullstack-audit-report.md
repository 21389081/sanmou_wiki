# 三謀資料庫 - 現代全端開發習慣審查報告

## 專案基本資訊

| 項目 | 內容 |
|------|------|
| 框架 | Next.js 16.2.4 (App Router) |
| 語言 | TypeScript (strict mode) |
| 樣式 | Tailwind CSS v4 |
| 後端 | Supabase |
| 動畫 | Motion v12 |
| 測試 | 無 |

---

## ✅ 符合現代開發習慣的部分

### 1. App Router 架構
```typescript
// 正確使用 Server/Client Component 分離
// src/app/generals/page.tsx - Server Component
export default async function GeneralsPage() {
  const generals = await getGenerals(); // 直接在 Server 獲取資料
  return <GeneralGrid generals={generals} />;
}

// src/components/general-grid.tsx - Client Component
'use client'; // 明確標記客戶端
export default function GeneralGrid({ generals }: { generals: General[] }) {
  // 需要交互的邏輯在客戶端
}
```
- 使用 `async/await` 直接在 Server Component 獲取資料
- 正確使用 `'use client'` 標記需要 hydration 的組件

### 2. Server Actions
```typescript
// src/app/builder/actions.ts
"use server";
import { createClient } from '@/lib/supabase/server';

export async function fetchFilteredTeams(filters?: TeamFilters): Promise<Team[]> {
  return await getTeams(filters);
}
```
- 使用 Server Actions 處理數據變更和篩選
- 符合 Next.js 14+ 最佳實踐

### 3. TypeScript 嚴格模式
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```
- 啟用 strict mode，確保類型安全

### 4. Supabase SSR 正確實現
```typescript
// src/lib/supabase/server.ts - Server Component 用
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(..., {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) { ... }
    }
  })
}

// src/lib/supabase/client.ts - Client Component 用
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(...)
}
```
- 正確分離 Server/Browser client

### 5. Tailwind CSS v4 主題配置
```css
/* src/app/globals.css */
@theme {
  --color-wei: #2f5d8c;
  --color-accent-gold: #c6a664;
  --font-serif: 'Noto Serif TC', serif;
}
```
- 使用 v4 的 `@theme` 配置自定義 token
- 強制深色主題美學

### 6. SEO 元數據
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: { default: '三謀資料庫', template: '%s' },
  description: '《三國：謀定天下》武將圖鑑、戰法資料與深度攻略資料庫。',
  keywords: ['三國：謀定天下', '三謀', '武將', '戰法', '配將', '攻略'],
  verification: { google: 'CSa5XYXIauAEOVaCu3POqH5lOKi91rKvdkiYs6aoz0A' },
};
```
- 完整的 metadata 配置

### 7. ESLint 9 配置
```javascript
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```
- 使用 ESLint 9 flat config

### 8. 響應式導航
- 桌面/行動裝置菜單正確分離
- 下拉菜單實現

---

## ⚠️ 需要改進的部分

### 1. 缺少測試框架

**現狀:** 專案中沒有任何測試文件

**建議:**
```bash
# 安裝 Jest + React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# 或使用 Vitest
npm install -D vitest @testing-library/react
```

**需要測試的关键部分:**
- `src/lib/api.ts` - 數據獲取邏輯
- `src/lib/utils.ts` - `cn()` 函數
- `src/components/general-card.tsx` - 渲染邏輯

### 2. 缺少 Loading UI

**現狀:** 雖然 builder 頁面有加載狀態，但其他頁面沒有 `loading.tsx`

**建議添加:**
```typescript
// src/app/generals/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-surface rounded-xl aspect-[159/248]" />
      ))}
    </div>
  );
}
```

### 3. 缺少 Error Boundary

**建議添加:**
```typescript
// src/app/global-error.tsx
'use client';
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="text-center py-20">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 4. 數據獲取缺少緩存策略

**現狀:** 所有查詢每次都直接訪問數據庫

**建議:**
```typescript
// src/lib/api.ts
import { unstable_cache } from 'next/cache';

export const getCachedGenerals = unstable_cache(
  async () => {
    const supabase = await createClient();
    const { data } = await supabase.from('generals_info').select('*');
    return data;
  },
  ['generals'],
  { revalidate: 3600 } // 每小時緩存
);
```

### 5. 缺少環境變量驗證

**現狀:** 直接使用 `process.env.NEXT_PUBLIC_SUPABASE_URL!` 而不檢查

**建議:**
```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export const env = envSchema.safeParse(process.env);

if (!env.success) {
  throw new Error('Invalid environment variables');
}

export const SUPABASE_URL = env.data.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = env.data.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

### 6. 客戶端所有邏輯建議抽離

**現狀:** builder/page.tsx 包含超過 400 行代碼，混合了所有邏輯

**建議:**
```typescript
// src/hooks/useFilterOptions.ts
'use client';
export function useFilterOptions() {
  // 抽離篩選邏輯
}

// src/hooks/useTeamSearch.ts
'use client';
export function useTeamSearch() {
  // 抽離搜索邏輯
}
```

### 7. 缺少表單驗證

**現狀:** builder 頁面使用 `setSelectedGenerals` 直接更新，無驗證

**建議:**
```typescript
import { z } from 'zod';

const teamFilterSchema = z.object({
  generals: z.array(z.string()).max(6),
  tactics: z.array(z.string()).max(6),
  tier: z.enum(['全部', 'T0', 'T0.5', ...]),
  season: z.enum(['全部', 'S1', 'S2', ...]),
});
```

### 8. 缺少自定義 hooks

**建議抽離:**
```typescript
// useSupabase.ts
// useDebounce.ts
// useLocalStorage.ts
```

### 9. API 路由層缺失

**現狀:** 直接在頁面調用 `getGenerals()`，如有REST API需求需重構

**考量:** 目前使用 Server Actions 已足够，但如需對外公開 API，可考慮添加 API routes。

### 10. 缺少國際化 (i18n)

**考量:** 目前僅有中文，但如有擴展需求可考慮 next-intl。

---

## 📊 總結

| 類別 | 評分 | 說明 |
|------|------|------|
| 技術棧選擇 | ⭐⭐⭐⭐⭐ | 先進技術選択 (Next.js 16, Tailwind v4) |
| 程式碼結構 | ⭐⭐⭐⭐⭐ | 清晰的分離 (app/components/lib) |
| TypeScript | ⭐⭐⭐⭐ | strict mode + 類型定義 |
| SEO | ⭐⭐⭐⭐⭐ | 完整元數據 |
| API設計 | ⭐⭐⭐⭐⭐ | 正確使用 Server Actions |
| 測試覆蓋 | ⭐ | 完全缺失 |
| 錯誤處理 | ⭐⭐ | 基礎 try/catch，無 Error Boundary |
| 性能優化 | ⭐⭐⭐ | 無緩存策略 |
| 安全性 | ⭐⭐⭐ | 缺少環境變量驗證 |
| Code Quality | ⭐⭐⭐⭐ | 整體結構良好，��節可優化 |

**整體評估:** 專案在技術棧選擇和基礎架構上符合現代全端開發習慣，但在測試覆蓋、錯誤處理、性能優化方面有改進空間。

---

## 🚀 優先改進建議

1. **高優先:** 添加 loading.tsx 和 error.tsx
2. **高優先:** 設置環境變量驗證
3. **中優先:** 添加基礎單元測試 (api.ts, utils.ts)
4. **中優先:** 添加數據緩存策略
5. **低優先:** 抽離客戶端邏輯至 hooks