import { Link, useLocation, useNavigate } from "react-router";
import { Box, Button, Drawer, Flex, HStack, Popover, VStack, useDisclosure } from "@chakra-ui/react";
import { useAuthStore } from "../stores/authStore";

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  group?: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  onLogout?: () => void;
  onSettings?: () => void;
}

const navItems: NavItem[] = [
  {
    path: "/",
    label: "數據總覽",
  },
  {
    path: "/customer-profile",
    label: "客戶資料",
  },
];

const DefaultLogo = () => (
  <Link to="/" style={{ textDecoration: "none" }}>
    <Box fontSize="sm" fontWeight="bold" color="nexus.text">
      CDP PLATFORM
    </Box>
  </Link>
);

function getInitial(name?: string | null) {
  const value = name?.trim();
  if (!value) return "U";
  return Array.from(value)[0]?.toLocaleUpperCase() ?? "U";
}

function NavItemLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link to={item.path} style={{ textDecoration: "none" }} onClick={onClick}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
        py={1}
        borderRadius="pill"
        bg={isActive ? "nexus.amberAlpha" : "transparent"}
        color={isActive ? "nexus.text" : "nexus.textMuted"}
        fontWeight="medium"
        fontSize="sm"
        borderWidth="1px"
        borderColor={isActive ? "nexus.amber" : "transparent"}
        boxShadow={isActive ? "amberHalo" : "none"}
        _hover={{
          bg: "nexus.amberAlpha",
          color: "nexus.text",
          borderColor: "nexus.amber",
        }}
        cursor="pointer"
        whiteSpace="nowrap"
        transition="all 220ms cubic-bezier(0.16, 1, 0.3, 1)"
      >
        {item.label}
      </Box>
    </Link>
  );
}

function UserPopover({
  displayName,
  onSettings,
  onLogout,
}: {
  displayName: string;
  onSettings: () => void;
  onLogout: () => void;
}) {
  const initial = getInitial(displayName);

  return (
    <Popover.Root positioning={{ placement: "bottom-end", gutter: 10 }}>
      <Popover.Trigger asChild>
        <Button
          aria-label={`使用者選單：${displayName}`}
          borderRadius="pill"
          w={9}
          h={9}
          px={0}
          minW={9}
          bg="nexus.amberAlpha"
          color="nexus.text"
          borderWidth="1px"
          borderColor="nexus.amber"
          boxShadow="amberHalo"
          fontWeight="bold"
          _hover={{ bg: "nexus.amber", color: "nexus.bg0" }}
          _expanded={{ bg: "nexus.amber", color: "nexus.bg0" }}
        >
          {initial}
        </Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content
          bg="nexus.surfaceElevated"
          borderColor="nexus.lineSoft"
          boxShadow="panelSoft"
          borderRadius="panel"
          w="125px"
        >
          <Popover.Body p={3}>
            <VStack align="stretch">
              <Popover.CloseTrigger asChild>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color="nexus.text"
                  _hover={{ bg: "nexus.amberAlpha", color: "nexus.amberLight" }}
                  onClick={onSettings}
                >
                  個人設定
                </Button>
              </Popover.CloseTrigger>
              <Popover.CloseTrigger asChild>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color="red.300"
                  _hover={{ bg: "nexus.dangerHoverStrong", color: "red.200" }}
                  onClick={onLogout}
                >
                  登出
                </Button>
              </Popover.CloseTrigger>
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}

export function Navbar({ logo, onLogout, onSettings }: NavbarProps) {
  const { open, onToggle, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path: string) => location.pathname === path;
  const logoElement = logo || <DefaultLogo />;
  const displayName = user?.name?.trim() || user?.email?.trim() || "使用者";

  const handleDrawerOpenChange = (details: { open: boolean }) => {
    if (details.open) {
      onOpen();
      return;
    }

    onClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
      return;
    }

    navigate("/profile");
  };

  return (
    <Box position="sticky" top={0} zIndex={20} >
      <Box py={3} px={4}
        bg="nexus.glass"
        borderBottomWidth="1px"
        borderColor="nexus.lineSoft"
        boxShadow="panelSoft"
        backdropFilter="blur(18px)"
      >
        <Flex maxW='1440px' mx='auto' align="center" justify="space-between" gap={4}>
          <HStack gap={3} flexShrink={0}>
            <Button
              display={{ base: "flex", md: "none" }}
              variant="ghost"
              onClick={onToggle}
              p={2}
              borderRadius="pill"
              color="nexus.textMuted"
              _hover={{ color: "nexus.text", bg: "nexus.amberAlpha" }}
              cursor="pointer"
              aria-label={open ? "關閉選單" : "開啟選單"}
            >
              <Box fontSize="xl" lineHeight="1">
                {open ? "×" : "≡"}
              </Box>
            </Button>

            {logoElement}
          </HStack>

          <HStack flex={1} justify="center" gap={3} display={{ base: "none", md: "flex" }} overflowX="auto">
            {navItems.map((item) => (
              <NavItemLink key={item.path} item={item} isActive={isActive(item.path)} />
            ))}
          </HStack>

          <Box flexShrink={0}>
            <UserPopover displayName={displayName} onSettings={handleSettings} onLogout={handleLogout} />
          </Box>
        </Flex>
      </Box>

      <Drawer.Root open={open} onOpenChange={handleDrawerOpenChange} placement="start">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            bg="nexus.surfaceElevated"
            borderRightWidth="1px"
            borderColor="nexus.lineSoft"
            boxShadow="panel"
          >
            <Drawer.Header borderBottomWidth="1px" borderColor="nexus.lineSoft" px={4} py={4}>
              <Flex align="center" justify="space-between">
                {logoElement}
                <Drawer.CloseTrigger asChild>
                  <Button variant="ghost" size="sm" color="nexus.textMuted" _hover={{ color: "nexus.text", bg: "nexus.amberAlpha" }}>
                    關閉
                  </Button>
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>

            <Drawer.Body px={4} py={6}>
              <VStack gap={3} align="stretch">
                {navItems.map((item) => (
                  <NavItemLink key={item.path} item={item} isActive={isActive(item.path)} onClick={onClose} />
                ))}
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Box>
  );
}
