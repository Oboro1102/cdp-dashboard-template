import { worker } from './browser';

function setupApiInterceptor(): void {
    // 判斷是否在線上環境 (非本地端)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const SUB_PATH = '/cdp-dashboard-template';

        // A. 攔截原生 fetch
        const originalFetch = window.fetch;
        window.fetch = async function (
            input: RequestInfo | URL,
            init?: RequestInit
        ): Promise<Response> {
            let url = typeof input === 'string' ? input : (input as Request).url || input.toString();

            // 如果請求是以 /api 開頭，且還沒補上子路徑，就幫它補上
            if (url.startsWith('/api') && !url.startsWith(SUB_PATH)) {
                url = `${SUB_PATH}${url}`;
            }

            if (typeof input === 'string') {
                input = url;
            } else {
                input = new Request(url, input as Request);
            }
            return originalFetch.call(this, input, init);
        };

        // B. 攔截原生 XMLHttpRequest (Axios 底層)
        const originalOpen = XMLHttpRequest.prototype.open;
        // 這裡使用定製的參數型別以符合原本的 XMLHttpRequestBodyInit 規範
        XMLHttpRequest.prototype.open = function (
            method: string,
            url: string | URL,
            ...args: any[]
        ): void {
            if (typeof url === 'string' && url.startsWith('/api') && !url.startsWith(SUB_PATH)) {
                url = `${SUB_PATH}${url}`;
            }
            // @ts-ignore 或者使用強制轉型，確保相容所有多載 (Overloads)
            return originalOpen.call(this, method, url, ...args);
        };
    }
}
// 啟動 MSW worker（推薦的瀏覽器整合方式）
export const startMocks = () => {
    // 檢查是否為瀏覽器環境（避免 SSR 時註冊 Service Worker）
    if (typeof window !== 'undefined') {
        setupApiInterceptor();
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
