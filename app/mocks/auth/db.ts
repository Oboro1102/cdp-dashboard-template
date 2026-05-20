// 模擬使用者資料庫 - Auth 模組
export interface MockUser {
    id: string;
    email: string;
    // 密碼已使用 bcrypt 哈希處理（模擬）
    password: string;
    name: string;
    createdAt: string;
}

// 模擬資料庫
// 密碼處理工具（模擬 bcrypt）
const passwordHasher = {
    hash: (password: string): string => {
        // 模擬 bcrypt 哈希 - 使用固定 salt
        return btoa(password + '_hashed_password');
    },
    verify: (plainPassword: string, hashedPassword: string): boolean => {
        // 模擬 bcrypt 驗證 - 使用相同的 salt
        return btoa(plainPassword + '_hashed_password') === hashedPassword;
    }
};

class MockAuthDatabase {
    private users: MockUser[] = [];

    constructor() {
        // 初始化測試資料 - 密碼已經過哈希處理
        const hashedPassword = passwordHasher.hash('password123');
        this.users = [
            {
                id: '1',
                email: 'test@example.com',
                password: hashedPassword,
                name: '測試使用者',
                createdAt: new Date().toISOString(),
            },
        ];
    }

    // 尋找使用者 by email
    findUserByEmail(email: string): MockUser | undefined {
        return this.users.find((user) => user.email === email);
    }

    // 建立新使用者 - 密碼自動哈希
    createUser(userData: Omit<MockUser, 'id' | 'createdAt'>): MockUser {
        const newUser: MockUser = {
            ...userData,
            password: passwordHasher.hash(userData.password),
            id: String(this.users.length + 1),
            createdAt: new Date().toISOString(),
        };
        this.users.push(newUser);
        return newUser;
    }

    // 驗證使用者憑證 - 使用哈希驗證
    validateUser(email: string, password: string): MockUser | null {
        const user = this.findUserByEmail(email);
        if (user && passwordHasher.verify(password, user.password)) {
            return user;
        }
        return null;
    }
}

// 匯出單例
export const authDb = new MockAuthDatabase();
export { passwordHasher };
