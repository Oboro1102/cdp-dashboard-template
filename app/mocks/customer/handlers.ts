import { http, HttpResponse, delay } from 'msw';
import { customerDb, type Customer } from './db';

// 模擬 API 延遲時間（毫秒）
const API_DELAY = 300;

export const customerHandlers = [
    // 取得會員列表 API - 支援分頁和查詢
    http.get('/api/customers', async ({ request }) => {
        await delay(API_DELAY);

        try {
            const url = new URL(request.url);
            const page = parseInt(url.searchParams.get('page') || '1');
            const limit = parseInt(url.searchParams.get('limit') || '10');
            const id = url.searchParams.get('id') || undefined;

            // 驗證分頁參數
            if (page < 1 || limit < 1 || limit > 100) {
                return HttpResponse.json(
                    {
                        success: false,
                        message: '無效的分頁參數，limit 必須在 1-100 之內'
                    },
                    { status: 400 }
                );
            }

            // 驗證 ID 格式（如果是查詢）
            if (id && (typeof id !== 'string' || id.trim().length === 0)) {
                return HttpResponse.json(
                    {
                        success: false,
                        message: '無效的會員 ID'
                    },
                    { status: 400 }
                );
            }

            const result = customerDb.getCustomers({ page, limit, id });

            // 移除購買明細以減少回傳資料量（列表不需要明細）
            const customersWithoutHistory = result.customers.map(customer => {
                const { purchaseHistory, ...customerWithoutHistory } = customer;
                return customerWithoutHistory;
            });

            return HttpResponse.json({
                data: customersWithoutHistory,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit)
            });
        } catch (error) {
            return HttpResponse.json(
                {
                    success: false,
                    message: '請求處理失敗'
                },
                { status: 500 }
            );
        }
    }),

    // 取得單一會員詳細資料 API
    http.get('/api/customers/:id', async ({ params }) => {
        await delay(API_DELAY);

        try {
            const { id } = params;

            // 嚴格驗證 ID
            if (!id || typeof id !== 'string' || id.trim().length === 0) {
                return HttpResponse.json(
                    {
                        success: false,
                        message: '無效的會員 ID'
                    },
                    { status: 400 }
                );
            }

            // 防止 SQL 注入 - 只允許特定格式
            if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
                return HttpResponse.json(
                    {
                        success: false,
                        message: '無效的會員 ID 格式'
                    },
                    { status: 400 }
                );
            }

            const customer = customerDb.getCustomerById(id);

            if (!customer) {
                return HttpResponse.json(
                    {
                        success: false,
                        message: '找不到指定的會員'
                    },
                    { status: 404 }
                );
            }

            return HttpResponse.json({
                success: true,
                message: '成功取得會員詳細資料',
                data: {
                    customer
                }
            });
        } catch (error) {
            return HttpResponse.json(
                {
                    success: false,
                    message: '請求處理失敗'
                },
                { status: 500 }
            );
        }
    })
];
