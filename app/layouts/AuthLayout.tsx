import { Box, Flex } from "@chakra-ui/react";
import ThreeBackground from '../components/ThreeBackground';

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative min-h-[100dvh] isolate overflow-hidden'>
            <ThreeBackground />
            <Flex position="relative" zIndex={1} minH="100dvh" align="center" justify="center" p={4}>
                <Box w="full" maxW="md" >
                    {children}
                </Box>
            </Flex>
        </div>
    );
}

export default AuthLayout;
