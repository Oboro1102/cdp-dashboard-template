import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
    Box,
    Heading,
    Text,
    Table,
    VStack,
    HStack,
    Button,
    Spinner,
    Alert,
    Flex,
    Badge,
    Card,
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

const PAGE_SIZE_OPTIONS = [10, 20, 50];

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
                throw new Error('無法取得會員資料');
            }
            const result = await response.json();
            const customers = result.data || result;
            setCustomers(Array.isArray(customers) ? customers : []);
            setTotal(result.total || 0);
            setTotalPages(result.totalPages || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : '發生未知錯誤');
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

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setLimit(newLimit);
        setPage(1);
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        params.set('limit', newLimit.toString());
        setSearchParams(params);
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

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    size="sm"
                    variant={i === page ? 'solid' : 'outline'}
                    colorScheme={i === page ? 'blue' : 'gray'}
                    onClick={() => handlePageChange(i)}
                    mx={1}
                >
                    {i}
                </Button>
            );
        }

        return (
            <HStack gap={2} justify="center" mt={4}>
                <Button
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                >
                    首頁
                </Button>
                <Button
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    上一頁
                </Button>
                {pages}
                <Button
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    下一頁
                </Button>
                <Button
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                >
                    末頁
                </Button>
            </HStack>
        );
    };

    return (
        <Box width="100%">
            <Box mb={6}>
                <Heading size="lg" mb={2}>會員清單</Heading>
                <Text color="gray.600">管理所有會員資訊</Text>
            </Box>

            <Card.Root>
                <Card.Body>
                    <Flex justify="space-between" align="center" mb={4}>
                        <HStack gap={4}>
                            <Text>每頁顯示：</Text>
                            <Box
                                w="120px"
                                position="relative"
                            >
                                <select
                                    value={limit}
                                    onChange={handleLimitChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #D0D5DD',
                                        fontSize: '14px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3182CE';
                                        e.target.style.boxShadow = '0 0 0 1px #3182CE';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D0D5DD';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {PAGE_SIZE_OPTIONS.map(option => (
                                        <option key={option} value={option}>
                                            {option} 筆
                                        </option>
                                    ))}
                                </select>
                            </Box>
                            <Text fontSize="sm" color="gray.500">
                                共 {total} 位會員
                            </Text>
                        </HStack>
                    </Flex>

                    {loading && (
                        <Flex justify="center" py={10}>
                            <Spinner size="xl" />
                        </Flex>
                    )}

                    {error && (
                        <Alert.Root status="error" mb={4}>
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>載入失敗</Alert.Title>
                                <Alert.Description>{error}</Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    {!loading && !error && (
                        <>
                            <Box width="100%" overflowX="auto">
                                <Table.Root size="sm">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>Email</Table.ColumnHeader>
                                            <Table.ColumnHeader>電話</Table.ColumnHeader>
                                            <Table.ColumnHeader>會員等級</Table.ColumnHeader>
                                            <Table.ColumnHeader>CLV 價值</Table.ColumnHeader>
                                            <Table.ColumnHeader>活躍度</Table.ColumnHeader>
                                            <Table.ColumnHeader>營收貢獻</Table.ColumnHeader>
                                            <Table.ColumnHeader>最後購買時間</Table.ColumnHeader>
                                            <Table.ColumnHeader>註冊時間</Table.ColumnHeader>
                                            <Table.ColumnHeader>操作</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {customers.map((customer) => (
                                            <Table.Row key={customer.id}>
                                                <Table.Cell>{customer.email}</Table.Cell>
                                                <Table.Cell>{customer.phone}</Table.Cell>
                                                <Table.Cell>
                                                    <Badge colorScheme={getMembershipLevelColor(customer.membershipLevel)}>
                                                        {customer.membershipLevel.toUpperCase()}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell>${customer.clvValue.toFixed(2)}</Table.Cell>
                                                <Table.Cell>
                                                    <Text color={customer.activityScore > 50 ? 'green.500' : 'orange.500'}>
                                                        {customer.activityScore}
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>${customer.revenueContribution.toFixed(2)}</Table.Cell>
                                                <Table.Cell>{formatDate(customer.lastPurchaseTime)}</Table.Cell>
                                                <Table.Cell>{formatDate(customer.registrationTime)}</Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate(`/customer-detail/${customer.id}`)}
                                                    >
                                                        查看詳細資料
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>

                            {totalPages > 1 && renderPagination()}

                            <Flex justify="center" mt={4}>
                                <Text fontSize="sm" color="gray.500">
                                    第 {page} 頁，共 {totalPages} 頁
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
