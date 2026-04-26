# 三謀資料庫

一個專為《三國：謀定天下》玩家打造的資料查詢平台，提供武將、戰法、配隊等遊戲資訊的完整數據庫。

網站已透過 Vercel 正式上線，請參閱：https://sanmou-wiki.vercel.app/

## 功能特色

### 核心功能

- **武將圖鑑** - 查看所有武將的詳細屬性、技能和緣分效果
- **戰法圖鑑** - 瀏覽各類戰法效果、稀有度和戰法類型
- **配將助手** - 收錄各版本強勢陣容，提供玩家組隊思路
- **狀態一覽** - 完整收錄遊戲內所有狀態效果說明
- **詞條一覽** - 完整收錄遊戲內所有裝備、馬匹詞條效果說明

### 智能搜尋

- 支援武將名稱、戰法關鍵字即時搜尋
- 提供模糊匹配和快速跳轉功能
- 搜尋結果包含縮圖預覽，直觀易用

### 使用體驗

- 響應式設計，支援手機、平板、桌機瀏覽
- 流暢的動畫過場和互動效果
- 直覺化導航結構，快速找到所需資訊

## 技術棧

- **前端框架**：Next.js 16.2.4 (App Router)
- **程式語言**：TypeScript (嚴格模式)
- **樣式系統**：Tailwind CSS v4
- **動畫庫**：Motion v12
- **UI組件**：Lucide React 圖標庫
- **後端服務**：Supabase (SSR客戶端)
- **SEO 優化**：metadata + sitemap，並使用 Google Search Console 監控網頁數據

## API 設計

### 主要查詢函數

```typescript
// 獲取所有武將資料
getGenerals(): Promise<General[]>

// 獲取所有戰法資料
getTactics(): Promise<Tactic[]>

// 依據名稱獲取特定武將
getGeneralByName(name: string): Promise<General | null>

// 依據名稱獲取特定戰法
getTacticByName(name: string): Promise<Tactic | null>

// 依據ID列表獲取緣分資料
getFatesByIds(ids: (number | null)[]): Promise<Fate[]>

// 獲取隊伍與配將資訊（支援篩選）
getTeams(filters?: TeamFilters): Promise<Team[]>
```

### 資料結構範例

#### 武將 (General)

```typescript
{
  gid: 1,
  name: "諸葛亮",
  avatar: "/generals/zhuge.jpg",
  rarity: "橙",  // 稀有度：橙/紫/藍
  camp: "蜀",     // 阵营：魏/蜀/吳/群
  strength: "85", // 武力值
  intelligence: "98", // 智力值
  leadership: "92", // 统率值
  // ...其他屬性
}
```

#### 戰法 (Tactic)

```typescript
{
  tid: 1,
  name: "火燒赤壁",
  icon: "/tactics/fire.jpg",
  rarity: "橙",
  type: "主動戰法",
  effect_base: "對敵軍全體造成120%火系傷害",
  // ...其他屬性
}
```

## 本地開發設置

### 環境需求

- Node.js >= 18.0.0
- npm 或 yarn 套件管理器

### 安裝步驟

1. **複製專案並安裝依賴**

```bash
git clone <repository-url>
cd sanmou-wiki
npm install
```

2. **設定環境變數**
   建立 `.env.local` 檔案：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **啟動開發伺服器**

```bash
npm run dev
```

訪問 http://localhost:3000 開始使用

### 開發命令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本
npm run start    # 啟動生產伺服器
npm run lint     # 執行程式碼檢查
```
