import { useEffect } from "react";
import type { Route } from "./+types/home";
import { DashboardModal } from "../components/DashboardModal";
import { DashboardPanel } from "../components/DashboardPanel";
import { useDashboardStore } from "../stores/dashboardStore";
import { brand } from "../chakraTheme";
import { Badge, Box, Button, Card, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aurum Night | 資料工作台" },
    {
      name: "description",
      content: "Aurum Night 是一個深色資料工作台，用來瀏覽資料來源、建立圖表面板與查看客戶資訊。",
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
    <Card.Root bg="nexus.surfaceCard" borderWidth="1px" borderColor="nexus.lineSoft" boxShadow="panelSoft">
      <Card.Body p={5}>
        <VStack align="start" gap={2}>
          <Text fontSize="xs" color="nexus.textDim" letterSpacing="0.16em" textTransform="uppercase">
            {label}
          </Text>
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="nexus.text"
            lineHeight="1"
            fontVariantNumeric="tabular-nums"
          >
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
          bg={`radial-gradient(circle at top left, ${brand.colors.amberAlpha} 0%, transparent 32%), radial-gradient(circle at top right, rgba(232, 168, 77, 0.08) 0%, transparent 26%)`}
          pointerEvents="none"
          opacity={0.95}
        />

        <Box position="relative">
          <SimpleGrid columns={{ base: 1, lg: 12 }} gap={6} alignItems="stretch">
            <Box gridColumn={{ lg: "span 7" }}>
              <Badge variant="emeraldSubtle" mb={4}>
                資料入口
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
                把資料放進同一個暗色工作台
              </Heading>
              <Text mt={4} maxW="56ch" fontSize="md" color="nexus.textMuted" lineHeight="1.85">
                這裡是瀏覽資料來源、建立圖表面板與追蹤客戶資料的入口。所有主要資訊都維持在同一套暗色 surface 裡，避免白底元件打斷閱讀。
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
                  hint={hasDataSources ? "資料來源已載入，可以直接建立圖表" : "先載入資料來源，再建立面板"}
                />
                <MetricCard
                  label="面板數"
                  value={String(panels.length).padStart(2, "0")}
                  hint={hasPanels ? "已有面板可持續調整設定" : "目前還沒有任何面板"}
                />
                <Card.Root bg="nexus.surfaceCard" borderWidth="1px" borderColor="nexus.lineSoft" boxShadow="panelSoft">
                  <Card.Body p={5}>
                    <VStack align="start" gap={2} h="full" justify="space-between">
                      <Text
                        fontSize="xs"
                        color="nexus.textDim"
                        letterSpacing="0.16em"
                        textTransform="uppercase"
                      >
                        狀態
                      </Text>
                      <Box>
                        <Text fontSize="lg" fontWeight="600" color="nexus.amberLight">
                          {hasDataSources ? "READY" : "WAITING"}
                        </Text>
                        <Text fontSize="sm" color="nexus.textMuted">
                          {hasDataSources ? "資料已就緒，可以開始組裝圖表。" : "尚未載入資料來源，先從面板建立流程開始。"}
                        </Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
                <Card.Root bg="nexus.surfaceCard" borderWidth="1px" borderColor="nexus.lineSoft" boxShadow="panelSoft">
                  <Card.Body p={5}>
                    <VStack align="start" gap={2} h="full" justify="space-between">
                      <Text
                        fontSize="xs"
                        color="nexus.textDim"
                        letterSpacing="0.16em"
                        textTransform="uppercase"
                      >
                        品牌
                      </Text>
                      <Box>
                        <Text fontSize="lg" fontWeight="600" color="nexus.amberLight">
                          Aurum Night
                        </Text>
                        <Text fontSize="sm" color="nexus.textMuted">
                          暗色、克制、重閱讀性的資料工作台視覺。
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
          <Card.Root
            gridColumn={{ md: "1 / -1" }}
            bg="nexus.surfaceCard"
            borderWidth="1px"
            borderColor="nexus.lineSoft"
            boxShadow="panel"
          >
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
                <Box
                  w={16}
                  h={16}
                  borderRadius="shell"
                  bg="nexus.amberAlpha"
                  borderWidth="1px"
                  borderColor="nexus.amber"
                  boxShadow="amberHalo"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="2xl" color="nexus.amberLight" fontWeight="700">
                    +
                  </Text>
                </Box>
                <Text color="nexus.text" fontSize="lg" fontWeight="600">
                  尚未建立面板
                </Text>
                <Text color="nexus.textMuted" fontSize="sm" maxW="sm" lineHeight="1.8">
                  先新增一個面板，再從資料來源挑選欄位，將圖表放進同一個深色工作台。
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
