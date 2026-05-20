import { create } from "zustand";

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

export interface ChartConfig {
    type: 'bar' | 'pie';
    xAxis?: string;  // 選擇的 X 軸欄位名稱
    yAxis?: string;  // 選擇的 Y 軸欄位名稱
}

export interface DashboardPanel {
    id: string;
    name: string;
    dataSourceId: string;
    chartConfig: ChartConfig;
    createdAt: number;
}

interface DashboardState {
    panels: DashboardPanel[];
    dataSources: DataSource[];
    isModalOpen: boolean;
    editingPanelId: string | null;
    isLoading: boolean;
    lastFetchTime: number | null;

    // Actions
    addPanel: (panel?: Omit<DashboardPanel, 'id' | 'createdAt'>) => void;
    removePanel: (id: string) => void;
    updatePanel: (id: string, updates: Partial<DashboardPanel>) => void;
    openModal: (panelId?: string) => void;
    closeModal: () => void;
    fetchDataSources: () => Promise<void>;
    getDataSource: (id: string) => DataSource | undefined;
    clearCache: () => void;
}

// Cache 時效性（5分鐘）
const CACHE_DURATION = 5 * 60 * 1000;

export const useDashboardStore = create<DashboardState>((set, get) => ({
    panels: [],
    dataSources: [],
    isModalOpen: false,
    editingPanelId: null,
    isLoading: false,
    lastFetchTime: null,

    addPanel: (panel) => {
        const newPanel: DashboardPanel = {
            id: `panel-${Date.now()}`,
            name: panel?.name || '未設定面板',
            dataSourceId: panel?.dataSourceId || '',
            chartConfig: panel?.chartConfig || { type: 'bar' },
            createdAt: Date.now(),
        };
        set((state) => ({
            panels: [...state.panels, newPanel],
        }));
    },

    removePanel: (id) => {
        set((state) => ({
            panels: state.panels.filter((p) => p.id !== id),
        }));
    },

    updatePanel: (id, updates) => {
        set((state) => ({
            panels: state.panels.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            ),
        }));
    },

    openModal: (panelId) => {
        set({
            isModalOpen: true,
            editingPanelId: panelId || null,
        });
    },

    closeModal: () => {
        set({
            isModalOpen: false,
            editingPanelId: null,
        });
    },

    fetchDataSources: async () => {
        const state = get();
        const now = Date.now();

        // 檢查是否需要重新獲取（快取是否過期）
        if (state.lastFetchTime && (now - state.lastFetchTime) < CACHE_DURATION) {
            return;
        }

        // 先檢查 sessionStorage 是否有緩存
        const cached = sessionStorage.getItem('dashboard_data_sources');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                const cacheTime = sessionStorage.getItem('dashboard_data_sources_time');
                const cacheTimeNum = cacheTime ? parseInt(cacheTime) : 0;

                // 如果快取未過期，使用快取
                if (cacheTimeNum && (now - cacheTimeNum) < CACHE_DURATION) {
                    set({
                        dataSources: data,
                        isLoading: false,
                        lastFetchTime: cacheTimeNum,
                    });
                    return;
                }
            } catch (e) {
                // 解析失敗，繼續從 API 獲取
            }
        }

        set({ isLoading: true });

        // 重試機制：最多重試 3 次，使用指數退避
        const maxRetries = 3;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch('/api/dashboard/data-sources');

                // 如果返回 HTML（MSW 還沒準備好），則重試
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('text/html')) {
                    if (attempt < maxRetries - 1) {
                        const delay = Math.pow(2, attempt) * 100; // 指數退避
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }

                const result = await response.json();

                if (result.success) {
                    // 存入 sessionStorage 並記錄時間
                    sessionStorage.setItem('dashboard_data_sources', JSON.stringify(result.data));
                    sessionStorage.setItem('dashboard_data_sources_time', String(Date.now()));
                    set({
                        dataSources: result.data,
                        isLoading: false,
                        lastFetchTime: Date.now(),
                    });
                    return;
                } else {
                    console.error('獲取數據源失敗:', result.message);
                    set({ isLoading: false });
                    return;
                }
            } catch (error) {
                console.error(`API 呼叫失敗 (嘗試 ${attempt + 1}/${maxRetries}):`, error);

                // 最後一次嘗試失敗才報錯
                if (attempt === maxRetries - 1) {
                    set({ isLoading: false });
                } else {
                    // 指數退避
                    const delay = Math.pow(2, attempt) * 100;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    },

    getDataSource: (id) => {
        return get().dataSources.find((source) => source.id === id);
    },

    clearCache: () => {
        sessionStorage.removeItem('dashboard_data_sources');
        sessionStorage.removeItem('dashboard_data_sources_time');
        set({
            dataSources: [],
            lastFetchTime: null,
        });
    },
}));
