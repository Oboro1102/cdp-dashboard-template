# CDP Dashboard Template

現代化的 React 應用程式範本，使用 React Router 構建完整的儀表板應用程式。

## 🚀 專案特色

- 🛡️ **安全性強化** - 密碼哈希處理、JWT 認證、輸入驗證
- ⚡️ **效能優化** - React.memo、useMemo、懶加載、快取機制
- 📊 **儀表板功能** - 動態圖表、數據源管理、面板配置
- 🔒 **TypeScript** - 完整的類型安全
- 🎨 **Chakra UI** - 現代化的 UI 組件庫
- 🔄 **MSW Mock** - API 模擬服務
- 📱 **響應式設計** - 支援多種裝置

## 🏗️ 技術棧

- **前端**: React 18, TypeScript, React Router v7
- **狀態管理**: Zustand
- **UI 組件**: Chakra UI
- **圖表**: Recharts
- **API 模擬**: MSW (Mock Service Worker)
- **構建工具**: Vite

## 📦 安裝

```bash
npm install
```

## 🚀 開發

啟動開發伺服器：

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 運行。

## 🔧 主要功能

### 🛡️ 認證系統

- 登入/註冊/密碼重設
- JWT token 認證
- 密碼哈希處理
- 會話管理

### 📊 儀表板

- 動態面板管理
- 長條圖和圓餅圖
- 數據源配置
- 即時數據更新

### 👥 會員管理

- 會員列表與分頁
- 會員詳細資料
- 購買歷史追蹤
- 價值指標分析

## 📈 效能優化

### 已實施的優化

- ✅ **懶加載** - 路由和組件懶加載
- ✅ **記憶化** - 使用 useMemo 和 React.memo
- ✅ **快取機制** - sessionStorage 快取和 API 快取
- ✅ **重試機制** - 指數退避重試邏輯
- ✅ **代碼分割** - 路由級別的代碼分割

### 安全性改進

- ✅ **密碼哈希** - 模擬 bcrypt 哈希處理
- ✅ **輸入驗證** - 電子郵件格式、密碼長度驗證
- ✅ **SQL 注入防護** - ID 格式驗證
- ✅ **JWT 安全** - token 過期檢查

## 🗄️ 真實後端資料庫規格

以下規格依據 `app/mocks/` 中的模擬資料庫定義，說明接入真實後端時所需的資料庫結構。

### 🧑 使用者表（Auth 模組）

依據 `app/mocks/auth/db.ts` 的 `MockUser`：

| 欄位 | 型別 | 說明 | 預設/約束 |
| --- | --- | --- | --- |
| `id` | string / UUID | 主鍵，使用者唯一識別碼 | PK, auto-increment |
| `email` | string | 電子郵件，登入憑證 | UNIQUE, NOT NULL |
| `password` | string | 密碼（**bcrypt 哈希儲存**，絕不存明文） | NOT NULL |
| `name` | string | 使用者名稱 | NOT NULL |
| `createdAt` | datetime | 建立時間 | DEFAULT now() |

> 🔒 後端需提供 `hash()` / `verify()` 對應的 bcrypt（建議 cost factor ≥ 10），並以 email 查詢驗證憑證。

### 👥 會員表（Customer 模組）

依據 `app/mocks/customer/db.ts` 的 `Customer`：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `id` | string / UUID | 主鍵，會員唯一識別碼 |
| `email` | string | 電子郵件 |
| `phone` | string | 手機號碼（09 開頭） |
| `registrationTime` | datetime | 註冊時間 |
| `birthday` | date | 生日 |
| `membershipLevel` | enum | 會員等級：`bronze` / `silver` / `gold` / `platinum` |
| `fbId` | string \| null | Facebook ID（可為空） |
| `lineId` | string \| null | Line ID（可為空） |
| `cookieId` | string | Cookie 識別碼 |
| `clvValue` | number | CLV 顧客終身價值 |
| `activityScore` | integer (0–100) | 活躍度分數 |
| `revenueContribution` | number | 營收貢獻總額 |
| `lastPurchaseTime` | datetime \| null | 最後購買時間 |

#### 購買記錄表（PurchaseRecord）

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `id` | string / UUID | 主鍵 |
| `orderId` | string | 訂單編號（如 `ORD-0001-001`） |
| `customerId` | FK → Customer.id | 所屬會員（一對多關聯） |
| `purchaseDate` | datetime | 購買日期 |
| `amount` | number | 訂單金額 |
| `status` | enum | `completed` / `pending` / `cancelled` |

#### 購買項目表（PurchaseItem）

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `productId` | string | 商品 ID |
| `productName` | string | 商品名稱 |
| `quantity` | integer | 數量 |
| `price` | number | 單價 |
| `purchaseRecordId` | FK → PurchaseRecord.id | 所屬訂單（一對多關聯） |

### 📊 數據源表（Dashboard 模組）

依據 `app/mocks/dashboard/db.ts` 的 `DataSource`：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `id` | string / UUID | 主鍵，數據源唯一識別碼 |
| `name` | string | 數據源名稱（如「用戶註冊數據」） |
| `type` | string | 類型：`user` / `order` / `product` / `survey` / `analytics` 等 |
| `fields` | JSON | 欄位定義陣列：`{ name, type: 'string' \| 'number' \| 'date', label }` |
| `data` | JSON | 資料記錄陣列（key-value 形式） |

> 💡 `fields` 與 `data` 在真實後端可存為 JSON 欄位（PostgreSQL `JSONB`），或拆成正規化的 `data_source_fields` / `data_records` 表以利查詢與聚合。

### 🔗 實體關聯

```
users (auth)          customers            data_sources
┌──────────┐          ┌───────────────┐     ┌──────────────┐
│ id       │          │ id            │     │ id           │
│ email    │          │ ...會員欄位    │     │ name/type    │
│ password │          ├───────────────┤     │ fields (JSON)│
│ name     │          │ purchase_     │     │ data   (JSON)│
└──────────┘          │ records       │     └──────────────┘
                      │  └ purchase_  │
                      │    items      │
```

### ⚙️ API 行為對照（後端需支援的查詢）

| Mock 方法 | 對應後端行為 |
| --- | --- |
| `findUserByEmail(email)` | 以 email 精確查詢使用者（含索引） |
| `createUser(...)` | 建立使用者，密碼先經 bcrypt 哈希 |
| `validateUser(email, password)` | 查詢 + bcrypt 比對憑證 |
| `getCustomers({ page, limit, id })` | 分頁列表（預設 `page=1`, `limit=10`），回傳 `{ customers, total, page, limit }`；指定 `id` 時回傳單一會員 |
| `getDataSources()` / `getDataSourceById(id)` | 列出所有數據源 / 依 ID 取得單一數據源 |

## 🏗️ 專案結構

```
app/
├── components/          # 可重用組件
│   ├── DashboardPanel.tsx
│   ├── DashboardModal.tsx
│   └── Navbar.tsx
├── layouts/            # 佈局組件
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── mocks/              # API 模擬
│   ├── auth/
│   ├── customer/
│   └── dashboard/
├── routes/             # 路由頁面
├── stores/             # 狀態管理
│   ├── authStore.ts
│   └── dashboardStore.ts
└── root.tsx           # 應用程式入口
```

## 🚀 部署

### 手動部署

部署 `npm run build` 的輸出：

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # 靜態資源
│   └── server/    # 伺服器端代碼
```

## 📋 開發指南

### 新增功能

1. 在 `routes/` 下新增頁面
2. 在 `components/` 下新增組件
3. 在 `stores/` 下新增狀態管理
4. 在 `mocks/` 下新增 API 模擬

### 效能最佳化

- 使用 `useMemo` 處理複雜計算
- 使用 `React.memo` 避免不必要的重渲染
- 實施適當的快取策略
- 減少不必要的 API 請求

### 安全性注意

- 始終驗證用戶輸入
- 使用 HTTPS 在生產環境
- 實施適當的認證和授權
- 定期更新依賴項

---

🛡️ **安全提醒**: 此範本包含模擬的安全措施，生產環境需要實施真正的安全措施。

🚀 **效能提醒**: 已實施多種效能優化，確保應用程式響應迅速。

Built with ❤️ using React Router and modern web technologies.
