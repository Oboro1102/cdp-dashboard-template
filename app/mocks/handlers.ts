// 主 handlers 檔案 - 合併所有模組的 handlers
import { authHandlers } from './auth/handlers';
import { dashboardHandlers } from './dashboard/handlers';
import { customerHandlers } from './customer/handlers';

// 合併所有模組的 handlers
export const handlers = [
    ...authHandlers,
    ...dashboardHandlers,
    ...customerHandlers,
];
