import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export default function CustomerProfile() {
    return (
        <ChakraProvider value={defaultSystem}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">客戶輪廓</h1>
                    <p className="mt-2 text-gray-600">管理您的客戶資訊和輪廓設定</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">客戶輪廓功能開發中</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            此頁面將提供客戶資訊管理、分群設定和輪廓分析功能。
                        </p>
                    </div>
                </div>
            </div>
        </ChakraProvider>
    );
}
