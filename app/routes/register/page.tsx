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
            <Card.Root maxW="md" w="full" boxShadow="cyberGlow">
                <Card.Body p={8}>
                    <VStack gap={6} align="stretch">
                        <Box textAlign="center" mb={4}>
                            <Heading size="lg" mb={2} color="white">
                                建立帳戶
                            </Heading>
                            <Text color="slate.400" fontSize="base">
                                填寫以下資訊以註冊
                            </Text>
                        </Box>

                        {error && (
                            <Alert.Root status="error" borderRadius="crisp">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>註冊失敗</Alert.Title>
                                    <Alert.Description>{error}</Alert.Description>
                                </Alert.Content>
                                <Button size="sm" ml="auto" variant="ghost" color="slate.400" _hover={{ color: "white" }} onClick={clearError}>✕</Button>
                            </Alert.Root>
                        )}

                        <form onSubmit={handleRegister}>
                            <VStack gap={6}>
                                <Field.Root required>
                                    <Field.Label color="slate.300">姓名</Field.Label>
                                    <Input
                                        id="name"
                                        placeholder="請輸入姓名"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        size="lg"
                                        borderRadius="crisp"
                                        borderColor="whiteAlpha.200"
                                        bg="nexus.obsidian"
                                        color="white"
                                        _focus={{ borderColor: "nexus.emerald", boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)" }}
                                        disabled={isLoading}
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label color="slate.300">電子郵件</Field.Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="請輸入電子郵件"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                        borderRadius="crisp"
                                        borderColor="whiteAlpha.200"
                                        bg="nexus.obsidian"
                                        color="white"
                                        _focus={{ borderColor: "nexus.emerald", boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)" }}
                                        disabled={isLoading}
                                    />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label color="slate.300">密碼</Field.Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="請輸入密碼（至少 6 個字元）"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        size="lg"
                                        borderRadius="crisp"
                                        borderColor="whiteAlpha.200"
                                        bg="nexus.obsidian"
                                        color="white"
                                        _focus={{ borderColor: "nexus.emerald", boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)" }}
                                        disabled={isLoading}
                                    />
                                </Field.Root>

                                <Field.Root required invalid={password !== confirmPassword && confirmPassword.length > 0}>
                                    <Field.Label color="slate.300">確認密碼</Field.Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="請再次輸入密碼"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        size="lg"
                                        borderRadius="crisp"
                                        borderColor="whiteAlpha.200"
                                        bg="nexus.obsidian"
                                        color="white"
                                        _focus={{ borderColor: "nexus.emerald", boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)" }}
                                        disabled={isLoading}
                                    />
                                    {password !== confirmPassword && confirmPassword.length > 0 && (
                                        <Field.ErrorText>兩次密碼輸入不一致</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Button
                                    type="submit"
                                    variant="nexusPrimary"
                                    size="lg"
                                    w="full"
                                    loading={isLoading}
                                    loadingText="註冊中..."
                                >
                                    註冊
                                </Button>
                            </VStack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="slate.400" mt={6}>
                            已經有帳戶？{' '}
                            <Link
                                to="/login"
                                style={{ color: '#10B981', fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#10B981')}
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
