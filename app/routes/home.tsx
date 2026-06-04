import { useEffect } from "react";
import { DashboardModal } from "../components/DashboardModal";
import { DashboardPanel } from "../components/DashboardPanel";
import { useDashboardStore } from "../stores/dashboardStore";
import { Badge, Box, Button, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  const { panels, dataSources, isModalOpen, fetchDataSources, addPanel } = useDashboardStore();

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return (
    <Flex direction="column" gap='8'>
      <Flex py={{ base: 6, md: 8 }} gap={4} flexWrap='wrap' alignItems="stretch" justifyContent='space-between'>
        <Box>
          <Flex gap="2" align="center" mb={4}>
            <Badge variant="emeraldSubtle" >
              數據總覽
            </Badge>
            <Badge pl={2.5}>
              {String(panels.length)} 個以建立
            </Badge>
          </Flex>
          <Heading
            as="h1"
            fontSize={{ base: "xl", md: "3xl" }}
            fontWeight="700"
            lineHeight="0.98"
            letterSpacing="-0.06em"
            color="nexus.text"
            textWrap="balance"
          >
            構建專屬於你的數據地圖
          </Heading>
          <Text color="nexus.textMuted" fontSize="sm" mt={1} lineHeight="1.8">
            即時監控系統所有串接資料數據狀況
          </Text>
        </Box>
        <Flex gap={4} alignItems='center'>
          <Flex alignItems='center' gap={2} py={2} px={4} fontSize="sm" borderWidth='1px' borderColor='nexus.lineSoft' borderRadius='panel' backgroundColor='nexus.surfaceCard'>
            <div className="size-3 rounded-full bg-emerald-500" />
            <Text color="nexus.textMuted">資料來源</Text>
            <Text fontWeight="700" color="nexus.text">{String(dataSources.length).padStart(2, "0")}</Text>
          </Flex>
          <Button onClick={() => addPanel()} variant="nexusPrimary">
            <Text fontSize='lg'>+</Text><Text>新增面板</Text>
          </Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={8}>
        {panels.map((panel) => (
          <DashboardPanel key={panel.id} panel={panel} />
        ))}
        {panels.length < 1 && (
          <Box gridColumn={{ md: "1 / -1" }} minH="320px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderWidth="1px"
            borderStyle="dashed"
            borderRadius='3xl'
            borderColor="nexus.lineSoft">
            <VStack gap={4} textAlign="center">
              <Box p={3} backgroundColor='nexus.surfaceCard' borderWidth="1px"
                borderRadius='xl'
                borderColor="nexus.lineSoft" color="nexus.text">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </Box>
              <Text fontSize="lg" fontWeight="extrabold" color="nexus.text">
                啟動你的第一個數據面板
              </Text>
              <Text color="nexus.textMuted" fontSize="sm" maxW="sm" lineHeight="1.8">
                目前尚未建立任何面板，你可以透過右側按鈕開始建立。
              </Text>
            </VStack>
          </Box>
        )}
      </SimpleGrid>

      {isModalOpen && <DashboardModal />}
    </Flex>
  );
}
