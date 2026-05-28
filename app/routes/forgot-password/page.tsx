import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Card, Heading, Text, Input, Button, Alert, VStack, Field } from '@chakra-ui/react';
import { useAuthStore } from '~/stores/authStore';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [step, setStep] = useState<'verify' | 'reset'>('verify');
    const navigate = useNavigate();

    const { resetPassword, verifyEmail, isLoading, error, clearError } = useAuthStore();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 驗證帳號是否存在
            const isValid = await verifyEmail(email);
            if (isValid) {
                // 帳號存在，進入重設密碼步驟
                setStep('reset');
            }
        } catch (err: any) {
            // 錯誤已經在 store 中處理
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (newPassword !== confirmPassword) {
            setPasswordError('新密碼與確認密碼不一致');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('新密碼長度至少需要 6 個字元');
            return;
        }

        try {
            await resetPassword(email, newPassword);
            // 重設成功，導向登入頁面
            navigate('/login');
        } catch (err) {
            // 錯誤已經在 store 中處理
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" p={4}>
            <Card.Root maxW="md" w="full" variant="cyber">
                <Card.Body p={8}>
                    <VStack gap={6} align="stretch">
                        <Box textAlign="center" mb={4}>
                            <Heading size="lg" mb={2} color="white">
                                {step === 'verify' ? '忘記密碼' : '重設密碼'}
                            </Heading>
                            <Text color="slate.400" fontSize="base">
                                {step === 'verify'
                                    ? '請輸入您的電子郵件以驗證帳號'
                                    : '請輸入新的密碼'}
                            </Text>
                        </Box>

                        {error && (
                            <Alert.Root status="error">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>錯誤</Alert.Title>
                                    <Alert.Description>{error}</Alert.Description>
                                </Alert.Content>
                                <Button size="sm" ml="auto" variant="ghost" color="slate.400" _hover={{ color: "white" }} onClick={clearError}>✕</Button>
                            </Alert.Root>
                        )}

                        {step === 'verify' ? (
                            <form onSubmit={handleVerify}>
                                <VStack gap={6}>
                                    <Field.Root required>
                                        <Field.Label color="slate.300">電子郵件</Field.Label>
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

                                    <Button
                                        type="submit"
                                        variant="nexusPrimary"
                                        size="lg"
                                        w="full"
                                        loading={isLoading}
                                        loadingText="驗證中..."
                                    >
                                        驗證帳號
                                    </Button>
                                </VStack>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <VStack gap={6}>
                                    <Field.Root required invalid={!!passwordError}>
                                        <Field.Label color="slate.300">新密碼</Field.Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="請輸入新密碼（至少 6 個字元）"
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setPasswordError('');
                                            }}
                                            size="lg"
                                            disabled={isLoading}
                                        />
                                        {passwordError && (
                                            <Field.ErrorText>{passwordError}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root required invalid={!!passwordError}>
                                        <Field.Label color="slate.300">確認新密碼</Field.Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="請再次輸入新密碼"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setPasswordError('');
                                            }}
                                            size="lg"
                                            disabled={isLoading}
                                        />
                                        {passwordError && (
                                            <Field.ErrorText>{passwordError}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Button
                                        type="submit"
                                        variant="nexusPrimary"
                                        size="lg"
                                        w="full"
                                        loading={isLoading}
                                        loadingText="重設中..."
                                    >
                                        重設密碼
                                    </Button>
                                </VStack>
                            </form>
                        )}

                        <Text textAlign="center" fontSize="sm" color="slate.400" mt={6}>
                            記起密碼了？{' '}
                            <Link
                                to="/login"
                                style={{ color: '#10B981', fontWeight: 500 }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#10B981')}
                            >
                                返回登入
                            </Link>
                        </Text>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
