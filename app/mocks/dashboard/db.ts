// Dashboard 模擬資料庫
export interface DataField {
    name: string;
    type: 'string' | 'number' | 'date';
    label: string;
}

export interface DataRecord {
    [key: string]: string | number | Date;
}

export interface DataSource {
    id: string;
    name: string;
    type: string;
    fields: DataField[];
    data: DataRecord[];
}

// 模擬數據源資料庫
export const dashboardDb = {
    dataSources: [
        {
            id: '1',
            name: '用戶註冊數據',
            type: 'user',
            fields: [
                { name: 'month', type: 'string' as const, label: '月份' },
                { name: 'count', type: 'number' as const, label: '註冊數' },
            ],
            data: [
                { month: '1月', count: 120 },
                { month: '2月', count: 150 },
                { month: '3月', count: 180 },
                { month: '4月', count: 90 },
                { month: '5月', count: 200 },
                { month: '6月', count: 160 },
            ],
        },
        {
            id: '2',
            name: '訂單銷售數據',
            type: 'order',
            fields: [
                { name: 'product', type: 'string' as const, label: '產品' },
                { name: 'amount', type: 'number' as const, label: '銷售額' },
            ],
            data: [
                { product: '產品A', amount: 50000 },
                { product: '產品B', amount: 35000 },
                { product: '產品C', amount: 42000 },
                { product: '產品D', amount: 28000 },
            ],
        },
        {
            id: '3',
            name: '產品瀏覽數據',
            type: 'product',
            fields: [
                { name: 'category', type: 'string' as const, label: '類別' },
                { name: 'views', type: 'number' as const, label: '瀏覽次數' },
            ],
            data: [
                { category: '電子產品', views: 15000 },
                { category: '服飾', views: 12000 },
                { category: '家居用品', views: 8000 },
                { category: '運動器材', views: 6000 },
                { category: '書籍', views: 4000 },
            ],
        },
        {
            id: '4',
            name: '客戶滿意度調查',
            type: 'survey',
            fields: [
                { name: 'rating', type: 'string' as const, label: '評分' },
                { name: 'count', type: 'number' as const, label: '人數' },
            ],
            data: [
                { rating: '非常滿意', count: 45 },
                { rating: '滿意', count: 30 },
                { rating: '普通', count: 15 },
                { rating: '不滿意', count: 8 },
                { rating: '非常不滿意', count: 2 },
            ],
        },
        {
            id: '5',
            name: '網站流量分析',
            type: 'analytics',
            fields: [
                { name: 'source', type: 'string' as const, label: '流量來源' },
                { name: 'visitors', type: 'number' as const, label: '訪客數' },
            ],
            data: [
                { source: '搜尋引擎', visitors: 45000 },
                { source: '社群媒體', visitors: 32000 },
                { source: '直接訪問', visitors: 18000 },
                { source: '推薦連結', visitors: 12000 },
            ],
        },
    ],

    // 獲取所有數據源
    getDataSources(): DataSource[] {
        return this.dataSources;
    },

    // 根據 ID 獲取數據源
    getDataSourceById(id: string): DataSource | undefined {
        return this.dataSources.find(ds => ds.id === id);
    },
};
