import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 建立 MSW worker 實例
export const worker = setupWorker(...handlers);
