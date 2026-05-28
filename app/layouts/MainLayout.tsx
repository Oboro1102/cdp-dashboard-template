import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import type { NavItem } from "../components/Navbar";

const navItems: NavItem[] = [
    {
        path: "/",
        label: "首頁",
        icon: (
            <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        path: "/customer-profile",
        label: "客戶資料",
        icon: (
            <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
];

const currentYear = new Date().getFullYear();

const logo = (
    <Link to="/" style={{ textDecoration: "none" }}>
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
                <Box color="nexus.obsidian" fontWeight="bold" fontSize="lg">
                    C
                </Box>
            </Box>
            <Box fontSize="xl" fontWeight="semibold" color="white">
                CDP
            </Box>
        </Flex>
    </Link>
);

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex minH="100vh" bg="nexus.obsidian" direction="column">
            <Navbar navItems={navItems} logo={logo} />

            <Box as="main" flex={1} px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
                {children}
            </Box>

            <Box bg="nexus.obsidian" borderTopWidth="1px" borderColor="whiteAlpha.50" mt="auto">
                <Box px={{ base: 4, md: 8 }} py={4}>
                    <Box textAlign="center" fontSize="xs" color="slate.500">
                        &copy; 2026{currentYear > 2026 ? ` - ${currentYear}` : null} CDP Template.
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
}

export default MainLayout;
