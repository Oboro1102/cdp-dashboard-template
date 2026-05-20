import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Box,
    Heading,
    Text,
    Card,
    Badge,
    Button,
    Spinner,
    Alert,
    Flex,
    Icon,
    Table,
    Drawer,
    SimpleGrid,
    useDisclosure,
    Portal,
} from '@chakra-ui/react';
import { customerDb } from '../../mocks/customer/db';

// 定義會員詳細資料介面
interface CustomerDetail {
    id: string;
    email: string;
    phone: string;
    registrationTime: string;
    birthday: string;
    membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
    fbId: string | null;
    lineId: string | null;
    cookieId: string;
    clvValue: number;
    activityScore: number;
    revenueContribution: number;
    lastPurchaseTime: string | null;
    purchaseHistory: PurchaseRecord[];
}

interface PurchaseRecord {
    id: string;
    orderId: string;
    purchaseDate: string;
    amount: number;
    items: PurchaseItem[];
    status: 'completed' | 'pending' | 'cancelled';
}

interface PurchaseItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

// 返回圖示元件
function ChevronLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

// 資訊項目元件
function InfoItem({ label, value, color }: { label: string; value: string | number; color?: string }) {
    return (
        <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
            <Text fontWeight="semibold" color={color}>{value}</Text>
        </Box>
    );
}

// 驗證會員 ID
function validateCustomerId(id: string): boolean {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
        return false;
    }
    // 只允許特定格式
    return /^[a-zA-Z0-9_-]+$/.test(id);
}

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 使用 Disclosure 控制 Drawer 開關
    const { open: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
    // 當前選中的購買訂單
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);

    // 開啟查看明細 Drawer
    const openPurchaseDetail = (purchase: PurchaseRecord) => {
        setSelectedPurchase(purchase);
        openDrawer();
    };

    const fetchCustomer = useCallback(async () => {
        // 驗證 ID
        if (!id || !validateCustomerId(id)) {
            setError('無效的會員 ID');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/customers/${id}`);

            if (!response.ok) {
                const dbCustomer = customerDb.getCustomerById(id);
                if (dbCustomer) {
                    setCustomer(dbCustomer as CustomerDetail);
                } else {
                    throw new Error('找不到指定的會員');
                }
                return;
            }

            const result = await response.json();

            if (result.success && result.data?.customer) {
                setCustomer(result.data.customer);
            } else {
                setCustomer(result.data || result);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '發生未知錯誤');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    const goBack = () => {
        navigate(-1);
    };

    const getMembershipLevelColor = (level: string) => {
        switch (level) {
            case 'platinum': return 'purple';
            case 'gold': return 'yellow';
            case 'silver': return 'gray';
            case 'bronze': return 'orange';
            default: return 'gray';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('zh-TW');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'green';
            case 'pending': return 'yellow';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <Box width="100%" display="flex" justifyContent="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error || !customer) {
        return (
            <Box width="100%">
                <Alert.Root status="error" mb={4} borderRadius="lg">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>載入失敗</Alert.Title>
                        <Alert.Description>{error || '找不到會員資料'}</Alert.Description>
                    </Alert.Content>
                </Alert.Root>
                <Button onClick={goBack}>返回會員清單</Button>
            </Box>
        );
    }

    return (
        <Box width="100%" p={6}>
            {/* 頁面標題與返回按鈕 */}
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Button
                        variant="outline"
                        onClick={goBack}
                        mb={4}
                    >
                        <Flex align="center" gap={2}>
                            <ChevronLeftIcon />
                            返回會員清單
                        </Flex>
                    </Button>
                    <Heading size="xl" mb={2}>
                        會員詳細資料
                    </Heading>
                    <Text color="gray.600">
                        會員 ID: {customer.id}
                    </Text>
                </Box>
                <Badge
                    colorScheme={getMembershipLevelColor(customer.membershipLevel)}
                    fontSize="lg"
                    px={3}
                    py={1}
                >
                    {customer.membershipLevel.toUpperCase()}
                </Badge>
            </Flex>

            <Box as="hr" borderColor="gray.200" my={6} />

            {/* 基本資訊卡片 */}
            <Card.Root borderRadius="xl" mb={6}>
                <Card.Body>
                    <Heading size="lg" mb={4}>
                        <Icon boxSize={5} mr={2}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Icon>
                        基本資訊
                    </Heading>
                    <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                        <InfoItem label="電子郵件" value={customer.email} />
                        <InfoItem label="電話號碼" value={customer.phone} />
                        <InfoItem label="生日" value={formatDate(customer.birthday)} />
                        <InfoItem label="註冊日期" value={formatDate(customer.registrationTime)} />
                        <InfoItem label="最後購買時間" value={formatDate(customer.lastPurchaseTime)} />
                        <InfoItem
                            label="會員等級"
                            value={customer.membershipLevel.toUpperCase()}
                            color={getMembershipLevelColor(customer.membershipLevel)}
                        />
                    </Box>
                </Card.Body>
            </Card.Root>

            {/* 社群與追蹤資訊卡片 */}
            <Card.Root borderRadius="xl" mb={6}>
                <Card.Body>
                    <Heading size="lg" mb={4}>
                        <Icon boxSize={5} mr={2}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                            </svg>
                        </Icon>
                        社群與追蹤資訊
                    </Heading>
                    <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                        <InfoItem
                            label="Facebook ID"
                            value={customer.fbId || '未連結'}
                            color={customer.fbId ? 'green.600' : 'gray.500'}
                        />
                        <InfoItem
                            label="Line ID"
                            value={customer.lineId || '未連結'}
                            color={customer.lineId ? 'green.600' : 'gray.500'}
                        />
                        <InfoItem label="Cookie ID" value={customer.cookieId} />
                    </Box>
                </Card.Body>
            </Card.Root>

            {/* 價值指標卡片 */}
            <Card.Root borderRadius="xl" mb={6}>
                <Card.Body>
                    <Heading size="lg" mb={4}>
                        <Icon boxSize={5} mr={2}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </Icon>
                        價值指標
                    </Heading>
                    <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <InfoItem
                            label="CLV 價值"
                            value={formatCurrency(customer.clvValue)}
                            color="blue.600"
                        />
                        <InfoItem
                            label="活躍度"
                            value={customer.activityScore}
                            color={customer.activityScore > 50 ? 'green.600' : 'orange.600'}
                        />
                        <InfoItem
                            label="營收貢獻"
                            value={formatCurrency(customer.revenueContribution)}
                            color="green.600"
                        />
                    </Box>
                </Card.Body>
            </Card.Root>

            {/* 購買歷史卡片 */}
            {customer.purchaseHistory && customer.purchaseHistory.length > 0 && (
                <Card.Root borderRadius="xl">
                    <Card.Body>
                        <Heading size="lg" mb={4}>
                            <Icon boxSize={5} mr={2}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </Icon>
                            購買歷史
                        </Heading>
                        <Box overflowX="auto">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>訂單編號</Table.ColumnHeader>
                                        <Table.ColumnHeader>購買日期</Table.ColumnHeader>
                                        <Table.ColumnHeader>金額</Table.ColumnHeader>
                                        <Table.ColumnHeader>狀態</Table.ColumnHeader>
                                        <Table.ColumnHeader>明細</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {customer.purchaseHistory.map((purchase) => (
                                        <Table.Row key={purchase.id}>
                                            <Table.Cell>
                                                <Text fontWeight="semibold">{purchase.orderId}</Text>
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(purchase.purchaseDate)}</Table.Cell>
                                            <Table.Cell>{formatCurrency(purchase.amount)}</Table.Cell>
                                            <Table.Cell>
                                                <Badge colorScheme={getStatusColor(purchase.status)} variant="outline">
                                                    {purchase.status === 'completed' ? '已完成' : purchase.status === 'pending' ? '待處理' : '已取消'}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openPurchaseDetail(purchase)}
                                                >
                                                    查看明細
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Card.Body>
                </Card.Root>
            )}

            {/* 購買明細 Drawer - 使用 Portal 確保渲染到 body 層級 */}
            <Drawer.Root
                open={isDrawerOpen}
                onOpenChange={(details: { open: boolean }) => {
                    if (!details.open) closeDrawer();
                }}
            >
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Content
                        position="fixed"
                        top="0"
                        right="0"
                        height="100vh"
                        width="400px"
                        maxWidth="100vw"
                    >
                        <Drawer.Header>
                            <Heading size="lg">訂單明細</Heading>
                        </Drawer.Header>

                        <Drawer.Body>
                            {selectedPurchase && (
                                <>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={6}>
                                        <Box>
                                            <Text fontSize="sm" color="gray.500" mb={1}>訂單編號</Text>
                                            <Text fontWeight="semibold">{selectedPurchase.orderId}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="gray.500" mb={1}>購買日期</Text>
                                            <Text>{formatDate(selectedPurchase.purchaseDate)}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="gray.500" mb={1}>總金額</Text>
                                            <Text color="green.600">{formatCurrency(selectedPurchase.amount)}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="gray.500" mb={1}>狀態</Text>
                                            <Badge colorScheme={getStatusColor(selectedPurchase.status)} variant="outline">
                                                {selectedPurchase.status === 'completed'
                                                    ? '已完成'
                                                    : selectedPurchase.status === 'pending'
                                                        ? '待處理'
                                                        : '已取消'}
                                            </Badge>
                                        </Box>
                                    </SimpleGrid>

                                    <Box>
                                        <Text fontSize="sm" color="gray.500" mb={2}>購買項目</Text>
                                        <SimpleGrid columns={2} gap={4}>
                                            {selectedPurchase.items.map((item, index) => (
                                                <Box key={index} p={3} border="1px solid" borderColor="gray.200" borderRadius="md">
                                                    <Text fontWeight="semibold">{item.productName}</Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        數量: {item.quantity}
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        單價: {formatCurrency(item.price)}
                                                    </Text>
                                                    <Text fontSize="sm" color="green.600">
                                                        小計: {formatCurrency(item.price * item.quantity)}
                                                    </Text>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                </>
                            )}
                        </Drawer.Body>

                        <Drawer.Footer>
                            <Button onClick={closeDrawer}>關閉</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Portal>
            </Drawer.Root>
        </Box>
    );
}
