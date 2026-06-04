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
        XMLHttpRequest.prototype.open = function (
            method: string,
            url: string | URL,
            ...args: any[]
        ): void {
            if (typeof url === 'string' && url.startsWith('/api') && !url.startsWith(SUB_PATH)) {
                url = `${SUB_PATH}${url}`;
            }
            // @ts-ignore
            return originalOpen.call(this, method, url, ...args);
        };
    }
}

// 啟動 MSW worker
export const startMocks = () => {
    // 檢查是否為瀏覽器環境
    if (typeof window !== 'undefined') {
        setupApiInterceptor();

        // ⭐ 關鍵修正：動態判斷環境來決定 Service Worker 的路徑
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const homepagePath = isLocalhost ? '/' : '/cdp-dashboard-template/';

        worker.start({
            serviceWorker: {
                // 本地端會指向 '/mockServiceWorker.js'，線上會指向 '/cdp-dashboard-template/mockServiceWorker.js'
                url: `${homepagePath}mockServiceWorker.js`,
                options: {
                    scope: homepagePath,
                },
            },
            onUnhandledRequest: 'bypass',
        });

        console.log(`[MSW] Mock Service Worker 已啟動 (環境範圍: ${homepagePath})`);
    }
};

// 停止 MSW worker
export const stopMocks = () => {
    worker.stop();
};