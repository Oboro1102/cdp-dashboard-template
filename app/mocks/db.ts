// 主資料庫檔案 - 匯出所有模組的資料庫
export { authDb, type MockUser } from './auth/db';
export { customerDb, type Customer, type PurchaseRecord, type PurchaseItem } from './customer/db';

// 未來可以在這裡匯出其他模組的資料庫
// 例如：export { userDb } from './user/db';
