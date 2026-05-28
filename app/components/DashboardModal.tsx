import { useMemo, useState, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Input,
    Button,
    VStack,
    HStack,
    CloseButton,
    Spinner,
    Portal,
    Select,
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

    // 判斷是否為編輯模式
    const isEditing = !!editingPanelId;
    const editingPanel = isEditing ? panels.find((p) => p.id === editingPanelId) : null;

    // 組件載入時獲取數據源，並載入編輯數據
    useEffect(() => {
        if (isModalOpen) {
            fetchDataSources();

            // 如果是編輯模式，載入現有面板數據
            if (editingPanel) {
                setName(editingPanel.name);
                setSelectedSource(editingPanel.dataSourceId);
                setChartType(editingPanel.chartConfig.type);
            } else {
                // 新增模式，重置表單
                setName("");
                setSelectedSource("");
                setChartType("bar");
            }
        }
    }, [isModalOpen, fetchDataSources, editingPanel]);

    const selectedDataSource = selectedSource ? getDataSource(selectedSource) : null;

    // 根據圖表類型篩選欄位
    const allFields = selectedDataSource?.fields || [];

    const handleSubmit = () => {
        if (!name || !selectedSource) return;

        // 自動選擇欄位
        const numericFields = allFields.filter((f) => f.type === "number");
        const stringFields = allFields.filter((f) => f.type === "string" || f.type === "date");

        const panelData = {
            name,
            dataSourceId: selectedSource,
            chartConfig: {
                type: chartType,
                // 長條圖：自動選擇第一個 string/date 欄位作為 X 軸，第一個 number 欄位作為 Y 軸
                xAxis: chartType === "bar" ? stringFields[0]?.name || allFields[0]?.name : undefined,
                yAxis: chartType === "bar" ? numericFields[0]?.name || allFields[1]?.name : undefined,
            },
        };

        if (isEditing && editingPanelId) {
            // 編輯模式：更新現有面板
            updatePanel(editingPanelId, panelData);
        } else {
            // 新增模式：添加新面板
            addPanel(panelData);
        }

        closeModal();
    };

    if (!isModalOpen) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.800"
            backdropFilter="blur(4px)"
            zIndex={1000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Box
                bg="nexus.slate"
                borderRadius="crisp"
                border="1px solid"
                borderColor="whiteAlpha.100"
                boxShadow="cyberGlow"
                maxW="500px"
                w="full"
                maxH="90vh"
                overflowY="auto"
            >
                {/* Header */}
                <Flex
                    align="center"
                    justify="space-between"
                    px={6}
                    py={4}
                    borderBottomWidth="1px"
                    borderColor="whiteAlpha.100"
                >
                    <Text fontSize="lg" fontWeight="semibold" color="white">
                        {isEditing ? "編輯面板" : "新增面板"}
                    </Text>
                    <CloseButton onClick={closeModal} color="slate.400" _hover={{ color: "white" }} />
                </Flex>

                {/* Body */}
                <VStack gap={4} p={6}>
                    {/* 儀表板名稱 */}
                    <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="slate.300" mb={2}>
                            儀表板名稱
                        </Text>
                        <Input
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder="請輸入名稱"
                            borderRadius="crisp"
                            borderColor="whiteAlpha.200"
                            bg="nexus.obsidian"
                            color="white"
                            _focus={{
                                borderColor: "nexus.emerald",
                                boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)",
                            }}
                        />
                    </Box>

                    {/* 數據來源 */}
                    <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="slate.300" mb={2}>
                            數據來源
                        </Text>
                        {isLoading ? (
                            <Flex justify="center" py={4}>
                                <Spinner size="sm" color="nexus.emerald" />
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
                                            <Select.ValueText placeholder="請選擇數據來源" />
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
                                {/* 顯示選中數據源的資料預覽 */}
                                {selectedDataSource && (
                                    <Box
                                        mt={3}
                                        p={3}
                                        bg="nexus.obsidian"
                                        border="1px solid"
                                        borderColor="whiteAlpha.100"
                                        borderRadius="crisp"
                                        fontSize="sm"
                                    >
                                        <Text fontSize="xs" color="slate.400" mb={2}>
                                            資料預覽：
                                        </Text>
                                        <VStack align="start" gap={1}>
                                            {selectedDataSource.data.slice(0, 3).map((record, idx) => (
                                                <Text key={idx} color="slate.300" fontSize="xs">
                                                    {selectedDataSource.fields
                                                        .map((f) => `${f.label}: ${record[f.name]}`)
                                                        .join(", ")}
                                                </Text>
                                            ))}
                                            {selectedDataSource.data.length > 3 && (
                                                <Text color="slate.500" fontSize="xs">
                                                    ...共 {selectedDataSource.data.length} 筆資料
                                                </Text>
                                            )}
                                        </VStack>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>

                    {/* 圖表類型 */}
                    <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="slate.300" mb={2}>
                            圖表類型
                        </Text>
                        <HStack gap={6}>
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

                {/* Footer */}
                <Flex gap={3} justify="flex-end" px={6} py={4} borderTopWidth="1px" borderColor="whiteAlpha.100">
                    <Button variant="nexusOutline" onClick={closeModal}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} variant="nexusPrimary" disabled={!name || !selectedSource}>
                        {isEditing ? "更新" : "建立"}
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}
