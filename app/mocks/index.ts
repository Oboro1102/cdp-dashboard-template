import { worker } from './browser';

// 啟動 MSW worker（推薦的瀏覽器整合方式）
export const startMocks = () => {
    // 檢查是否為瀏覽器環境（避免 SSR 時註冊 Service Worker）
    if (typeof window !== 'undefined') {
        worker.start({
            serviceWorker: {
                url: '/cdp-dashboard-template/mockServiceWorker.js',
                options: {
                    scope: '/cdp-dashboard-template/',
                },
            },
            // 允許未處理的請求直接通過（方便開發）
            onUnhandledRequest: 'bypass',
        });
        console.log('[MSW] Mock Service Worker 已啟動');
    }
};

// 停止 MSW worker
export const stopMocks = () => {
    worker.stop();
};
