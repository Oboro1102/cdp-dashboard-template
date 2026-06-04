import { http, HttpResponse, delay } from 'msw';
import { dashboardDb, type DataSource } from './db';

// 模擬 API 延遲時間（毫秒）
const API_DELAY = 500;

export const dashboardHandlers = [
    // 獲取所有數據源
    http.get('*/api/dashboard/data-sources', async () => {
        await delay(API_DELAY);

        try {
            const dataSources: DataSource[] = dashboardDb.getDataSources();

            return HttpResponse.json({
                success: true,
                message: '獲取數據源成功',
                data: dataSources,
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '獲取數據源失敗' },
                { status: 500 }
            );
        }
    }),

    // 根據 ID 獲取特定數據源
    http.get('*/api/dashboard/data-sources/:id', async ({ params }) => {
        await delay(API_DELAY);

        try {
            const { id } = params;
            const dataSource = dashboardDb.getDataSourceById(id as string);

            if (!dataSource) {
                return HttpResponse.json(
                    { success: false, message: '數據源不存在' },
                    { status: 404 }
                );
            }

            return HttpResponse.json({
                success: true,
                message: '獲取數據源成功',
                data: dataSource,
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '獲取數據源失敗' },
                { status: 500 }
            );
        }
    }),

    // 獲取數據源的數據（可選擇性獲取）
    http.post('*/api/dashboard/data-sources/:id/query', async ({ params, request }) => {
        await delay(API_DELAY);

        try {
            const { id } = params;
            const dataSource = dashboardDb.getDataSourceById(id as string);

            if (!dataSource) {
                return HttpResponse.json(
                    { success: false, message: '數據源不存在' },
                    { status: 404 }
                );
            }

            const body = await request.json() as { fields?: string[] };
            const requestedFields = body.fields || [];

            // 如果指定了欄位，則過濾數據
            let filteredData = dataSource.data;
            if (requestedFields.length > 0) {
                filteredData = dataSource.data.map(record => {
                    const filtered: Record<string, string | number | Date> = {};
                    requestedFields.forEach(field => {
                        if (field in record) {
                            filtered[field] = record[field];
                        }
                    });
                    return filtered;
                });
            }

            return HttpResponse.json({
                success: true,
                message: '查詢數據成功',
                data: {
                    fields: requestedFields.length > 0
                        ? dataSource.fields.filter(f => requestedFields.includes(f.name))
                        : dataSource.fields,
                    data: filteredData,
                },
            });
        } catch (error) {
            return HttpResponse.json(
                { success: false, message: '查詢數據失敗' },
                { status: 500 }
            );
        }
    }),
];
