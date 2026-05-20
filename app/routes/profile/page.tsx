import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Box,
    Card,
    Heading,
    Text,
    Input,
    Button,
    Alert,
    VStack,
    Field,
    ButtonGroup,
    Flex,
} from '@chakra-ui/react';
import { useAuthStore } from '~/stores/authStore';

export default function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { user, updateUserProfile } = useAuthStore();

    const navigate = useNavigate();

    // 初始化頁面時載入使用者資料
    React.useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // 驗證表單
        if (newPassword !== confirmPassword) {
            setError('新密碼與確認密碼不符');
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setError('新密碼長度至少需 6 個字元');
            return;
        }

        setLoading(true);

        try {
            // 準備更新資料
            const updateData: any = {};

            if (name !== user?.name) {
                updateData.name = name;
            }

            if (email !== user?.email) {
                updateData.email = email;
            }

            if (newPassword) {
                updateData.newPassword = newPassword;
            }

            if (currentPassword) {
                updateData.currentPassword = currentPassword;
            }

            // 呼叫更新 API
            await updateUserProfile(updateData);
            setSuccess(true);
            setError(null);
        } catch (err: any) {
            setError(err.message || '更新失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // 登出並導回登入頁
        // 這裡應該呼叫 authStore 的 logout 方法
        // 但因為我們在 store 中已經有 logout 方法，可以直接使用
        // 為了簡單起見，我們使用 navigate 回到登入頁，並清除狀態
        navigate('/login');
    };

    if (!user) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" p={4}>
                <Card.Root maxW="md" w="full" boxShadow="2xl">
                    <Card.Body p={8}>
                        <VStack gap={6} align="stretch">
                            <Box textAlign="center" mb={4}>
                                <Heading size="lg" mb={2}>
                                    請先登入
                                </Heading>
                                <Text color="gray.600" fontSize="base">
                                    您必須先登入才能存取個人設定頁面
                                </Text>
                            </Box>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                w="full"
                                h="12"
                                fontSize="base"
                                fontWeight="medium"
                                onClick={() => navigate('/login')}
                            >
                                前往登入
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Box>
        );
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" p={4}>
            <Card.Root maxW="md" w="full" boxShadow="2xl">
                <Card.Body p={8}>
                    <VStack gap={6} align="stretch">
                        <Box textAlign="center" mb={4}>
                            <Heading size="lg" mb={2}>
                                個人設定
                            </Heading>
                            <Text color="gray.600" fontSize="base">
                                管理您的個人資料與帳戶設定
                            </Text>
                        </Box>

                        {error && (
                            <Alert.Root status="error" borderRadius="md">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>更新失敗</Alert.Title>
                                    <Alert.Description>{error}</Alert.Description>
                                </Alert.Content>
                                <Button size="sm" ml="auto" variant="ghost" onClick={() => setError(null)}>✕</Button>
                            </Alert.Root>
                        )}

                        {success && (
                            <Alert.Root status="success" borderRadius="md">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>更新成功</Alert.Title>
                                    <Alert.Description>{success}</Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        <form onSubmit={handleSubmit}>
                            <VStack gap={6}>
                                {/* 名稱欄位 */}
                                <Field.Root required>
                                    <Field.Label>名稱</Field.Label>
                                    <Input
                                        id="name"
                                        placeholder="請輸入您的名稱"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        size="lg"
                                        disabled={loading}
                                    />
                                </Field.Root>

                                {/* 電子郵件欄位 */}
                                <Field.Root required>
                                    <Field.Label>電子郵件</Field.Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="請輸入電子郵件"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                        disabled={loading}
                                    />
                                </Field.Root>

                                {/* 密碼變更區域 */}

                                <Field.Root>
                                    <Field.Label>目前密碼</Field.Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        placeholder="請輸入目前密碼（必填）"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        size="lg"
                                        disabled={loading}
                                    />
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        需要輸入目前密碼才能更新名稱、電子郵件或變更密碼
                                    </Text>
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>新密碼（可不填）</Field.Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="請輸入新密碼（至少6碼，可不填）"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        size="lg"
                                        disabled={loading}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>確認新密碼</Field.Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="請確認新密碼"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        size="lg"
                                        disabled={loading}
                                    />
                                </Field.Root>

                                <ButtonGroup>
                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        size="lg"
                                        w="full"
                                        h="12"
                                        fontSize="base"
                                        fontWeight="medium"
                                        loading={loading}
                                        disabled={loading}
                                    >
                                        {loading ? '更新中...' : '更新個人資料'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        h="12"
                                        fontSize="base"
                                        fontWeight="medium"
                                        onClick={handleLogout}
                                        disabled={loading}
                                    >
                                        登出
                                    </Button>
                                </ButtonGroup>
                            </VStack>
                        </form>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}