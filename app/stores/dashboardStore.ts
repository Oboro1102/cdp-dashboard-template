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

    // Actions
    addPanel: (panel?: Omit<DashboardPanel, 'id' | 'createdAt'>) => void;
    removePanel: (id: string) => void;
    updatePanel: (id: string, updates: Partial<DashboardPanel>) => void;
    openModal: (panelId?: string) => void;
    closeModal: () => void;
    fetchDataSources: () => Promise<void>;
    getDataSource: (id: string) => DataSource | undefined;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    panels: [],
    dataSources: [],
    isModalOpen: false,
    editingPanelId: null,
    isLoading: false,

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
        // 先檢查 sessionStorage 是否有緩存
        const cached = sessionStorage.getItem('dashboard_data_sources');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                set({ dataSources: data, isLoading: false });
                return;
            } catch (e) {
                // 解析失敗，繼續從 API 獲取
            }
        }

        set({ isLoading: true });

        // 重試機制：最多重試 3 次，每次間隔 100ms
        const maxRetries = 3;
        const retryDelay = 100;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch('/api/dashboard/data-sources');

                // 如果返回 HTML（MSW 還沒準備好），則重試
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('text/html')) {
                    if (attempt < maxRetries - 1) {
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        continue;
                    }
                }

                const result = await response.json();

                if (result.success) {
                    // 存入 sessionStorage
                    sessionStorage.setItem('dashboard_data_sources', JSON.stringify(result.data));
                    set({ dataSources: result.data, isLoading: false });
                    return;
                } else {
                    console.error('獲取數據源失敗:', result.message);
                    set({ isLoading: false });
                    return;
                }
            } catch (error) {
                // 最後一次嘗試失敗才報錯
                if (attempt === maxRetries - 1) {
                    console.error('API 呼叫失敗:', error);
                    set({ isLoading: false });
                } else {
                    // 等待後重試
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
        }
    },

    getDataSource: (id) => {
        return get().dataSources.find((source) => source.id === id);
    },
}));
