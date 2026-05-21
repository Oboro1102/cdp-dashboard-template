import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 自定義 sessionStorage 適配器
const sessionStorageAdapter = {
    getItem: (name: string) => {
        const value = sessionStorage.getItem(name);
        return value ? { state: JSON.parse(value) } : null;
    },
    setItem: (name: string, value: any) => {
        sessionStorage.setItem(name, JSON.stringify(value.state));
    },
    removeItem: (name: string) => {
        sessionStorage.removeItem(name);
    },
};

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    membershipLevel?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // 動作
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    resetPassword: (email: string, newPassword: string) => Promise<void>;
    verifyEmail: (email: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    checkAuth: () => void;
    updateUserProfile: (updates: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || '登入失敗');
                    }

                    const { user, token } = result.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    // persist middleware會自動處理 sessionStorage
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || '登入失敗，請稍後再試',
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    });
                    throw error;
                }
            },

            register: async (email: string, password: string, name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password, name }),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || '註冊失敗');
                    }

                    const { user, token } = result.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    // persist middleware會自動處理 sessionStorage
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || '註冊失敗，請稍後再試',
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    });
                    throw error;
                }
            },

            verifyEmail: async (email: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/auth/verify-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || '帳號不存在');
                    }

                    set({ isLoading: false, error: null });
                    return true;
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || '驗證失敗，請稍後再試',
                    });
                    return false;
                }
            },

            resetPassword: async (email: string, newPassword: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/auth/reset-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, newPassword }),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || '重設密碼失敗');
                    }

                    set({ isLoading: false, error: null });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || '重設密碼失敗，請稍後再試',
                    });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });

                // persist middleware 會自動清除 sessionStorage
            },

            clearError: () => {
                set({ error: null });
            },

            checkAuth: () => {
                const state = get();
                const token = state.token;
                const isAuthenticated = !!token;

                set({ token, isAuthenticated });

                // 如果有 token，可以選擇性驗證 token 是否有效
                if (token) {
                    fetch('/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            if (result.success) {
                                set({ user: result.data.user });
                            } else {
                                // token 無效，清除狀態
                                get().logout();
                            }
                        })
                        .catch(() => {
                            // 網路錯誤或其他問題，保持當前狀態
                        });
                }
            },

            updateUserProfile: async (updates) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/auth/update-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${get().token}`,
                        },
                        body: JSON.stringify(updates),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || '更新失敗');
                    }

                    // 更新 store 中的 user 資料
                    set((state) => ({
                        user: {
                            ...state.user,
                            ...updates,
                        },
                        isLoading: false,
                        error: null,
                    }));
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.message || '更新失敗，請稍後再試',
                    });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage', // sessionStorage 的 key
            storage: sessionStorageAdapter, // 使用 sessionStorage 而不是 localStorage
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }), // 只持久化這些欄位
        }
    )
);
