import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { Box, Flex, VStack, HStack, Icon, useDisclosure } from "@chakra-ui/react";

export interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    group?: string;
}

interface NavbarProps {
    navItems: NavItem[];
    logo?: React.ReactNode;
    onLogout?: () => void;
    onSettings?: () => void;
    title?: string;
}

// 預設 Logo
const DefaultLogo = () => (
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

// 導覽項目元件 - 手機版
function NavItemMobile({ item, isActive }: { item: NavItem; isActive: boolean }) {
    return (
        <Link to={item.path} style={{ textDecoration: 'none' }}>
            <Box
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="crisp"
                bg={isActive ? "nexus.emeraldAlpha" : "transparent"}
                color={isActive ? "nexus.emerald" : "slate.300"}
                _hover={{ bg: "nexus.slateLight" }}
                cursor="pointer"
            >
                {item.icon}
                <Box fontWeight="medium">{item.label}</Box>
            </Box>
        </Link>
    );
}

// 導覽項目元件 - 桌面版側邊欄
function NavItemSidebar({ item, isActive }: { item: NavItem; isActive: boolean }) {
    return (
        <Link to={item.path} style={{ textDecoration: 'none' }}>
            <Box
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={2.5}
                borderRadius="crisp"
                bg={isActive ? "nexus.emerald" : "transparent"}
                color={isActive ? "white" : "slate.400"}
                fontWeight="medium"
                fontSize="sm"
                boxShadow={isActive ? "emeraldGlow" : "none"}
                _hover={{
                    bg: isActive ? "nexus.emerald" : "nexus.emeraldAlpha",
                    color: isActive ? "white" : "slate.300",
                }}
                cursor="pointer"
            >
                {item.icon}
                <Box>{item.label}</Box>
            </Box>
        </Link>
    );
}

export function Navbar({ navItems, logo, onLogout, onSettings, title }: NavbarProps) {
    const { open, onToggle } = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            logout();
            navigate("/login");
        }
    };

    const handleSettings = () => {
        if (onSettings) {
            onSettings();
        } else {
            navigate("/profile");
        }
    };

    const mobileNavItems = navItems.filter(item => item.path !== "/");
    const logoElement = logo || <DefaultLogo />;

    return (
        <Box bg="nexus.slate" borderBottomWidth="1px" borderColor="whiteAlpha.50">
            <Flex align="center" justify="space-between" h={16} px={4}>
                {/* 手機版漢堡選單和 Logo */}
                <HStack gap={4}>
                    <Box
                        display={{ base: "flex", md: "none" }}
                        as="button"
                        onClick={onToggle}
                        p={2}
                        borderRadius="crisp"
                        color="slate.400"
                        _hover={{ color: "white", bg: "nexus.emeraldAlpha" }}
                        cursor="pointer"
                        aria-label="切換導覽選單"
                    >
                        <Icon boxSize={6}>
                            {open ? (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </Icon>
                    </Box>

                    {/* Logo - 手機版顯示 */}
                    <Box display={{ base: "block", md: "none" }}>
                        {logoElement}
                    </Box>

                    {/* 標題 - 桌面版 */}
                    {title && (
                        <Box
                            display={{ base: "none", md: "block" }}
                            fontSize="lg"
                            fontWeight="semibold"
                            color="white"
                        >
                            {title}
                        </Box>
                    )}
                </HStack>

                {/* 上方導覽列右側 - 個人設定和登出 */}
                <HStack gap={3}>
                    <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        px={3}
                        py={2}
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.400"
                        borderRadius="crisp"
                        _hover={{ color: "white", bg: "nexus.emeraldAlpha" }}
                        cursor="pointer"
                        onClick={handleSettings}
                    >
                        <Icon boxSize={5}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Icon>
                        <Box display={{ base: "none", sm: "inline" }}>個人設定</Box>
                    </Box>

                    <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        px={3}
                        py={2}
                        fontSize="sm"
                        fontWeight="medium"
                        color="red.400"
                        borderRadius="crisp"
                        _hover={{ color: "red.300", bg: "rgba(239, 68, 68, 0.1)" }}
                        cursor="pointer"
                        onClick={handleLogout}
                    >
                        <Icon boxSize={5}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Icon>
                        <Box display={{ base: "none", sm: "inline" }}>登出</Box>
                    </Box>
                </HStack>
            </Flex>

            {/* 手機版摺疊選單 */}
            {open && (
                <Box display={{ base: "block", md: "none" }} borderTopWidth="1px" borderColor="whiteAlpha.50" bg="nexus.slate">
                    <VStack gap={1} align="stretch" px={4} py={3}>
                        {mobileNavItems.map((item) => (
                            <NavItemMobile
                                key={item.path}
                                item={item}
                                isActive={isActive(item.path)}
                            />
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

export function Sidebar({ navItems, logo, title }: NavbarProps) {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    // 按群組分類導覽項目
    const groupedItems = navItems.reduce((groups, item) => {
        const group = item.group || "MAIN";
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {} as Record<string, NavItem[]>);

    const logoElement = logo || <DefaultLogo />;

    return (
        <Box
            display={{ base: "none", md: "flex" }}
            flexDirection="column"
            w={64}
            bg="nexus.slate"
            borderRightWidth="1px"
            borderColor="whiteAlpha.50"
            h="100vh"
            overflowY="auto"
        >
            {/* Logo 區域 */}
            <Flex h={16} align="center" justify="center" borderBottomWidth="1px" borderColor="whiteAlpha.50" px={4}>
                {logoElement}
            </Flex>

            {/* 導覽選單 */}
            <VStack flex={1} gap={8} align="stretch" px={4} py={6} overflowY="auto">
                {Object.entries(groupedItems).map(([group, items]) => (
                    <Box key={group}>
                        <Box
                            px={4}
                            fontSize="10px"
                            fontWeight="bold"
                            color="slate.400"
                            letterSpacing="widest"
                            textTransform="uppercase"
                            mb={2}
                        >
                            {group}
                        </Box>
                        <VStack gap={1} align="stretch">
                            {items.map((item) => (
                                <NavItemSidebar
                                    key={item.path}
                                    item={item}
                                    isActive={isActive(item.path)}
                                />
                            ))}
                        </VStack>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
