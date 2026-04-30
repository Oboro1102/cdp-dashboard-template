import { useState, useEffect } from "react";
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
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

    // 判斷是否為編輯模式
    const isEditing = !!editingPanelId;
    const editingPanel = isEditing ? panels.find(p => p.id === editingPanelId) : null;

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
                setChartType('bar');
            }
        }
    }, [isModalOpen, fetchDataSources, editingPanel]);

    const selectedDataSource = selectedSource ? getDataSource(selectedSource) : null;

    // 根據圖表類型篩選欄位
    const allFields = selectedDataSource?.fields || [];

    const handleSubmit = () => {
        if (!name || !selectedSource) return;

        // 自動選擇欄位
        const numericFields = allFields.filter(f => f.type === 'number');
        const stringFields = allFields.filter(f => f.type === 'string' || f.type === 'date');

        const panelData = {
            name,
            dataSourceId: selectedSource,
            chartConfig: {
                type: chartType,
                // 長條圖：自動選擇第一個 string/date 欄位作為 X 軸，第一個 number 欄位作為 Y 軸
                xAxis: chartType === 'bar' ? (stringFields[0]?.name || allFields[0]?.name) : undefined,
                yAxis: chartType === 'bar' ? (numericFields[0]?.name || allFields[1]?.name) : undefined,
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

    const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSource(e.target.value);
    };

    if (!isModalOpen) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            zIndex={1000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Box
                bg="white"
                borderRadius="xl"
                boxShadow="2xl"
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
                    borderColor="gray.200"
                >
                    <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                        {isEditing ? '編輯面板' : '新增面板'}
                    </Text>
                    <CloseButton onClick={closeModal} />
                </Flex>

                {/* Body */}
                <VStack gap={4} p={6}>
                    {/* 儀表板名稱 */}
                    <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            儀表板名稱
                        </Text>
                        <Input
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder="請輸入名稱"
                            borderRadius="lg"
                            borderColor="gray.300"
                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                        />
                    </Box>

                    {/* 數據來源 */}
                    <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            數據來源
                        </Text>
                        {isLoading ? (
                            <Flex justify="center" py={4}>
                                <Spinner size="sm" color="blue.500" />
                            </Flex>
                        ) : (
                            <>
                                <Box position="relative" w="full">
                                    <select
                                        value={selectedSource}
                                        onChange={handleSourceChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #D0D5DD',
                                            fontSize: '14px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            outline: 'none',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3182CE';
                                            e.target.style.boxShadow = '0 0 0 1px #3182CE';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#D0D5DD';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="">請選擇數據來源</option>
                                        {dataSources.map((source) => (
                                            <option key={source.id} value={source.id}>
                                                {source.name}
                                            </option>
                                        ))}
                                    </select>
                                </Box>
                                {/* 顯示選中數據源的資料預覽 */}
                                {selectedDataSource && (
                                    <Box mt={3} p={3} bg="gray.50" borderRadius="md" fontSize="sm">
                                        <Text fontSize="xs" color="gray.500" mb={2}>資料預覽：</Text>
                                        <VStack align="start" gap={1}>
                                            {selectedDataSource.data.slice(0, 3).map((record, idx) => (
                                                <Text key={idx} color="gray.600" fontSize="xs">
                                                    {selectedDataSource.fields.map(f => `${f.label}: ${record[f.name]}`).join(', ')}
                                                </Text>
                                            ))}
                                            {selectedDataSource.data.length > 3 && (
                                                <Text color="gray.400" fontSize="xs">...共 {selectedDataSource.data.length} 筆資料</Text>
                                            )}
                                        </VStack>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>

                    {/* 圖表類型 */}
                    <Box w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            圖表類型
                        </Text>
                        <HStack gap={6}>
                            <Button
                                variant={chartType === 'bar' ? 'solid' : 'outline'}
                                bg={chartType === 'bar' ? 'blue.600' : 'transparent'}
                                color={chartType === 'bar' ? 'white' : 'gray.700'}
                                borderColor="gray.300"
                                borderRadius="lg"
                                onClick={() => setChartType('bar')}
                                size="sm"
                            >
                                長條圖
                            </Button>
                            <Button
                                variant={chartType === 'pie' ? 'solid' : 'outline'}
                                bg={chartType === 'pie' ? 'blue.600' : 'transparent'}
                                color={chartType === 'pie' ? 'white' : 'gray.700'}
                                borderColor="gray.300"
                                borderRadius="lg"
                                onClick={() => setChartType('pie')}
                                size="sm"
                            >
                                圓餅圖
                            </Button>
                        </HStack>
                    </Box>
                </VStack>

                {/* Footer */}
                <Flex
                    gap={3}
                    justify="flex-end"
                    px={6}
                    py={4}
                    borderTopWidth="1px"
                    borderColor="gray.200"
                >
                    <Button
                        variant="outline"
                        onClick={closeModal}
                        borderRadius="lg"
                        borderColor="gray.300"
                        color="gray.700"
                        _hover={{ bg: "gray.50" }}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        bg="blue.600"
                        color="white"
                        borderRadius="lg"
                        _hover={{ bg: "blue.700" }}
                        disabled={!name || !selectedSource}
                    >
                        {isEditing ? '更新' : '建立'}
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}
