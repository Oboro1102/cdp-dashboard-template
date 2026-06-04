import { create } from "zustand";

export interface DataField {
    name: string;
    type: "string" | "number" | "date";
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
    type: "bar" | "pie";
    xAxis?: string;
    yAxis?: string;
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
    addPanel: (panel?: Omit<DashboardPanel, "id" | "createdAt">) => void;
    removePanel: (id: string) => void;
    updatePanel: (id: string, updates: Partial<DashboardPanel>) => void;
    openModal: (panelId?: string) => void;
    closeModal: () => void;
    fetchDataSources: () => Promise<void>;
    getDataSource: (id: string) => DataSource | undefined;
    clearCache: () => void;
}

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
            name: panel?.name || "新面板",
            dataSourceId: panel?.dataSourceId || "",
            chartConfig: panel?.chartConfig || { type: "bar" },
            createdAt: Date.now(),
        };

        set((state) => ({
            panels: [...state.panels, newPanel],
        }));
    },

    removePanel: (id) => {
        set((state) => ({
            panels: state.panels.filter((panel) => panel.id !== id),
        }));
    },

    updatePanel: (id, updates) => {
        set((state) => ({
            panels: state.panels.map((panel) => (panel.id === id ? { ...panel, ...updates } : panel)),
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

        if (state.lastFetchTime && now - state.lastFetchTime < CACHE_DURATION) {
            return;
        }

        const cached = sessionStorage.getItem("dashboard_data_sources");
        if (cached) {
            try {
                const data = JSON.parse(cached);
                const cacheTime = sessionStorage.getItem("dashboard_data_sources_time");
                const cacheTimeNum = cacheTime ? parseInt(cacheTime, 10) : 0;

                if (cacheTimeNum && now - cacheTimeNum < CACHE_DURATION) {
                    set({
                        dataSources: data,
                        isLoading: false,
                        lastFetchTime: cacheTimeNum,
                    });
                    return;
                }
            } catch {
                // Ignore malformed cache and fall through to the network request.
            }
        }

        set({ isLoading: true });

        const maxRetries = 3;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch("*/api/dashboard/data-sources");
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("text/html")) {
                    if (attempt < maxRetries - 1) {
                        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
                        continue;
                    }
                }

                const result = await response.json();

                if (result.success) {
                    sessionStorage.setItem("dashboard_data_sources", JSON.stringify(result.data));
                    sessionStorage.setItem("dashboard_data_sources_time", String(Date.now()));
                    set({
                        dataSources: result.data,
                        isLoading: false,
                        lastFetchTime: Date.now(),
                    });
                    return;
                }

                set({ isLoading: false });
                return;
            } catch {
                if (attempt === maxRetries - 1) {
                    set({ isLoading: false });
                } else {
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }
    },

    getDataSource: (id) => {
        return get().dataSources.find((source) => source.id === id);
    },

    clearCache: () => {
        sessionStorage.removeItem("dashboard_data_sources");
        sessionStorage.removeItem("dashboard_data_sources_time");
        set({
            dataSources: [],
            lastFetchTime: null,
        });
    },
}));
