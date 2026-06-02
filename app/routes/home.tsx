import { useEffect } from "react";
import type { Route } from "./+types/home";
import { DashboardModal } from "../components/DashboardModal";
import { DashboardPanel } from "../components/DashboardPanel";
import { useDashboardStore } from "../stores/dashboardStore";
import { Badge, Box, Button, Card, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "CDP 系統模板| 工作台總覽" },
    {
      name: "description",
      content: "檢視資料來源、建立面板，並把資料圖表放進同一個工作台。",
    },
  ];
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card.Root>
      <Card.Body p={5}>
        <VStack align="start" gap={2}>
          <Text fontSize="xs" color="nexus.textDim" letterSpacing="0.16em" textTransform="uppercase">
            {label}
          </Text>
          <Text fontSize="3xl" fontWeight="700" color="nexus.text" lineHeight="1" fontVariantNumeric="tabular-nums">
            {value}
          </Text>
          <Text fontSize="sm" color="nexus.textMuted" lineHeight="1.8">
            {hint}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default function Home() {
  const { panels, dataSources, isModalOpen, fetchDataSources, addPanel } = useDashboardStore();

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  const hasPanels = panels.length > 0;
  const hasDataSources = dataSources.length > 0;

  return (
    <Box>
      <Box
        mb={8}
        p={{ base: 6, md: 8 }}
        borderRadius="shell"
        borderWidth="1px"
        borderColor="nexus.lineSoft"
        bg="nexus.surfaceCard"
        boxShadow="panel"
        backdropFilter="blur(20px)"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          bg="radial-gradient(circle at top left, var(--aurum-amber-glow) 0%, transparent 32%), radial-gradient(circle at top right, var(--aurum-amber-glow-soft) 0%, transparent 26%)"
          pointerEvents="none"
          opacity={0.95}
        />

        <Box position="relative">
          <SimpleGrid columns={{ base: 1, lg: 12 }} gap={6} alignItems="stretch">
            <Box gridColumn={{ lg: "span 7" }}>
              <Badge variant="emeraldSubtle" mb={4}>
                工作台總覽
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                lineHeight="0.98"
                letterSpacing="-0.06em"
                color="nexus.text"
                maxW="12ch"
                textWrap="balance"
              >
                把資料來源變成清楚的圖表面板
              </Heading>
              <Text mt={4} maxW="56ch" fontSize="md" color="nexus.textMuted" lineHeight="1.85">
                先載入資料來源，再建立第一個面板。每個面板都可以獨立選擇圖表類型與欄位，
                讓你直接看到關鍵資訊，不用在多個頁面之間來回找資料。
              </Text>

              <Flex mt={6} gap={3} flexWrap="wrap">
                <Button onClick={() => addPanel()} variant="nexusPrimary" size="lg">
                  新增面板
                </Button>
              </Flex>
            </Box>

            <Box gridColumn={{ lg: "span 5" }}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} h="full">
                <MetricCard
                  label="資料來源"
                  value={String(dataSources.length).padStart(2, "0")}
                  hint={hasDataSources ? "已載入資料，現在可以直接選擇來源。" : "目前還沒有可用的資料來源。"}
                />
                <MetricCard
                  label="面板數"
                  value={String(panels.length).padStart(2, "0")}
                  hint={hasPanels ? "你已經建立了一些面板。" : "先建立一張圖表，工作台才會開始有內容。"}
                />
                <Card.Root>
                  <Card.Body p={5}>
                    <VStack align="start" gap={2} h="full" justify="space-between">
                      <Text fontSize="xs" color="nexus.textDim" letterSpacing="0.16em" textTransform="uppercase">
                        狀態
                      </Text>
                      <Box>
                        <Text fontSize="lg" fontWeight="600" color="nexus.amberLight">
                          {hasDataSources ? "準備就緒" : "等待資料"}
                        </Text>
                        <Text fontSize="sm" color="nexus.textMuted">
                          {hasDataSources
                            ? "可以開始新增面板，選擇資料來源與欄位。"
                            : "先確認資料來源已載入，再建立面板。"}
                        </Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
                <Card.Root>
                  <Card.Body p={5}>
                    <VStack align="start" gap={2} h="full" justify="space-between">
                      <Text fontSize="xs" color="nexus.textDim" letterSpacing="0.16em" textTransform="uppercase">
                        下一步
                      </Text>
                      <Box>
                        <Text fontSize="lg" fontWeight="600" color="nexus.amberLight">
                          先新增第一個面板
                        </Text>
                        <Text fontSize="sm" color="nexus.textMuted">
                          你可以從長條圖或圓餅圖開始，把最重要的資料先放上來。
                        </Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={8}>
        {panels.map((panel) => (
          <DashboardPanel key={panel.id} panel={panel} />
        ))}

        {!hasPanels && (
          <Card.Root gridColumn={{ md: "1 / -1" }}>
            <Card.Body
              minH="320px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth="1px"
              borderStyle="dashed"
              borderColor="nexus.lineSoft"
            >
              <VStack gap={4} textAlign="center">
                <Text fontSize="lg" fontWeight="600" color="nexus.text">
                  目前還沒有任何面板
                </Text>
                <Text color="nexus.textMuted" fontSize="sm" maxW="sm" lineHeight="1.8">
                  按下「新增面板」，選擇一個資料來源與圖表類型，就能開始建立你的第一張圖表。
                </Text>
                <Button onClick={() => addPanel()} variant="nexusPrimary">
                  新增面板
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        )}
      </SimpleGrid>

      {isModalOpen && <DashboardModal />}
    </Box>
  );
}
