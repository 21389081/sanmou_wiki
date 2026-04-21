# 三謀資料庫

一個為《三國：謀定天下》打造的武將與戰法資料庫網站。

## 線上預覽

開發完成後可部署至 Vercel / Cloudflare Pages 等平台。

## 設計理念

- **流暢互動**：利用 Motion 實現細膩的頁面轉場與卡片懸停效果。
- **完整響應**：完全響應式設計，確保手機端也能擁有良好的查閱體驗。

## 核心功能

### 首頁

- **快速查詢**：支援武將、戰法名稱即時搜尋，下拉選單即時顯示結果
- **功能導覽**：六個入口卡片（武將圖鑑 / 戰法圖鑑 / 詞條一覽 / 狀態一覽 / 官方攻略站 / 關於本站）

### 武將圖鑑 (`/generals`)

- **三重過濾系統**：陣營（魏/蜀/吳/群）、品質（橙/紫/藍）、兵種（盾/槍/弓/騎）
- **即時搜尋**：名稱關鍵字過濾
- **結果計數**：顯示符合條件的武將數量

### 戰法圖鑑 (`/tactics`)

- **雙重過濾系統**：類型（主動/被動/指揮/追擊）、特性（兵刃/謀略/治療/防禦/輔助/文武）
- **三級過濾**：品質（橙/紫/藍）
- **即時搜尋**：名稱關鍵字過濾
- **結果計數**：顯示符合條件的戰法數量

### 詳情頁面

- **等級切換**：武將自帶戰法「初/滿級」數值對比；戰法效果「初/滿級」描述對比
- **武將詳情**：頭像、屬性面板（武力/智力/統率/先攻）、陣營/兵種/品質標籤、自帶戰法、緣分效果

### 響應式導覽欄

- **首頁/武將圖鑑/戰法圖鑑/詞條一覽/狀態一覽/官方攻略站/關於本站** 導覽項目
- **桌面/手機即時搜尋**：手機選單具備展開動畫，展開時鎖定背景滾動

---

## 技術棧

| 類別        | 技術                                                        |
| ----------- | ----------------------------------------------------------- |
| 框架        | [Next.js 16.2.4](https://nextjs.org/) (App Router)          |
| 語言        | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| UI          | [React 19.2.4](https://react.dev/)                          |
| 樣式        | [Tailwind CSS v4](https://tailwindcss.com/)                 |
| 動畫        | [Motion](https://motion.dev/) v12.38.0                      |
| 圖示        | [Lucide React](https://lucide.dev/)                         |
| 後端/資料庫 | [Supabase](https://supabase.com/) (SSR Client)              |
| 程式碼檢查  | [ESLint 9](https://eslint.org/) (flat config)               |
| 部署        | Vercel / Cloudflare Pages                                   |

---

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

在專案根目錄建立 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

### 4. 瀏覽

打開 [http://localhost:3000](http://localhost:3000)

---

## 專案結構

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首頁（含搜尋功能）
│   ├── layout.tsx               # 根佈局（含 Navbar + LayoutTransition）
│   ├── globals.css              # Tailwind v4 主題定義
│   ├── generals/
│   │   ├── page.tsx             # 武將列表頁（Server Component）
│   │   ├── general-grid.tsx     # 武將列表 Client Component（過濾邏輯）
│   │   └── [name]/
│   │       ├── page.tsx          # 武將詳情頁入口
│   │       └── general-detail-content.tsx  # 武將詳情內容
│   ├── tactics/
│   │   ├── page.tsx             # 戰法列表頁（Server Component）
│   │   ├── tactic-grid.tsx        # 戰法列表 Client Component（過濾邏輯）
│   │   └── [name]/
│   │       ├── page.tsx          # 戰法詳情頁入口
│   │       └── tactic-detail-content.tsx  # 戰法詳情內容
│   ├── info/
│   │   └── page.tsx            # 關於頁面
│   ├── buffs/
│   │   └── page.tsx           # 增益頁面
│   └── stats/
│       └── page.tsx            # 屬性頁面
├── components/
│   ├── navbar.tsx               # 響應式導覽欄（含搜尋功能）
│   ├── general-card.tsx           # 武將卡片
│   ├── tactic-card.tsx           # 戰法卡片
│   └── layout-transition.tsx     # 頁面轉場動畫
└── lib/
    ├── api.ts                  # Supabase 查詢函式（Server Component）
    ├── utils.ts                # 工具函式（cn）
    └── supabase/
        ├── client.ts          # Client-side Supabase
        ├── server.ts          # Server-side Supabase（用於 RSC）
        └── storage.ts        # 圖片儲存 URL 處理
```

---

## API 函式 (`src/lib/api.ts`)

| 函式                     | 用途                   |
| ------------------------ | ---------------------- |
| `getGenerals()`          | 取得所有武將           |
| `getTactics()`           | 取得所有戰法           |
| `getGeneralByName(name)` | 依名稱取得單一武將詳情 |
| `getTacticByName(name)`  | 依名稱取得單一戰法詳情 |
| `getFatesByIds(ids)`     | 依 ID 陣列取得緣分資料 |

---

## 資料庫結構

### generals_info

| 欄位                  | 類型    | 說明                      |
| --------------------- | ------- | ------------------------- |
| gid                   | serial  | 主鍵                      |
| name                  | text    | 武將名稱                  |
| avatar                | text    | 頭像檔名                  |
| rarity                | text    | 品質 (orange/purple/blue) |
| camp                  | text    | 陣營 (魏/蜀/吳/群)        |
| soldier_type          | text    | 兵種                      |
| strength              | text    | 武力                      |
| intelligence          | text    | 智力                      |
| leadership            | text    | 統率                      |
| initiative            | text    | 先攻                      |
| tactic_name           | text    | 自帶戰法名稱              |
| tactic_icon           | text    | 自帶戰法圖示              |
| tactic_type           | text    | 自帶戰法類型              |
| tactic_trait          | text    | 自帶戰法特性              |
| tactic_chance         | text    | 自帶戰法發動概率          |
| tactic_effect_base    | text    | 自帶戰法初級效果          |
| tactic_effect_max     | text    | 自帶戰法滿級效果          |
| season                | text    | 登場賽季                  |
| fate_id_1 ~ fate_id_4 | integer | 緣分 ID                   |

### tactics_info

| 欄位         | 類型   | 說明                       |
| ------------ | ------ | -------------------------- |
| tid          | serial | 主鍵                       |
| name         | text   | 戰法名稱                   |
| icon         | text   | 戰法圖示                   |
| rarity       | text   | 品質 (orange/purple/blue)  |
| type         | text   | 類型 (主動/被動/指揮/追擊) |
| soldier_type | text   | 適用兵種                   |
| trait        | text   | 特性                       |
| chance       | text   | 發動概率                   |
| effect_base  | text   | 初級效果                   |
| effect_max   | text   | 滿級效果                   |
| season       | text   | 登場賽季                   |

### fate_info

| 欄位    | 類型   | 說明     |
| ------- | ------ | -------- |
| fid     | serial | 主鍵     |
| name    | text   | 緣分名稱 |
| members | text   | 緣分成員 |
| effect  | text   | 緣分效果 |

---

##  可用腳本

```bash
npm run dev    # 開發伺服器 http://localhost:3000
npm run build # 生產建置
npm run start # 啟動已建置的生產伺服器
npm run lint  # ESLint 檢查
```

---

##  設計 Token (`src/app/globals.css`)

| Token                    | 用途                      |
| ------------------------ | ------------------------- |
| `--color-wei/shu/wu/qun` | 陣營顏色                  |
| `--color-accent-gold`    | 金色點綴 (#c6a664)        |
| `--color-background`     | 深色背景 (#0d0d0d)        |
| `--font-serif`           | Noto Serif TC（中文標題） |
| `.glass`                 | 毛玻璃效果 utility class  |

---

##  License

MIT
