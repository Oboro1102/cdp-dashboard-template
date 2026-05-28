import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router";
import { Navbar, type NavItem } from "../components/Navbar";
import { brand } from "../chakraTheme";

const navItems: NavItem[] = [
  {
    path: "/",
    label: "總覽",
  },
  {
    path: "/customer-profile",
    label: "客戶資料",
  },
];

const currentYear = new Date().getFullYear();

const logo = (
  <Link to="/" style={{ textDecoration: "none" }}>
    <Flex align="center" gap={2}>
      <Box
        w={8}
        h={8}
        bg={`linear-gradient(135deg, ${brand.colors.amberDeep} 0%, ${brand.colors.amber} 55%, ${brand.colors.amberLight} 100%)`}
        borderRadius="panel"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="amberGlow"
      >
        <Box color="nexus.bg0" fontWeight="bold" fontSize="lg">
          C
        </Box>
      </Box>
      <Box>
        <Box fontSize="xl" fontWeight="semibold" color="nexus.text" lineHeight="1">
          CDP
        </Box>
        <Box fontSize="xs" color="nexus.textDim" letterSpacing="0.16em" textTransform="uppercase">
          Aurum Night
        </Box>
      </Box>
    </Flex>
  </Link>
);

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100dvh" bg="nexus.bg0" direction="column">
      <Navbar navItems={navItems} logo={logo} />

      <Box as="main" flex={1} px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
        <Box maxW="1440px" mx="auto" w="full">
          {children}
        </Box>
      </Box>

      <Box bg="nexus.bg0" borderTopWidth="1px" borderColor="nexus.lineSoft" mt="auto">
        <Box px={{ base: 4, md: 8 }} py={4}>
          <Box
            maxW="1440px"
            mx="auto"
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
            flexWrap="wrap"
          >
            <Text textAlign="center" fontSize="xs" color="nexus.textDim">
              &copy; 2026{currentYear > 2026 ? ` - ${currentYear}` : null} Aurum Night
            </Text>
            <Text fontSize="xs" color="nexus.textDim">
              深色資料工作台
            </Text>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default MainLayout;
