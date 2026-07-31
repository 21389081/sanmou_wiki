# 管理員新增陣容後台設計規格

## 目標與限制

新增 `/admin_join_team` 後台頁面，讓管理員以 `ADMIN_PASSWORD` 登入後，從現有武將與戰法資料中搜尋選擇，建立一組完整陣容。現有程式碼檔案一律不修改；只新增後台專用檔案、Supabase migration 與本規格文件。

## 安全架構

- 保留 `teams_info`、`team_members` 的匿名公開讀取。
- 移除兩表對 `anon` 與 `authenticated` 的新增權限。
- 新增僅 `service_role` 可執行的原子寫入 RPC；匿名與一般登入角色不可執行。
- 新增 server-only Supabase client，讀取 `SUPABASE_SECRET_KEY`，且不得被 Client Component 引用。
- 管理員密碼只在 Server Action 中與 `ADMIN_PASSWORD` 比對。
- 登入成功後簽發短效、`HttpOnly`、`SameSite=Strict` 的簽章 cookie；正式環境加上 `Secure`。
- 每次載入管理資料與提交陣容時，伺服器都重新驗證 cookie。

## 資料模型與交易

每個陣容由以下資料構成：

- `teams_info` 一筆：`team_name`、`tier`、`formation`、`season`。
- `team_members` 三筆，位置固定為 1、2、3：`general_img`、`general_name`、`skill_1`、`skill_1_alt`、`skill_2`、`skill_2_alt`、`soldier_type`、`soldier_skills`、`book_1`、`book_2`、`book_3`、`equip_point`、`plus_points`。

RPC 在同一交易中驗證並新增主表與三名成員。成員數量不是三筆、位置不完整、必要欄位空白或選擇的武將／戰法不存在時，整筆操作失敗並回滾，不留下空陣容。

## 頁面與互動

未登入時只顯示置中的管理員密碼卡片。登入後顯示：

1. 陣容基本資料：名稱、Tier、陣型、賽季。
2. 三張成員卡：主將、第二位、第三位。
3. 武將搜尋選擇器：資料取自 `generals_info`，選取後自動填入 `general_name` 與原始圖片路徑 `general_img`。
4. 兩個主要戰法與兩個替代戰法搜尋選擇器：資料取自 `tactics_info`。
5. 兵種、兵種專精、三格兵書、裝備屬性與加點欄位。
6. 固定底部提交區，顯示欄位錯誤、提交狀態與成功結果。

視覺延續現有深色、金色重點、襯線標題、半透明面板與細邊框語言；不修改 `globals.css`，只使用既有 Tailwind token。桌面版以三欄成員卡呈現，窄螢幕改為單欄。

## 驗證規則

- 陣容名稱、Tier、陣型、賽季必填。
- 固定三名成員；三名武將皆必填且不可重複。
- 每名成員的兩個主要戰法、兵種、兵書一與加點必填。
- 武將與所有已填戰法必須存在於資料庫選項中。
- 替代戰法、兵種專精、兵書二、兵書三、裝備屬性可留空。
- Client Component 提供即時提示；Server Action 與 RPC 各自重新驗證，瀏覽器驗證不視為安全邊界。

## 新增檔案範圍

- `src/app/admin_join_team/page.tsx`
- `src/app/admin_join_team/actions.ts`
- `src/app/admin_join_team/admin-team-form.tsx`
- `src/app/admin_join_team/validation.ts`
- `src/lib/supabase/admin.ts`
- 新的 Supabase migration 檔案
- 必要的新測試檔案

不修改 Navbar、sitemap、builder、既有 API、既有 Supabase clients、`globals.css`、`package.json` 或 `.env.local`。

## 錯誤與復原

- 密碼錯誤使用一般化訊息，不洩漏環境設定。
- 選項載入失敗時不顯示空白表單，提供重試提示。
- 重複提交期間停用按鈕。
- RPC 失敗只回傳可操作的管理員訊息，詳細錯誤留在伺服器日誌且不包含秘密。
- 成功後顯示新 `team_id`，並提供清空表單建立下一組陣容的操作。

## 驗證與完成標準

- 匿名 `SELECT` 仍成功，匿名 `INSERT` 被拒絕。
- 未登入無法讀取管理選項或提交陣容。
- 錯誤密碼不建立工作階段；正確密碼可進入表單。
- 無效、缺欄、重複武將或非三人成員資料被拒絕。
- 合法資料一次建立一筆 `teams_info` 與三筆 `team_members`。
- 模擬成員新增失敗時不留下主表資料。
- 執行 `npm run lint`、`npm run build`，並以瀏覽器驗證桌面與手機版登入、搜尋選擇、錯誤提示及成功提交流程。

