import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Card,
  Drawer,
  Flex,
  Heading,
  Portal,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { customerDb } from "../../mocks/customer/db";

interface CustomerDetail {
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
  purchaseHistory: PurchaseRecord[];
}

interface PurchaseRecord {
  id: string;
  orderId: string;
  purchaseDate: string;
  amount: number;
  items: PurchaseItem[];
  status: "completed" | "pending" | "cancelled";
}

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

function validateCustomerId(id: string): boolean {
  return !!id && /^[a-zA-Z0-9_-]+$/.test(id);
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("zh-TW");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD" }).format(amount);
}

function getMembershipLevelColor(level: CustomerDetail["membershipLevel"]) {
  switch (level) {
    case "platinum":
      return { bg: "nexus.amberHoverStrong", color: "nexus.amberLight" };
    case "gold":
      return { bg: "nexus.amberHover", color: "nexus.amber" };
    case "silver":
      return { bg: "nexus.mutedSoft", color: "nexus.textMuted" };
    default:
      return { bg: "nexus.amberHoverStrong", color: "nexus.amberDeep" };
  }
}

function getStatusColor(status: PurchaseRecord["status"]) {
  switch (status) {
    case "completed":
      return { bg: "nexus.successSoft", color: "#86EFAC" };
    case "pending":
      return { bg: "nexus.amberHover", color: "nexus.amberLight" };
    case "cancelled":
      return { bg: "nexus.dangerSoft", color: "#FCA5A5" };
  }
}

function InfoItem({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <Box>
      <Text fontSize="sm" color="nexus.textMuted" mb={1}>
        {label}
      </Text>
      <Text fontWeight="semibold" color={color || "nexus.text"}>
        {value}
      </Text>
    </Box>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { open: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id || !validateCustomerId(id)) {
      setError("客戶 ID 格式不正確");
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
          return;
        }
        throw new Error("找不到這位客戶");
      }

      const result = await response.json();
      if (result.success && result.data?.customer) {
        setCustomer(result.data.customer);
      } else {
        setCustomer(result.data || result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "客戶資料載入失敗");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const goBack = () => navigate(-1);

  const openPurchaseDetail = (purchase: PurchaseRecord) => {
    setSelectedPurchase(purchase);
    openDrawer();
  };

  if (loading) {
    return (
      <Flex justify="center" py={14}>
        <Spinner size="xl" color="nexus.amber" />
      </Flex>
    );
  }

  if (error || !customer) {
    return (
      <Box width="100%" p={6}>
        <Alert.Root status="error" mb={4} borderRadius="crisp">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>讀取失敗</Alert.Title>
            <Alert.Description>{error || "無法顯示客戶資料"}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
        <Button onClick={goBack} variant="nexusPrimary">
          返回客戶列表
        </Button>
      </Box>
    );
  }

  const membership = getMembershipLevelColor(customer.membershipLevel);

  return (
    <Box width="100%">
      <Stack gap={6} mb={6}>
        <Box>
          <Button variant="nexusOutline" onClick={goBack} mb={4}>
            返回
          </Button>
          <Stack gap={2}>
            <Text
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
              客戶明細
            </Text>
            <Heading size="xl" color="nexus.text" letterSpacing="-0.03em">
              客戶資料詳情
            </Heading>
            <Text color="nexus.textMuted">查看這位客戶的基本資訊、識別資料、價值指標與消費紀錄。</Text>
          </Stack>
        </Box>
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={3}
        >
          <Text color="nexus.textMuted">客戶 ID：{customer.id}</Text>
          <Box
            w="fit-content"
            px={3}
            py={1}
            borderRadius="pill"
            bg={membership.bg}
            color={membership.color}
            borderWidth="1px"
            borderColor="nexus.lineSoft"
            fontSize="sm"
            fontWeight="semibold"
            letterSpacing="0.08em"
          >
            {customer.membershipLevel.toUpperCase()}
          </Box>
        </Flex>
      </Stack>

      <Stack gap={6}>
        <Card.Root>
          <Card.Body p={6}>
            <Heading size="lg" mb={6} color="nexus.text">
              基本資料
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              <InfoItem label="Email" value={customer.email} />
              <InfoItem label="手機" value={customer.phone} />
              <InfoItem label="生日" value={formatDate(customer.birthday)} />
              <InfoItem label="註冊時間" value={formatDate(customer.registrationTime)} />
              <InfoItem label="最後購買時間" value={formatDate(customer.lastPurchaseTime)} />
              <InfoItem label="會員等級" value={customer.membershipLevel.toUpperCase()} color={membership.color} />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body p={6}>
            <Heading size="lg" mb={6} color="nexus.text">
              連結資訊
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <InfoItem label="Facebook ID" value={customer.fbId || "未提供"} color={customer.fbId ? "nexus.text" : "nexus.textMuted"} />
              <InfoItem label="Line ID" value={customer.lineId || "未提供"} color={customer.lineId ? "nexus.text" : "nexus.textMuted"} />
              <InfoItem label="Cookie ID" value={customer.cookieId} />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body p={6}>
            <Heading size="lg" mb={6} color="nexus.text">
              價值與行為
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <InfoItem label="CLV" value={formatCurrency(customer.clvValue)} color="nexus.amberLight" />
              <InfoItem
                label="活躍分數"
                value={customer.activityScore}
                color={customer.activityScore > 50 ? "nexus.amberLight" : "nexus.textMuted"}
              />
              <InfoItem label="營收貢獻" value={formatCurrency(customer.revenueContribution)} color="nexus.amberLight" />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {customer.purchaseHistory?.length > 0 && (
          <Card.Root>
            <Card.Body p={6}>
              <Heading size="lg" mb={6} color="nexus.text">
                消費紀錄
              </Heading>
              <Box overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      {["訂單編號", "日期", "金額", "狀態", "動作"].map((column, index) => (
                        <Table.ColumnHeader
                          key={column}
                          color="nexus.textMuted"
                          borderColor="nexus.lineSoft"
                          textAlign={index === 4 ? "right" : "left"}
                        >
                          {column}
                        </Table.ColumnHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {customer.purchaseHistory.map((purchase) => (
                      <Table.Row key={purchase.id} _hover={{ bg: "nexus.amberHover" }}>
                        <Table.Cell borderColor="nexus.lineSoft">
                          <Text fontWeight="semibold" color="nexus.text">
                            {purchase.orderId}
                          </Text>
                        </Table.Cell>
                        <Table.Cell color="nexus.textMuted" borderColor="nexus.lineSoft">
                          {formatDate(purchase.purchaseDate)}
                        </Table.Cell>
                        <Table.Cell color="nexus.textMuted" borderColor="nexus.lineSoft">
                          {formatCurrency(purchase.amount)}
                        </Table.Cell>
                        <Table.Cell borderColor="nexus.lineSoft">
                          <StatusBadge status={purchase.status} />
                        </Table.Cell>
                        <Table.Cell textAlign="right" borderColor="nexus.lineSoft">
                          <Button size="sm" variant="nexusOutline" onClick={() => openPurchaseDetail(purchase)}>
                            查看
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
      </Stack>

      <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => !e.open && closeDrawer()}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Content
            position="fixed"
            top="0"
            right="0"
            height="100dvh"
            width="420px"
            maxWidth="100vw"
            p={6}
            display="flex"
            flexDirection="column"
          >
            <Drawer.Header p={0} mb={6} borderBottomWidth="1px" borderColor="nexus.lineSoft" pb={4}>
              <Heading size="lg" color="nexus.text">
                訂單詳情
              </Heading>
            </Drawer.Header>

            <Drawer.Body p={0} flex={1} overflowY="auto">
              {selectedPurchase && (
                <Stack gap={6}>
                  <SimpleGrid columns={2} gap={4}>
                    <InfoItem label="訂單編號" value={selectedPurchase.orderId} />
                    <InfoItem label="日期" value={formatDate(selectedPurchase.purchaseDate)} />
                    <InfoItem label="金額" value={formatCurrency(selectedPurchase.amount)} color="nexus.amberLight" />
                    <Box>
                      <Text fontSize="sm" color="nexus.textMuted" mb={1}>
                        狀態
                      </Text>
                      <StatusBadge status={selectedPurchase.status} />
                    </Box>
                  </SimpleGrid>

                  <Box borderTopWidth="1px" borderColor="nexus.lineSoft" pt={4}>
                    <Text fontSize="sm" color="nexus.textMuted" mb={3} fontWeight="medium">
                      訂單品項
                    </Text>
                    <Stack gap={3}>
                      {selectedPurchase.items.map((item) => (
                        <Box
                          key={item.productId}
                          p={4}
                          border="1px solid"
                          borderColor="nexus.lineSoft"
                          borderRadius="crisp"
                          bg="nexus.bg2"
                        >
                          <Text fontWeight="semibold" color="nexus.text" mb={1}>
                            {item.productName}
                          </Text>
                          <SimpleGrid columns={2} gap={2} fontSize="sm" color="nexus.textMuted">
                            <Text>數量：{item.quantity}</Text>
                            <Text>單價：{formatCurrency(item.price)}</Text>
                          </SimpleGrid>
                          <Text fontSize="sm" color="nexus.amberLight" fontWeight="medium" mt={2} textAlign="right">
                            小計：{formatCurrency(item.price * item.quantity)}
                          </Text>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              )}
            </Drawer.Body>

            <Drawer.Footer p={0} mt={6} pt={4} borderTopWidth="1px" borderColor="nexus.lineSoft" display="flex" justifyContent="flex-end">
              <Button onClick={closeDrawer} variant="nexusOutline">
                關閉
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Portal>
      </Drawer.Root>
    </Box>
  );
}

function StatusBadge({ status }: { status: PurchaseRecord["status"] }) {
  const palette = getStatusColor(status);
  const labels = {
    completed: "已完成",
    pending: "待處理",
    cancelled: "已取消",
  } as const;

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
      {labels[status]}
    </Box>
  );
}
