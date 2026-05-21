import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router";
import { Navbar, Sidebar } from "../components/Navbar";
import type { NavItem } from "../components/Navbar";

// 定義導覽項目 - 加入群組分類，參考提供的樣式風格
const navItems: NavItem[] = [
    // OPERATIONS 群組
    {
        path: "/",
        label: "首頁",
        group: "OPERATIONS",
        icon: (
            <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        path: "/customer-profile",
        label: "客戶輪廓",
        group: "OPERATIONS",
        icon: (
            <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
];

// 自定義 Logo - 使用 Chakra UI 樣式與 theme 設計系統
const logo = (
    <Link to="/" style={{ textDecoration: 'none' }}>
        <Flex align="center" gap={2}>
            <Box
                w={8}
                h={8}
                bg="nexus.emerald"
                borderRadius="crisp"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Box color="nexus.obsidian" fontWeight="bold" fontSize="lg">C</Box>
            </Box>
            <Box fontSize="xl" fontWeight="semibold" color="white">CDP</Box>
        </Flex>
    </Link>
);

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex
            minH="100vh"
            bg="nexus.obsidian"
            direction={{ base: "column", md: "row" }}
        >
            {/* 左側導覽列 - 桌面版 */}
            <Sidebar navItems={navItems} logo={logo} title="CDP Template" />

            {/* 主要內容區域 */}
            <Flex
                flex={1}
                direction="column"
                minH="100vh"
            >
                {/* 上方導覽列 */}
                <Navbar navItems={navItems} logo={logo} />

                {/* 主要內容 */}
                <Box
                    as="main"
                    flex={1}
                    px={{ base: 4, md: 8 }}
                    py={{ base: 6, md: 8 }}
                >
                    {children}
                </Box>

                {/* Footer */}
                <Box
                    bg="nexus.obsidian"
                    borderTopWidth="1px"
                    borderColor="whiteAlpha.50"
                    mt="auto"
                >
                    <Box px={{ base: 4, md: 8 }} py={4}>
                        <Box textAlign="center" fontSize="xs" color="slate.500">
                            © 2024 CDP Template. All rights reserved.
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
}

export default MainLayout;
