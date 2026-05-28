import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Flex,
    HStack,
    Pagination,
    Portal,
    Select,
    Spinner,
    Table,
    Text,
    Heading,
    createListCollection,
} from '@chakra-ui/react';

interface Customer {
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
}

interface CustomerListResponse {
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const pageSizeOptions = createListCollection({
    items: [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' },
    ],
});

function CustomerProfileContent() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(() => {
        const param = searchParams.get('page');
        return param ? parseInt(param, 10) : 1;
    });
    const [limit, setLimit] = useState(() => {
        const param = searchParams.get('limit');
        return param ? parseInt(param, 10) : 10;
    });
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/customers?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error('無法載入客戶資料');
            }

            const result: CustomerListResponse | Customer[] = await response.json();
            const data = Array.isArray(result) ? result : result.data || [];

            setCustomers(Array.isArray(data) ? data : []);
            setTotal(Array.isArray(result) ? data.length : result.total || 0);
            setTotalPages(Array.isArray(result) ? Math.ceil(data.length / limit) : result.totalPages || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : '載入失敗');
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            const params = new URLSearchParams(searchParams);
            params.set('page', newPage.toString());
            setSearchParams(params);
        }
    };

    const handleLimitChange = (newLimitValue: string) => {
        const newLimit = parseInt(newLimitValue, 10);
        if (Number.isNaN(newLimit)) return;

        setLimit(newLimit);
        setPage(1);

        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        params.set('limit', newLimit.toString());
        setSearchParams(params);
    };

    const getMembershipLevelColor = (level: string) => {
        switch (level) {
            case 'platinum':
                return 'purple';
            case 'gold':
                return 'yellow';
            case 'silver':
                return 'gray';
            case 'bronze':
                return 'orange';
            default:
                return 'gray';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('zh-TW');
    };

    return (
        <Box width="100%">
            <Box mb={6}>
                <Heading size="lg" mb={2} color="white">
                    客戶管理
                </Heading>
                <Text color="slate.400">查看與管理客戶資料。</Text>
            </Box>

            <Card.Root>
                <Card.Body p={6}>
                    <Select.Root
                        mb={6}
                        width="160px"
                        size="sm"
                        collection={pageSizeOptions}
                        value={[String(limit)]}
                        onValueChange={(details) => handleLimitChange(details.value[0] ?? '10')}
                    >
                        <Select.HiddenSelect />
                        <Select.Label>顯示筆數</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="請選擇筆數" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {pageSizeOptions.items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Flex justify="space-between" align="center" mb={6} gap={4} wrap="wrap">
                        <Text fontSize="sm" color="slate.400">
                            共 {total} 筆
                        </Text>
                    </Flex>

                    {loading && (
                        <Flex justify="center" py={10}>
                            <Spinner size="xl" color="nexus.emerald" />
                        </Flex>
                    )}

                    {error && (
                        <Alert.Root status="error" mb={4} borderRadius="crisp">
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>載入失敗</Alert.Title>
                                <Alert.Description>{error}</Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    {!loading && !error && (
                        <>
                            <Box width="100%" overflowX="auto" bg="transparent">
                                <Table.Root size="sm" variant="line" bg="transparent">
                                    <Table.Header>
                                        <Table.Row bg="transparent">
                                            {[
                                                'E-mail',
                                                '電話',
                                                '會員等級',
                                                'CLV',
                                                '活動分數',
                                                '營收貢獻',
                                                '最後購買',
                                                '註冊時間',
                                                '操作',
                                            ].map((column, index) => (
                                                <Table.ColumnHeader
                                                    key={column}
                                                    color="slate.400"
                                                    borderColor="whiteAlpha.100"
                                                    textAlign={index === 8 ? 'right' : 'left'}
                                                >
                                                    {column}
                                                </Table.ColumnHeader>
                                            ))}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {customers.map(
                                            ({
                                                id,
                                                email,
                                                phone,
                                                membershipLevel,
                                                clvValue,
                                                activityScore,
                                                revenueContribution,
                                                lastPurchaseTime,
                                                registrationTime,
                                            }) => (
                                                <Table.Row key={id} bg="transparent" _hover={{ bg: 'whiteAlpha.50' }}>
                                                    <Table.Cell color="slate.300" borderColor="whiteAlpha.50">
                                                        {email}
                                                    </Table.Cell>
                                                    <Table.Cell color="slate.300" borderColor="whiteAlpha.50">
                                                        {phone}
                                                    </Table.Cell>
                                                    <Table.Cell borderColor="whiteAlpha.50">
                                                        <Badge colorPalette={getMembershipLevelColor(membershipLevel)} variant="subtle">
                                                            {membershipLevel.toUpperCase()}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell color="slate.300" borderColor="whiteAlpha.50">
                                                        ${clvValue.toFixed(2)}
                                                    </Table.Cell>
                                                    <Table.Cell borderColor="whiteAlpha.50">
                                                        <Text color={activityScore > 50 ? 'nexus.emerald' : 'orange.400'} fontWeight="medium">
                                                            {activityScore}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell color="slate.300" borderColor="whiteAlpha.50">
                                                        ${revenueContribution.toFixed(2)}
                                                    </Table.Cell>
                                                    <Table.Cell color="slate.400" borderColor="whiteAlpha.50">
                                                        {formatDate(lastPurchaseTime)}
                                                    </Table.Cell>
                                                    <Table.Cell color="slate.400" borderColor="whiteAlpha.50">
                                                        {formatDate(registrationTime)}
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="right" borderColor="whiteAlpha.50">
                                                        <Button
                                                            size="sm"
                                                            variant="nexusOutline"
                                                            onClick={() => navigate(`/customer-detail/${id}`)}
                                                        >
                                                            查看詳情
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ),
                                        )}
                                    </Table.Body>
                                </Table.Root>
                            </Box>

                            {totalPages > 1 && (
                                <Pagination.Root
                                    count={total}
                                    pageSize={limit}
                                    page={page}
                                    siblingCount={1}
                                    onPageChange={(details) => handlePageChange(details.page)}
                                >
                                    <Flex justify="center" align="center" gap={2} mt={6} wrap="wrap">
                                        <Pagination.PrevTrigger asChild>
                                            <Button size="sm" variant="nexusOutline">
                                                上一頁
                                            </Button>
                                        </Pagination.PrevTrigger>

                                        <HStack gap={2} display={{ base: 'none', md: 'flex' }}>
                                            <Pagination.Items
                                                render={(item) => (
                                                    <Button
                                                        size="sm"
                                                        variant={item.value === page ? 'nexusPrimary' : 'nexusOutline'}
                                                    >
                                                        {item.value}
                                                    </Button>
                                                )}
                                                ellipsis={<Box as="span" px={2} color="slate.500">...</Box>}
                                            />
                                        </HStack>

                                        <Box display={{ base: 'flex', md: 'none' }} alignItems="center">
                                            <Pagination.PageText format="compact" color="slate.400" fontSize="sm" />
                                        </Box>

                                        <Pagination.NextTrigger asChild>
                                            <Button size="sm" variant="nexusOutline">
                                                下一頁
                                            </Button>
                                        </Pagination.NextTrigger>
                                    </Flex>
                                </Pagination.Root>
                            )}

                            <Flex justify="center" mt={6}>
                                <Text fontSize="sm" color="slate.500">
                                    第 {page} 頁 / 共 {totalPages} 頁
                                </Text>
                            </Flex>
                        </>
                    )}
                </Card.Body>
            </Card.Root>
        </Box>
    );
}

export default function CustomerProfile() {
    return (
        <Box width="100%">
            <CustomerProfileContent />
        </Box>
    );
}
