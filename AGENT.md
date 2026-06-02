# AGENT.md

## 專案概覽

這是一個以 React Router v7 + Vite 建置的前端專案，主要技術包含：

- React 19
- TypeScript
- Chakra UI
- Zustand
- TanStack React Query
- Recharts
- Three.js
- MSW

專案入口與主要來源位於 `app/`。

## 常用指令

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

- `npm run dev`：啟動本機開發環境
- `npm run build`：產生 production build
- `npm run typecheck`：先產生 React Router 型別，再執行 TypeScript 檢查

## 目錄結構

- `app/routes/`：路由頁面
- `app/layouts/`：版面配置元件
- `app/components/`：可重用 UI 元件
- `app/stores/`：Zustand 狀態管理
- `app/mocks/`：MSW mock API 與測試資料
- `app/root.tsx`：應用程式根節點
- `app/chakraTheme.ts`：Chakra theme 設定
- `app/app.css`：全域樣式

## 編碼原則

- 以 TypeScript 撰寫新功能，避免新增不必要的 `any`
- 既有架構已使用 Chakra UI，優先沿用現有元件與 theme
- 狀態若是跨頁共享，優先放到 `app/stores/`
- API 或資料模擬需求，優先擴充 `app/mocks/`
- 路由與頁面邏輯請放在 `app/routes/`，不要把頁面邏輯塞進共用元件
- 修改時盡量維持目前的命名風格與資料夾切分方式

## 修改前先確認

- 先找現有元件、store、mock 是否已經有可重用邏輯
- 避免重複建立相似的狀態或 UI 元件
- 若變更涉及路由，請同步確認 `app/routes.ts`
- 若變更影響表單、登入或 mock API，請一併檢查 `app/mocks/`

## 驗證方式

完成修改後，至少執行：

```bash
npm run typecheck
npm run build
```

如果改到 UI 或互動流程，建議再用 `npm run dev` 做手動確認。

## 注意事項

- 不要覆寫使用者未要求的既有修改
- 不要刪除或重構整個資料夾，除非有明確需求
- 若需要新增檔案，優先放在現有對應資料夾內
- 若要調整 mock 資料或 mock handler，需確認對應頁面不會因此失效

