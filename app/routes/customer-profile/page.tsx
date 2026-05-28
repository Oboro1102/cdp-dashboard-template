import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Pagination,
  Portal,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  Text,
  createListCollection,
} from "@chakra-ui/react";

interface Customer {
  id: string;
  email: string;
  phone: string;
  registrationTime: string;
  birthday: string;
  membershipLevel: "bronze" | "silver" | "gold" | "platinum";
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
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ],
});

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(() => Number(searchParams.get("page") ?? 1));
  const [limit, setLimit] = useState(() => Number(searchParams.get("limit") ?? 10));
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error("無法載入客戶資料");
      }

      const result: CustomerListResponse | Customer[] = await response.json();
      const data = Array.isArray(result) ? result : result.data || [];

      setCustomers(Array.isArray(data) ? data : []);
      setTotal(Array.isArray(result) ? data.length : result.total || 0);
      setTotalPages(Array.isArray(result) ? Math.ceil(data.length / limit) : result.totalPages || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "資料讀取失敗");
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
      params.set("page", newPage.toString());
      setSearchParams(params);
    }
  };

  const handleLimitChange = (newLimitValue: string) => {
    const newLimit = Number(newLimitValue);
    if (Number.isNaN(newLimit)) return;

    setLimit(newLimit);
    setPage(1);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", newLimit.toString());
    setSearchParams(params);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  return (
    <Box width="100%">
      <Stack gap={2} mb={6}>
        <BadgeLike />
        <Heading size="xl" color="nexus.text" letterSpacing="-0.03em">
          客戶資料
        </Heading>
        <Text color="nexus.textMuted">
          以同一套暗色介面檢視客戶清單、會員等級與交易表現。
        </Text>
      </Stack>

      <Card.Root bg="nexus.surfaceCard" borderColor="nexus.lineSoft" borderWidth="1px" boxShadow="panel">
        <Card.Body p={{ base: 4, md: 6 }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={6}>
            <Box>
              <Text fontSize="sm" color="nexus.textMuted" mb={2}>
                每頁筆數
              </Text>
              <Select.Root
                width="180px"
                size="sm"
                collection={pageSizeOptions}
                value={[String(limit)]}
                onValueChange={(details) => handleLimitChange(details.value[0] ?? "10")}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="選擇筆數" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="nexus.surfaceCard">
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
            </Box>

            <Flex justify="flex-end" align="end">
              <Text color="nexus.textMuted" fontSize="sm">
                共 {total} 筆資料
              </Text>
            </Flex>
          </SimpleGrid>

          {loading && (
            <Flex justify="center" py={10}>
              <Spinner size="xl" color="nexus.amber" />
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
              <Box overflowX="auto">
                <Table.Root size="sm" bg="nexus.surfaceCard">
                  <Table.Header>
                    <Table.Row>
                      {["Email", "電話", "會員等級", "CLV", "活躍分數", "營收貢獻", "最近購買", "註冊時間", "操作"].map(
                        (column, index) => (
                          <Table.ColumnHeader
                            key={column}
                            color="nexus.textMuted"
                            borderColor="nexus.lineSoft"
                            textAlign={index === 8 ? "right" : "left"}
                          >
                            {column}
                          </Table.ColumnHeader>
                        ),
                      )}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {customers.map((customer) => (
                      <Table.Row key={customer.id} _hover={{ bg: "rgba(216, 138, 26, 0.05)" }}>
                        <Table.Cell color="nexus.text" borderColor="nexus.lineSoft">
                          {customer.email}
                        </Table.Cell>
                        <Table.Cell color="nexus.textMuted" borderColor="nexus.lineSoft">
                          {customer.phone}
                        </Table.Cell>
                        <Table.Cell borderColor="nexus.lineSoft">
                          <LevelBadge level={customer.membershipLevel} />
                        </Table.Cell>
                        <Table.Cell color="nexus.text" borderColor="nexus.lineSoft">
                          ${customer.clvValue.toFixed(2)}
                        </Table.Cell>
                        <Table.Cell
                          color={customer.activityScore > 50 ? "nexus.amberLight" : "nexus.textMuted"}
                          borderColor="nexus.lineSoft"
                        >
                          {customer.activityScore}
                        </Table.Cell>
                        <Table.Cell color="nexus.text" borderColor="nexus.lineSoft">
                          ${customer.revenueContribution.toFixed(2)}
                        </Table.Cell>
                        <Table.Cell color="nexus.textMuted" borderColor="nexus.lineSoft">
                          {formatDate(customer.lastPurchaseTime)}
                        </Table.Cell>
                        <Table.Cell color="nexus.textMuted" borderColor="nexus.lineSoft">
                          {formatDate(customer.registrationTime)}
                        </Table.Cell>
                        <Table.Cell textAlign="right" borderColor="nexus.lineSoft">
                          <Button
                            size="sm"
                            variant="nexusOutline"
                            onClick={() => navigate(`/customer-detail/${customer.id}`)}
                          >
                            查看
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
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

                    <Pagination.Items
                      render={(item) => (
                        <Button size="sm" variant={item.value === page ? "nexusPrimary" : "nexusOutline"}>
                          {item.value}
                        </Button>
                      )}
                      ellipsis={<Box as="span" px={2} color="nexus.textDim">...</Box>}
                    />

                    <Pagination.NextTrigger asChild>
                      <Button size="sm" variant="nexusOutline">
                        下一頁
                      </Button>
                    </Pagination.NextTrigger>
                  </Flex>
                </Pagination.Root>
              )}
            </>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

function LevelBadge({ level }: { level: Customer["membershipLevel"] }) {
  const palette =
    level === "platinum"
      ? { bg: "rgba(232, 168, 77, 0.18)", color: "nexus.amberLight" }
      : level === "gold"
        ? { bg: "rgba(216, 138, 26, 0.16)", color: "nexus.amber" }
        : level === "silver"
          ? { bg: "rgba(113, 128, 150, 0.18)", color: "nexus.textMuted" }
          : { bg: "rgba(168, 101, 15, 0.18)", color: "nexus.amberDeep" };

  return (
    <Box
      w="fit-content"
      px={2.5}
      py={1}
      borderRadius="pill"
      bg={palette.bg}
      color={palette.color}
      borderWidth="1px"
      borderColor="nexus.lineSoft"
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="0.08em"
    >
      {level.toUpperCase()}
    </Box>
  );
}

function BadgeLike() {
  return (
    <Box
      w="fit-content"
      px={3}
      py={1}
      borderRadius="pill"
      borderWidth="1px"
      borderColor="nexus.amberAlpha"
      bg="nexus.amberAlpha"
      color="nexus.amberLight"
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="0.14em"
      textTransform="uppercase"
    >
      Customer Intelligence
    </Box>
  );
}
