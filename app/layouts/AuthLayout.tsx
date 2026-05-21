import { Box, Flex } from "@chakra-ui/react";

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex minH="100vh" align="center" justify="center" bg="nexus.obsidian" p={4}>
            <Box w="full" maxW="md">
                {children}
            </Box>
        </Flex>
    );
}

export default AuthLayout;
