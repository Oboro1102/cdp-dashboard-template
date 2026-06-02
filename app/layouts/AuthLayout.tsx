import { Box, Flex } from "@chakra-ui/react";
import ThreeBackground from "../components/ThreeBackground";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" minH="100dvh" isolation="isolate" overflow="hidden">
      <ThreeBackground />
      <Flex position="relative" zIndex={1} minH="100dvh" align="center" justify="center" p={4}>
        <Box w="full" maxW="md">
          {children}
        </Box>
      </Flex>
    </Box>
  );
}

export default AuthLayout;
