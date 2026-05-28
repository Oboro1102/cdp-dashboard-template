import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Card, Field, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useAuthStore } from "~/stores/authStore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("密碼與確認密碼不一致");
      return;
    }

    try {
      await register(email, password, name);
      navigate("/");
    } catch {
      // Store already exposes the error message.
    }
  };

  return (
    <Flex minH="100dvh" align="center" justify="center" px={4} py={8}>
      <Box w="full" maxW="980px">
        <Card.Root
          overflow="hidden"
          borderRadius="shell"
          borderWidth="1px"
          borderColor="nexus.lineSoft"
          bg="nexus.surfaceCard"
          boxShadow="panel"
          backdropFilter="blur(20px)"
        >
          <Box p={{ base: 8, lg: 10 }}>
            <Stack gap={6}>
              <Stack gap={2} maxW="44rem">
                <BadgeLike />
                <Heading size="xl" color="nexus.text" letterSpacing="-0.03em">
                  建立新帳號
                </Heading>
                <Text color="nexus.textMuted" lineHeight="1.8">
                  註冊後可以直接進入資料工作台，建立面板、檢視客戶資料並維持一致的視覺語言。
                </Text>
              </Stack>

              {(error || localError) && (
                <Alert.Root status="error" borderRadius="crisp">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>註冊失敗</Alert.Title>
                    <Alert.Description>{error || localError}</Alert.Description>
                  </Alert.Content>
                  <Button size="sm" variant="ghost" color="nexus.textMuted" onClick={clearError}>
                    關閉
                  </Button>
                </Alert.Root>
              )}

              <Box as="form" onSubmit={handleRegister}>
                <Stack gap={5}>
                  <Field.Root required>
                    <Field.Label color="nexus.textMuted">姓名</Field.Label>
                    <Input
                      id="name"
                      placeholder="請輸入姓名"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      size="lg"
                      disabled={isLoading}
                    />
                  </Field.Root>

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
                      placeholder="至少 6 碼"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size="lg"
                      disabled={isLoading}
                    />
                  </Field.Root>

                  <Field.Root required invalid={confirmPassword.length > 0 && password !== confirmPassword}>
                    <Field.Label color="nexus.textMuted">確認密碼</Field.Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="再次輸入密碼"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      size="lg"
                      disabled={isLoading}
                    />
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                      <Field.ErrorText>兩次輸入的密碼不一致</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Button
                    type="submit"
                    variant="nexusPrimary"
                    size="lg"
                    w="full"
                    loading={isLoading}
                    loadingText="建立中"
                  >
                    建立帳號
                  </Button>
                </Stack>
              </Box>

              <Text color="nexus.textMuted" fontSize="sm">
                已經有帳號？
                <Link to="/login" style={{ color: "#E8A84D", fontWeight: 600, marginLeft: 6 }}>
                  回到登入
                </Link>
              </Text>
            </Stack>
          </Box>
        </Card.Root>
      </Box>
    </Flex>
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
      Secure Access
    </Box>
  );
}
