import { http, HttpResponse, delay } from 'msw';
import { authDb, passwordHasher, type MockUser } from './db';

// 模擬 API 延遲時間（毫秒）
const API_DELAY = 500;

// 產生 JWT 風格的 token（僅模擬）
function generateMockToken(user: MockUser): string {
    return btoa(
        JSON.stringify({
            userId: user.id,
            email: user.email,
            exp: Date.now() + 24 * 60 * 60 * 1000, // 24小時後過期
        })
    );
}

// 安全的 token 驗證
function validateToken(token: string): { userId: string; email: string; exp: number } | null {
    try {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp < Date.now()) {
            return null; // token 過期
        }
        return decoded;
    } catch {
        return null; // 無效的 token
    }
}

export const authHandlers = [
    // 登入 API
    http.post('*/api/auth/login', async ({ request }) => {
        await delay(API_DELAY);

        try {
            const { email, password } = (await request.json()) as {
                email: string;
                password: string;
            };

            // 驗證必填欄位
            if (!email || !password) {
                return HttpResponse.json(
                    { success: false, message: '電子郵件和密碼為必填欄位' },
                    { status: 400 }
                );
            }

            // 驗證電子郵件格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return HttpResponse.json(
                    { success: false, message: '電子郵件格式不正確' },
                    { status: 400 }
                );
            }

            // 驗證密碼長度
            if (password.length < 6) {
                return HttpResponse.json(
                    { success: false, message: '密碼長度至少需 6 個字元' },
                    { status: 400 }
                );
            }

            // 驗證使用者憑證
            const user = authDb.validateUser(email, password);

            if (!user) {
                return HttpResponse.json(
                    { success: false, message: '電子郵件或密碼錯誤' },
                    { status: 401 }
                );
            }

            // 產生 token
            const token = generateMockToken(user);

            // 回傳使用者資訊（不包含密碼）
            const { password: _, ...userWithoutPassword } = user;

            return HttpResponse.json({
                success: true,
                message: '登入成功',
                data: {
                    user: userWithoutPassword,
                    token,
                },
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '請求格式錯誤' },
                { status: 400 }
            );
        }
    }),

    // 註冊 API
    http.post('*/api/auth/register', async ({ request }) => {
        await delay(API_DELAY);

        try {
            const { email, password, name } = (await request.json()) as {
                email: string;
                password: string;
                name: string;
            };

            // 驗證必填欄位
            if (!email || !password || !name) {
                return HttpResponse.json(
                    { success: false, message: '所有欄位均為必填' },
                    { status: 400 }
                );
            }

            // 驗證電子郵件格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return HttpResponse.json(
                    { success: false, message: '電子郵件格式不正確' },
                    { status: 400 }
                );
            }

            // 驗證密碼長度
            if (password.length < 6) {
                return HttpResponse.json(
                    { success: false, message: '密碼長度至少需 6 個字元' },
                    { status: 400 }
                );
            }

            // 檢查電子郵件是否已存在
            const existingUser = authDb.findUserByEmail(email);
            if (existingUser) {
                return HttpResponse.json(
                    { success: false, message: '此電子郵件已被註冊' },
                    { status: 409 }
                );
            }

            // 建立新使用者
            const newUser = authDb.createUser({ email, password, name });

            // 產生 token
            const token = generateMockToken(newUser);

            // 回傳使用者資訊（不包含密碼）
            const { password: _, ...userWithoutPassword } = newUser;

            return HttpResponse.json({
                success: true,
                message: '註冊成功',
                data: {
                    user: userWithoutPassword,
                    token,
                },
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '請求格式錯誤' },
                { status: 400 }
            );
        }
    }),

    // 驗證電子郵件 API
    http.post('*/api/auth/verify-email', async ({ request }) => {
        await delay(API_DELAY);

        try {
            const { email } = (await request.json()) as { email: string };

            // 驗證必填欄位
            if (!email) {
                return HttpResponse.json(
                    { success: false, message: '電子郵件為必填欄位' },
                    { status: 400 }
                );
            }

            // 檢查電子郵件是否存在
            const user = authDb.findUserByEmail(email);

            if (!user) {
                return HttpResponse.json(
                    { success: false, message: '帳號不存在' },
                    { status: 404 }
                );
            }

            return HttpResponse.json({
                success: true,
                message: '帳號存在',
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '請求格式錯誤' },
                { status: 400 }
            );
        }
    }),

    // 重設密碼 API
    http.post('*/api/auth/reset-password', async ({ request }) => {
        await delay(API_DELAY);

        try {
            const { email, newPassword } = (await request.json()) as {
                email: string;
                newPassword: string;
            };

            // 驗證必填欄位
            if (!email || !newPassword) {
                return HttpResponse.json(
                    { success: false, message: '所有欄位均為必填' },
                    { status: 400 }
                );
            }

            // 驗證密碼長度
            if (newPassword.length < 6) {
                return HttpResponse.json(
                    { success: false, message: '密碼長度至少需 6 個字元' },
                    { status: 400 }
                );
            }

            // 檢查電子郵件是否存在
            const user = authDb.findUserByEmail(email);

            if (!user) {
                return HttpResponse.json(
                    { success: false, message: '帳號不存在' },
                    { status: 404 }
                );
            }

            // 更新密碼（使用哈希處理）
            user.password = passwordHasher.hash(newPassword);

            return HttpResponse.json({
                success: true,
                message: '密碼重設成功',
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '請求格式錯誤' },
                { status: 400 }
            );
        }
    }),

    // 驗證 token API（可選，用於檢查登入狀態）
    http.get('*/api/auth/me', async ({ request }) => {
        await delay(API_DELAY);

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
                { success: false, message: '未提供認證 token' },
                { status: 401 }
            );
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = validateToken(token);

            if (!decoded) {
                return HttpResponse.json(
                    { success: false, message: '認證已過期或無效' },
                    { status: 401 }
                );
            }

            // 查找使用者
            const user = authDb.findUserByEmail(decoded.email);
            if (!user) {
                return HttpResponse.json(
                    { success: false, message: '使用者不存在' },
                    { status: 404 }
                );
            }

            // 回傳使用者資訊（不包含密碼）
            const { password: _, ...userWithoutPassword } = user;

            return HttpResponse.json({
                success: true,
                data: {
                    user: userWithoutPassword,
                },
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '無效的認證 token' },
                { status: 401 }
            );
        }
    }),

    // 更新個人資料 API
    http.post('*/api/auth/update-profile', async ({ request }) => {
        await delay(API_DELAY);

        try {
            const { currentPassword, name, email, newPassword } = (await request.json()) as {
                currentPassword?: string;
                name?: string;
                email?: string;
                newPassword?: string;
            };

            // 檢查 Authorization 標頭
            const authHeader = request.headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return HttpResponse.json(
                    { success: false, message: '未提供認證 token' },
                    { status: 401 }
                );
            }

            const token = authHeader.split(' ')[1];
            const decoded = validateToken(token);

            if (!decoded) {
                return HttpResponse.json(
                    { success: false, message: '認證已過期' },
                    { status: 401 }
                );
            }

            // 查找使用者
            const user = authDb.findUserByEmail(decoded.email);
            if (!user) {
                return HttpResponse.json(
                    { success: false, message: '使用者不存在' },
                    { status: 404 }
                );
            }

            // 驗證目前密碼（如果提供了）
            if (currentPassword && !authDb.validateUser(user.email, currentPassword)) {
                return HttpResponse.json(
                    { success: false, message: '目前密碼錯誤' },
                    { status: 401 }
                );
            }

            // 更新名稱（如果提供了）
            if (name && name !== user.name) {
                user.name = name;
            }

            // 更新電子郵件（如果提供了）
            if (email && email !== user.email) {
                // 驗證電子郵件格式
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return HttpResponse.json(
                        { success: false, message: '電子郵件格式不正確' },
                        { status: 400 }
                    );
                }

                // 檢查電子郵件是否已被使用
                const existingUser = authDb.findUserByEmail(email);
                if (existingUser) {
                    return HttpResponse.json(
                        { success: false, message: '此電子郵件已被使用' },
                        { status: 409 }
                    );
                }
                user.email = email;
            }

            // 更新密碼（如果提供了）
            if (newPassword) {
                // 驗證密碼長度
                if (newPassword.length < 6) {
                    return HttpResponse.json(
                        { success: false, message: '密碼長度至少需 6 個字元' },
                        { status: 400 }
                    );
                }
                user.password = passwordHasher.hash(newPassword);
            }

            // 回傳更新後的使用者資訊
            const { password: _, ...userWithoutPassword } = user;

            return HttpResponse.json({
                success: true,
                message: '個人資料已更新',
                data: {
                    user: userWithoutPassword,
                },
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '更新失敗，請稍後再試' },
                { status: 500 }
            );
        }
    }),
];
