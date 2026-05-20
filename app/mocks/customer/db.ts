// 模擬會員資料庫 - Customer 模組
export interface Customer {
    id: string;
    email: string;
    phone: string;
    registrationTime: string; // 註冊時間
    birthday: string; // 生日
    membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum'; // 會員等級
    fbId: string | null; // FB ID
    lineId: string | null; // Line ID
    cookieId: string; // Cookie ID
    clvValue: number; // CLV 價值 (Customer Lifetime Value)
    activityScore: number; // 活躍度 (0-100)
    revenueContribution: number; // 營收貢獻
    lastPurchaseTime: string | null; // 最後一次購買時間
    purchaseHistory: PurchaseRecord[]; // 購買明細
}

export interface PurchaseRecord {
    id: string;
    orderId: string;
    purchaseDate: string;
    amount: number;
    items: PurchaseItem[];
    status: 'completed' | 'pending' | 'cancelled';
}

export interface PurchaseItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

// 模擬資料庫
class MockCustomerDatabase {
    private customers: Customer[] = [];

    constructor() {
        this.initializeMockData();
    }

    // 初始化 50 位模擬會員資料
    private initializeMockData(): void {
        const membershipLevels: Customer['membershipLevel'][] = ['bronze', 'silver', 'gold', 'platinum'];
        const statuses: PurchaseRecord['status'][] = ['completed', 'pending', 'cancelled'];
        const productNames = [
            '無線藍牙耳機', '智慧手錶', '筆記型電腦', '手機保護殼', 'USB-C 充電線',
            '機械鍵盤', '無線滑鼠', '4K 螢幕', '行動電源', '平板電腦',
            '智慧音箱', '數位相機', '遊戲主機', '藍牙喇叭', '電競椅'
        ];

        for (let i = 1; i <= 50; i++) {
            const registrationDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const lastPurchaseDate = Math.random() > 0.3
                ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
                : null;

            const purchaseCount = Math.floor(Math.random() * 10) + 1;
            const purchaseHistory: PurchaseRecord[] = [];
            let totalRevenue = 0;

            for (let j = 0; j < purchaseCount; j++) {
                const itemCount = Math.floor(Math.random() * 5) + 1;
                const items: PurchaseItem[] = [];
                let orderAmount = 0;

                for (let k = 0; k < itemCount; k++) {
                    const productName = productNames[Math.floor(Math.random() * productNames.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    const price = Math.floor(Math.random() * 5000) + 100;
                    orderAmount += quantity * price;

                    items.push({
                        productId: `prod-${Math.floor(Math.random() * 1000)}`,
                        productName,
                        quantity,
                        price
                    });
                }

                totalRevenue += orderAmount;

                purchaseHistory.push({
                    id: `purchase-${i}-${j}`,
                    orderId: `ORD-${String(i).padStart(4, '0')}-${String(j).padStart(3, '0')}`,
                    purchaseDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
                    amount: orderAmount,
                    items,
                    status: statuses[Math.floor(Math.random() * statuses.length)]
                });
            }

            this.customers.push({
                id: String(i),
                email: `customer${i}@example.com`,
                phone: `09${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
                registrationTime: registrationDate.toISOString(),
                birthday: `199${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                membershipLevel: membershipLevels[Math.floor(Math.random() * membershipLevels.length)],
                fbId: Math.random() > 0.5 ? `fb_${Math.random().toString(36).substring(2, 15)}` : null,
                lineId: Math.random() > 0.5 ? `line_${Math.random().toString(36).substring(2, 15)}` : null,
                cookieId: `cookie_${Math.random().toString(36).substring(2, 20)}`,
                clvValue: Math.floor(Math.random() * 50000) + 1000,
                activityScore: Math.floor(Math.random() * 100),
                revenueContribution: totalRevenue,
                lastPurchaseTime: lastPurchaseDate?.toISOString() || null,
                purchaseHistory
            });
        }
    }

    // 取得所有會員（支援分頁和查詢）
    getCustomers(options?: {
        page?: number;
        limit?: number;
        id?: string;
    }): { customers: Customer[]; total: number; page: number; limit: number } {
        let filteredCustomers = [...this.customers];

        // 如果指定 ID，只返回該會員
        if (options?.id) {
            filteredCustomers = filteredCustomers.filter(c => c.id === options.id);
        }

        const total = filteredCustomers.length;
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const customers = filteredCustomers.slice(startIndex, endIndex);

        return {
            customers,
            total,
            page,
            limit
        };
    }

    // 根據 ID 取得單一會員
    getCustomerById(id: string): Customer | undefined {
        return this.customers.find(c => c.id === id);
    }
}

// 匯出單例
export const customerDb = new MockCustomerDatabase();
