import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Card, Heading, Text, Input, Button, Alert, VStack, Field } from '@chakra-ui/react';
import { useAuthStore } from '~/stores/authStore';

export default function LoginPage() {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');
    const navigate = useNavigate();

    const { login, isLoading, error, clearError } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            // 錯誤已經在 store 中處理
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" p={4}>
            <Card.Root maxW="md" w="full" boxShadow="2xl">
                <Card.Body p={8}>
                    <VStack gap={6} align="stretch">
                        <Box textAlign="center" mb={4}>
                            <Heading size="lg" mb={2}>
                                歡迎回來
                            </Heading>
                            <Text color="gray.600" fontSize="base">
                                登入您的帳戶以繼續
                            </Text>
                        </Box>

                        {error && (
                            <Alert.Root status="error" borderRadius="md">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>登入失敗</Alert.Title>
                                    <Alert.Description>{error}</Alert.Description>
                                </Alert.Content>
                                <Button size="sm" ml="auto" variant="ghost" onClick={clearError}>✕</Button>
                            </Alert.Root>
                        )}

                        <form onSubmit={handleLogin}>
                            <VStack gap={6}>
                                <Field.Root required>
                                    <Field.Label>電子郵件</Field.Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="請輸入電子郵件"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                        disabled={isLoading}
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>密碼</Field.Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="請輸入密碼"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        size="lg"
                                        disabled={isLoading}
                                    />
                                </Field.Root>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    w="full"
                                    h="12"
                                    fontSize="base"
                                    fontWeight="medium"
                                    loading={isLoading}
                                >
                                    {isLoading ? '登入中...' : '登入'}
                                </Button>
                            </VStack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="gray.600" mt={6}>
                            還沒有帳戶？{' '}
                            <Link
                                to="/register"
                                style={{ color: '#2563eb', fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1e40af')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
                            >
                                立即註冊
                            </Link>
                            {' | '}
                            <Link
                                to="/forgot-password"
                                style={{ color: '#2563eb', fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1e40af')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
                            >
                                忘記密碼
                            </Link>
                        </Text>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
