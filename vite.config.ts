import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  // 優化開發環境啟動速度
  optimizeDeps: {
    include: ['@chakra-ui/react', '@emotion/react', 'zustand'],
    exclude: ['msw'], // MSW 不需要預構建
  },
  // 開發伺服器配置
  server: {
    hmr: {
      overlay: false, // 減少 HMR 覆蓋層的效能影響
    },
  },
  // 建置優化
  build: {
    target: 'esnext',
    minify: 'terser',
  },
});
