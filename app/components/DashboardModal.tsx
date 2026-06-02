import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Input,
  Portal,
  Select,
  Spinner,
  Text,
  VStack,
  HStack,
  createListCollection,
} from "@chakra-ui/react";
import { useDashboardStore } from "../stores/dashboardStore";

export function DashboardModal() {
  const {
    isModalOpen,
    closeModal,
    addPanel,
    updatePanel,
    editingPanelId,
    dataSources,
    fetchDataSources,
    isLoading,
    getDataSource,
    panels,
  } = useDashboardStore();

  const [name, setName] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const dataSourceCollection = useMemo(
    () =>
      createListCollection({
        items: dataSources.map((source) => ({
          label: source.name,
          value: source.id,
        })),
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
      }),
    [dataSources],
  );

  const isEditing = !!editingPanelId;
  const editingPanel = isEditing ? panels.find((p) => p.id === editingPanelId) : null;

  useEffect(() => {
    if (!isModalOpen) return;

    fetchDataSources();

    if (editingPanel) {
      setName(editingPanel.name);
      setSelectedSource(editingPanel.dataSourceId);
      setChartType(editingPanel.chartConfig.type);
    } else {
      setName("");
      setSelectedSource("");
      setChartType("bar");
    }
  }, [isModalOpen, fetchDataSources, editingPanel]);

  const selectedDataSource = selectedSource ? getDataSource(selectedSource) : null;
  const allFields = selectedDataSource?.fields || [];

  const handleSubmit = () => {
    if (!name || !selectedSource) return;

    const numericFields = allFields.filter((f) => f.type === "number");
    const stringFields = allFields.filter((f) => f.type === "string" || f.type === "date");

    const panelData = {
      name,
      dataSourceId: selectedSource,
      chartConfig: {
        type: chartType,
        xAxis: chartType === "bar" ? stringFields[0]?.name || allFields[0]?.name : undefined,
        yAxis: chartType === "bar" ? numericFields[0]?.name || allFields[1]?.name : undefined,
      },
    };

    if (isEditing && editingPanelId) {
      updatePanel(editingPanelId, panelData);
    } else {
      addPanel(panelData);
    }

    closeModal();
  };

  if (!isModalOpen) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      bg="nexus.overlay"
      backdropFilter="blur(18px)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="nexus.surfaceElevated"
        borderRadius="shell"
        border="1px solid"
        borderColor="nexus.lineSoft"
        boxShadow="panel"
        maxW="540px"
        w="full"
        maxH="90vh"
        overflowY="auto"
      >
        <Flex align="center" justify="space-between" px={6} py={4} borderBottomWidth="1px" borderColor="nexus.lineSoft">
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="nexus.text">
              {isEditing ? "編輯面板" : "新增面板"}
            </Text>
            <Text fontSize="sm" color="nexus.textMuted" mt={1}>
              先選資料來源，再決定要用哪種圖表與欄位。
            </Text>
          </Box>
          <CloseButton onClick={closeModal} color="nexus.textMuted" _hover={{ color: "nexus.text" }} />
        </Flex>

        <VStack gap={4} p={6} align="stretch">
          <Box w="full">
            <Text fontSize="sm" fontWeight="medium" color="nexus.textMuted" mb={2}>
              面板名稱
            </Text>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="例如：本月銷售趨勢"
            />
          </Box>

          <Box w="full">
            <Text fontSize="sm" fontWeight="medium" color="nexus.textMuted" mb={2}>
              資料來源
            </Text>
            {isLoading ? (
              <Flex justify="center" py={4}>
                <Spinner size="sm" color="nexus.amber" />
              </Flex>
            ) : (
              <>
                <Select.Root
                  collection={dataSourceCollection}
                  disabled={isLoading}
                  value={selectedSource ? [selectedSource] : []}
                  onValueChange={({ value }) => setSelectedSource(value[0] ?? "")}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="請選擇資料來源" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {dataSourceCollection.items.map((source) => (
                          <Select.Item item={source} key={source.value}>
                            <Select.ItemText>{source.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>

                {selectedDataSource && (
                  <Box
                    mt={3}
                    p={3}
                    bg="nexus.bg1"
                    border="1px solid"
                    borderColor="nexus.lineSoft"
                    borderRadius="crisp"
                    fontSize="sm"
                  >
                    <Text fontSize="xs" color="nexus.textMuted" mb={2}>
                      資料預覽
                    </Text>
                    <VStack align="start" gap={1}>
                      {selectedDataSource.data.slice(0, 3).map((record, idx) => (
                        <Text key={idx} color="nexus.textMuted" fontSize="xs">
                          {selectedDataSource.fields.map((f) => `${f.label}: ${record[f.name]}`).join(" · ")}
                        </Text>
                      ))}
                      {selectedDataSource.data.length > 3 && (
                        <Text color="nexus.textDim" fontSize="xs">
                          還有 {selectedDataSource.data.length - 3} 筆資料
                        </Text>
                      )}
                    </VStack>
                  </Box>
                )}
              </>
            )}
          </Box>

          <Box w="full">
            <Text fontSize="sm" fontWeight="medium" color="nexus.textMuted" mb={2}>
              圖表類型
            </Text>
            <HStack gap={3}>
              <Button
                variant={chartType === "bar" ? "nexusPrimary" : "nexusOutline"}
                onClick={() => setChartType("bar")}
                size="sm"
              >
                長條圖
              </Button>
              <Button
                variant={chartType === "pie" ? "nexusPrimary" : "nexusOutline"}
                onClick={() => setChartType("pie")}
                size="sm"
              >
                圓餅圖
              </Button>
            </HStack>
          </Box>
        </VStack>

        <Flex gap={3} justify="flex-end" px={6} py={4} borderTopWidth="1px" borderColor="nexus.lineSoft">
          <Button variant="nexusOutline" onClick={closeModal}>
            取消
          </Button>
          <Button onClick={handleSubmit} variant="nexusPrimary" disabled={!name || !selectedSource}>
            {isEditing ? "更新面板" : "建立面板"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
