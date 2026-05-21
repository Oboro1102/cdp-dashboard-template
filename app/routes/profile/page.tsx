import { useState } from 'react';
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
    HStack,
    Field,
    Icon,
} from '@chakra-ui/react';
import { useAuthStore } from '~/stores/authStore';

type Gender = 'male' | 'female' | 'other';

export default function ProfilePage() {
    const { user, updateUserProfile, logout, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [gender, setGender] = useState<Gender>(user?.gender ?? 'male');
    const [birthday, setBirthday] = useState(user?.birthday ?? '');

    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!user) {
        return (
            <Box maxW="md" mx="auto" mt={10} p={4}>
                <Card.Root>
                    <Card.Body p={8} textAlign="center">
                        <VStack gap={6}>
                            <Icon boxSize={12} color="slate.500">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </Icon>
                            <Heading size="lg" color="white">請先登入</Heading>
                            <Text color="slate.400">你需要登入後才能查看與編輯個人資料。</Text>
                            <Button
                                variant="nexusPrimary"
                                size="lg"
                                w="full"
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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        setFormError(null);
        setLoading(true);
        clearError();

        try {
            await updateUserProfile({
                name,
                phone,
                gender,
                birthday,
            });
            setSuccess(true);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : '更新失敗');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Box maxW="2xl" mx="auto" p={4}>
            <Box mb={6}>
                <Heading size="lg" mb={2} color="white">個人資料設定</Heading>
                <Text color="slate.400">在這裡更新你的基本資訊。</Text>
            </Box>

            <Card.Root>
                <Card.Body p={8}>
                    <VStack gap={6} align="stretch">
                        {success && (
                            <Alert.Root status="success" borderRadius="crisp">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>更新成功</Alert.Title>
                                    <Alert.Description>個人資料已成功儲存。</Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        {(error || formError) && (
                            <Alert.Root status="error" borderRadius="crisp">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>更新失敗</Alert.Title>
                                    <Alert.Description>{error || formError}</Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        <form onSubmit={handleUpdateProfile}>
                            <VStack gap={6} align="stretch">
                                <Heading size="md" color="white" mb={2}>帳號資訊</Heading>

                                <HStack gap={4} width="full">
                                    <Field.Root disabled>
                                        <Field.Label color="slate.400">Email（不可修改）</Field.Label>
                                        <Input
                                            value={user.email}
                                            borderRadius="crisp"
                                            borderColor="whiteAlpha.100"
                                            bg="nexus.obsidian"
                                            color="slate.400"
                                        />
                                    </Field.Root>

                                    <Field.Root disabled>
                                        <Field.Label color="slate.400">會員等級</Field.Label>
                                        <Input
                                            value={(user.membershipLevel ?? 'bronze').toUpperCase()}
                                            borderRadius="crisp"
                                            borderColor="whiteAlpha.100"
                                            bg="nexus.obsidian"
                                            color="slate.400"
                                        />
                                    </Field.Root>
                                </HStack>

                                <Heading size="md" color="white" mb={2}>基本資料</Heading>

                                <Field.Root required>
                                    <Field.Label color="slate.300">姓名</Field.Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="請輸入姓名"
                                        borderRadius="crisp"
                                        borderColor="whiteAlpha.200"
                                        bg="nexus.obsidian"
                                        color="white"
                                        _focus={{ borderColor: 'nexus.emerald', boxShadow: '0 0 0 1px var(--chakra-colors-nexus-emerald)' }}
                                        disabled={loading}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label color="slate.300">電話</Field.Label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="請輸入電話號碼"
                                        borderRadius="crisp"
                                        borderColor="whiteAlpha.200"
                                        bg="nexus.obsidian"
                                        color="white"
                                        _focus={{ borderColor: 'nexus.emerald', boxShadow: '0 0 0 1px var(--chakra-colors-nexus-emerald)' }}
                                        disabled={loading}
                                    />
                                </Field.Root>

                                <HStack gap={4} width="full" align="start">
                                    <Field.Root>
                                        <Field.Label color="slate.300">性別</Field.Label>
                                        <Box position="relative" w="full">
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value as Gender)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    fontSize: '14px',
                                                    backgroundColor: '#070913',
                                                    color: '#ffffff',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#10B981';
                                                    e.target.style.boxShadow = '0 0 0 1px #10B981';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                                disabled={loading}
                                            >
                                                <option value="male" style={{ backgroundColor: '#101424' }}>男</option>
                                                <option value="female" style={{ backgroundColor: '#101424' }}>女</option>
                                                <option value="other" style={{ backgroundColor: '#101424' }}>其他</option>
                                            </select>
                                        </Box>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label color="slate.300">生日</Field.Label>
                                        <Input
                                            type="date"
                                            value={birthday}
                                            onChange={(e) => setBirthday(e.target.value)}
                                            borderRadius="crisp"
                                            borderColor="whiteAlpha.200"
                                            bg="nexus.obsidian"
                                            color="white"
                                            _focus={{ borderColor: 'nexus.emerald', boxShadow: '0 0 0 1px var(--chakra-colors-nexus-emerald)' }}
                                            disabled={loading}
                                        />
                                    </Field.Root>
                                </HStack>

                                <VStack gap={4} mt={4}>
                                    <Button
                                        type="submit"
                                        variant="nexusPrimary"
                                        size="lg"
                                        w="full"
                                        loading={loading}
                                    >
                                        儲存變更
                                    </Button>

                                    <Button
                                        variant="outline"
                                        colorPalette="red"
                                        size="lg"
                                        w="full"
                                        onClick={handleLogout}
                                        disabled={loading}
                                    >
                                        登出
                                    </Button>
                                </VStack>
                            </VStack>
                        </form>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
