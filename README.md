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
