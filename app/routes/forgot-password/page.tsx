import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Card, Field, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useAuthStore } from "~/stores/authStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const navigate = useNavigate();

  const { resetPassword, verifyEmail, isLoading, error, clearError } = useAuthStore();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    try {
      const isValid = await verifyEmail(email);
      if (isValid) {
        setStep("reset");
      }
    } catch {
      // Store already exposes the error message.
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("密碼與確認密碼不一致");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("密碼至少需要 6 碼");
      return;
    }

    try {
      await resetPassword(email, newPassword);
      navigate("/login");
    } catch {
      // Store already exposes the error message.
    }
  };

  return (
    <Flex minH="100dvh" align="center" justify="center" px={4} py={8}>
      <Box w="full" maxW="880px">
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
                  {step === "verify" ? "驗證 Email" : "重設密碼"}
                </Heading>
                <Text color="nexus.textMuted" lineHeight="1.8">
                  {step === "verify"
                    ? "先確認 Email 是否存在，接著再建立新密碼。"
                    : "請輸入新的密碼，完成後會直接回到登入頁。"}
                </Text>
              </Stack>

              {error && (
                <Alert.Root status="error" borderRadius="crisp">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>操作失敗</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Content>
                  <Button size="sm" variant="ghost" color="nexus.textMuted" onClick={clearError}>
                    關閉
                  </Button>
                </Alert.Root>
              )}

              {step === "verify" ? (
                <Box as="form" onSubmit={handleVerify}>
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

                    <Button
                      type="submit"
                      variant="nexusPrimary"
                      size="lg"
                      w="full"
                      loading={isLoading}
                      loadingText="驗證中"
                    >
                      驗證並繼續
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box as="form" onSubmit={handleResetPassword}>
                  <Stack gap={5}>
                    <Field.Root required invalid={!!passwordError}>
                      <Field.Label color="nexus.textMuted">新密碼</Field.Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="至少 6 碼"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        size="lg"
                        disabled={isLoading}
                      />
                      {passwordError && <Field.ErrorText>{passwordError}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root required invalid={!!passwordError}>
                      <Field.Label color="nexus.textMuted">確認密碼</Field.Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="再次輸入新密碼"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        size="lg"
                        disabled={isLoading}
                      />
                      {passwordError && <Field.ErrorText>{passwordError}</Field.ErrorText>}
                    </Field.Root>

                    <Button
                      type="submit"
                      variant="nexusPrimary"
                      size="lg"
                      w="full"
                      loading={isLoading}
                      loadingText="更新中"
                    >
                      更新密碼
                    </Button>
                  </Stack>
                </Box>
              )}

              <Text color="nexus.textMuted" fontSize="sm">
                想起密碼了？
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
      Account Recovery
    </Box>
  );
}
