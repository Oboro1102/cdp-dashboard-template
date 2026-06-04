import { Box, Flex, Text } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";

const currentYear = new Date().getFullYear();

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100dvh" bg="nexus.bg0" direction="column">
      <Navbar />
      <Box as="main" flex={1} px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
        <Box maxW="1440px" mx="auto" w="full">
          {children}
        </Box>
      </Box>
      <Box bg="nexus.bg0" borderTopWidth="1px" borderColor="nexus.lineSoft" mt="auto">
        <Box px={{ base: 4, md: 8 }} py={2.5}>
          <Text textAlign="center" fontSize="xs" color="nexus.textDim">
            &copy; 2026{currentYear > 2026 ? ` - ${currentYear}` : null} Design & Coding by ツキノリュウ with Codex.
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}

export default MainLayout;
