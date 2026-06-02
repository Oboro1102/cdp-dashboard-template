import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { useAuthStore } from "~/stores/authStore";

type Gender = "male" | "female" | "other";

const genderOptions = createListCollection({
  items: [
    { label: "男性", value: "male" },
    { label: "女性", value: "female" },
    { label: "其他", value: "other" },
  ],
});

export default function ProfilePage() {
  const { user, updateUserProfile, logout, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [gender, setGender] = useState<Gender>(user?.gender ?? "male");
  const [birthday, setBirthday] = useState(user?.birthday ?? "");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Flex minH="60dvh" align="center" justify="center" px={4}>
        <Card.Root
          maxW="560px"
          w="full"
        >
          <Card.Body p={8}>
            <Stack gap={6} align="center" textAlign="center">
              <Box
                w="64px"
                h="64px"
                borderRadius="panel"
                bg="nexus.amberAlpha"
                color="nexus.amberLight"
                display="grid"
                placeItems="center"
                fontSize="2xl"
              >
                U
              </Box>
              <Stack gap={2}>
                <Heading size="lg" color="nexus.text">
                  尚未登入
                </Heading>
                <Text color="nexus.textMuted">
                  登入後才能編輯個人資料與使用完整工作台功能。
                </Text>
              </Stack>
              <Button variant="nexusPrimary" size="lg" w="full" onClick={() => navigate("/login")}>
                前往登入
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setFormError(null);
    setLoading(true);
    clearError();

    try {
      await updateUserProfile({ name, phone, gender, birthday });
      setSuccess(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box maxW="980px" mx="auto" px={4} py={6}>
      <Stack gap={6}>
        <Stack gap={2}>
          <Badge
            w="fit-content"
            variant="solid"
            bg="nexus.amberAlpha"
            color="nexus.amberLight"
            borderRadius="pill"
            px={3}
            py={1}
          >
            個人設定
          </Badge>
          <Heading size="xl" color="nexus.text" letterSpacing="-0.03em">
            編輯個人資料
          </Heading>
          <Text color="nexus.textMuted">
            更新姓名、聯絡方式與生日，讓工作台中的顯示資訊保持一致。
          </Text>
        </Stack>

        <Card.Root>
          <Card.Body p={{ base: 6, md: 8 }}>
            <Stack gap={6}>
              {success && (
                <Alert.Root status="success" borderRadius="crisp">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>更新完成</Alert.Title>
                    <Alert.Description>個人資料已經儲存。</Alert.Description>
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

              <Box as="form" onSubmit={handleUpdateProfile}>
                <Stack gap={6}>
                  <Stack gap={3}>
                    <Heading size="md" color="nexus.text">
                      帳號資訊
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <Field.Root disabled>
                        <Field.Label color="nexus.textMuted">Email</Field.Label>
                        <Input value={user.email} disabled />
                      </Field.Root>

                      <Field.Root disabled>
                        <Field.Label color="nexus.textMuted">會員等級</Field.Label>
                        <Input value={(user.membershipLevel ?? "bronze").toUpperCase()} disabled />
                      </Field.Root>
                    </SimpleGrid>
                  </Stack>

                  <Stack gap={3}>
                    <Heading size="md" color="nexus.text">
                      聯絡資訊
                    </Heading>
                    <Field.Root required>
                      <Field.Label color="nexus.textMuted">姓名</Field.Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="請輸入姓名"
                        disabled={loading}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label color="nexus.textMuted">電話</Field.Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="請輸入電話"
                        disabled={loading}
                      />
                    </Field.Root>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <Field.Root>
                        <Field.Label color="nexus.textMuted">性別</Field.Label>
                        <Select.Root
                          collection={genderOptions}
                          disabled={loading}
                          value={[gender]}
                          onValueChange={({ value }) => setGender(value[0] as Gender)}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="請選擇性別" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content>
                              {genderOptions.items.map((item) => (
                                <Select.Item item={item} key={item.value}>
                                  <Select.ItemText>{item.label}</Select.ItemText>
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label color="nexus.textMuted">生日</Field.Label>
                        <Input
                          type="date"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          disabled={loading}
                        />
                      </Field.Root>
                    </SimpleGrid>
                  </Stack>

                  <Stack gap={3} pt={2}>
                    <Button type="submit" variant="nexusPrimary" size="lg" w="full" loading={loading}>
                      儲存變更
                    </Button>
                    <Button
                      variant="nexusOutline"
                      size="lg"
                      w="full"
                      onClick={handleLogout}
                      disabled={loading}
                      borderColor="rgba(232, 108, 108, 0.35)"
                      color="#FCA5A5"
                      _hover={{ bg: "rgba(232, 108, 108, 0.1)", borderColor: "rgba(232, 108, 108, 0.7)" }}
                    >
                      登出
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Box>
  );
}
