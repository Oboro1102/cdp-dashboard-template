import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Card, Heading, Text, Input, Button, Alert, VStack, Field } from '@chakra-ui/react';
import { useAuthStore } from '~/stores/authStore';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const { register, isLoading, error, clearError } = useAuthStore();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return;
        }

        try {
            await register(email, password, name);
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
                                建立帳戶
                            </Heading>
                            <Text color="gray.600" fontSize="base">
                                填寫以下資訊以註冊
                            </Text>
                        </Box>

                        {error && (
                            <Alert.Root status="error" borderRadius="md">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>註冊失敗</Alert.Title>
                                    <Alert.Description>{error}</Alert.Description>
                                </Alert.Content>
                                <Button size="sm" ml="auto" variant="ghost" onClick={clearError}>✕</Button>
                            </Alert.Root>
                        )}

                        <form onSubmit={handleRegister}>
                            <VStack gap={6}>
                                <Field.Root required>
                                    <Field.Label>姓名</Field.Label>
                                    <Input
                                        id="name"
                                        placeholder="請輸入姓名"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        size="lg"
                                        disabled={isLoading}
                                    />
                                </Field.Root>

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
                                        placeholder="請輸入密碼（至少 6 個字元）"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        size="lg"
                                        disabled={isLoading}
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>確認密碼</Field.Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="請再次輸入密碼"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    {isLoading ? '註冊中...' : '註冊'}
                                </Button>
                            </VStack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="gray.600" mt={6}>
                            已經有帳戶？{' '}
                            <Link
                                to="/login"
                                style={{ color: '#2563eb', fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1e40af')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
                            >
                                立即登入
                            </Link>
                        </Text>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
