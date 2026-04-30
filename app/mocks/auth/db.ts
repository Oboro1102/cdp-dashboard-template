// 模擬使用者資料庫 - Auth 模組
export interface MockUser {
    id: string;
    email: string;
    password: string; // 實際專案中應加密，這裡僅模擬
    name: string;
    createdAt: string;
}

// 模擬資料庫
class MockAuthDatabase {
    private users: MockUser[] = [];

    constructor() {
        // 初始化一些測試資料
        this.users = [
            {
                id: '1',
                email: 'test@example.com',
                password: 'password123',
                name: '測試使用者',
                createdAt: new Date().toISOString(),
            },
        ];
    }

    // 尋找使用者 by email
    findUserByEmail(email: string): MockUser | undefined {
        return this.users.find((user) => user.email === email);
    }

    // 建立新使用者
    createUser(userData: Omit<MockUser, 'id' | 'createdAt'>): MockUser {
        const newUser: MockUser = {
            ...userData,
            id: String(this.users.length + 1),
            createdAt: new Date().toISOString(),
        };
        this.users.push(newUser);
        return newUser;
    }

    // 驗證使用者憑證
    validateUser(email: string, password: string): MockUser | null {
        const user = this.findUserByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }
}

// 匯出單例
export const authDb = new MockAuthDatabase();
