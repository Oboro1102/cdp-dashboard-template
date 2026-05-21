import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboardStore";
import { DashboardPanel } from "../components/DashboardPanel";
import { DashboardModal } from "../components/DashboardModal";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "首頁 - CDP Template" },
    { name: "description", content: "歡迎來到 CDP Template" },
  ];
}

export default function Home() {
  const { panels, isModalOpen, fetchDataSources, addPanel } = useDashboardStore();

  // 組件載入時獲取數據源
  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return (
    <Box>
      {/* 頁面標題和新增按鈕 */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            歡迎回來
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            這裡是您錯過的內容
          </Text>
        </Box>
        <Button
          onClick={() => addPanel()}
          bg="blue.600"
          color="white"
          borderRadius="lg"
          _hover={{ bg: "blue.700" }}
          size="sm"
        >
          <Flex align="center" gap={2}>
            <Icon boxSize={4}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Icon>
            新增空白面板
          </Flex>
        </Button>
      </Flex>

      {/* 數據面板網格 */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={6}
        mb={8}
      >
        {panels.map((panel) => (
          <DashboardPanel key={panel.id} panel={panel} />
        ))}

        {/* 預設面板 - 如果沒有面板則顯示 */}
        {panels.length === 0 && (
          <Box
            borderRadius="xl"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="gray.300"
            bg="white"
            h="300px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack gap={4}>
              <Icon boxSize={12} color="gray.400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Icon>
              <Text color="gray.500" fontSize="sm" textAlign="center" maxW="sm">
                目前還沒有面板，先新增空白面板，再完成後續設定。
              </Text>
            </VStack>
          </Box>
        )}
      </SimpleGrid>

      {/* 設定 Modal */}
      {isModalOpen && <DashboardModal />}
    </Box>
  );
}
