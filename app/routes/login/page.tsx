import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Card, Field, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useAuthStore } from "~/stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch {
      // Store already exposes the error message.
    }
  };

  return (
    <Flex minH="100dvh" align="center" justify="center" px={4} py={8}>
      <Box w="full" maxW="1100px">
        <Card.Root borderRadius="shell">
          <Flex direction={{ base: "column", lg: "row" }}>
            <Box flex="1" p={{ base: 8, lg: 10 }}>
              <Stack gap={6}>
                <Stack gap={2}>
                  <Heading size="xl" color="nexus.text" letterSpacing="-0.03em">
                    登入
                  </Heading>
                  <Text color="nexus.textMuted">使用你的帳號進入工作台。</Text>
                </Stack>

                {error && (
                  <Alert.Root status="error" borderRadius="crisp">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>登入失敗</Alert.Title>
                      <Alert.Description>{error}</Alert.Description>
                    </Alert.Content>
                    <Button size="sm" variant="ghost" color="nexus.textMuted" onClick={clearError}>
                      關閉
                    </Button>
                  </Alert.Root>
                )}

                <Box as="form" onSubmit={handleLogin}>
                  <Stack gap={5}>
                    <Field.Root required>
                      <Field.Label color="nexus.textMuted">Email</Field.Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="lg"
                        disabled={isLoading}
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label color="nexus.textMuted">密碼</Field.Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="輸入密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="lg"
                        disabled={isLoading}
                      />
                    </Field.Root>

                    <Button type="submit" variant="nexusPrimary" size="lg" w="full" loading={isLoading} loadingText="登入中">
                      登入
                    </Button>
                  </Stack>
                </Box>

                <Flex
                  justify="center"
                  align={{ base: "start", sm: "center" }}
                  direction={{ base: "column", sm: "row" }}
                  gap={3}
                  pt={2}
                  color="nexus.textMuted"
                  fontSize="sm"
                >
                  <Text>
                    還沒有帳號？
                    <Link to="/register" style={{ color: "#E8A84D", fontWeight: 600, marginLeft: 6 }}>
                      建立新帳號
                    </Link>
                  </Text>
                  <Link to="/forgot-password" style={{ color: "#E8A84D", fontWeight: 600 }}>
                    忘記密碼
                  </Link>
                </Flex>
              </Stack>
            </Box>
          </Flex>
        </Card.Root>
      </Box>
    </Flex>
  );
}
