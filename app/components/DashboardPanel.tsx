import {
    Box,
    Flex,
    Text,
    Button,
    VStack,
    HStack,
    Icon,
} from "@chakra-ui/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useDashboardStore } from "../stores/dashboardStore";

interface DashboardPanelProps {
    panel: {
        id: string;
        name: string;
        dataSourceId: string;
        chartConfig: {
            type: 'bar' | 'pie';
            xAxis?: string;
            yAxis?: string;
        };
    };
}

export function DashboardPanel({ panel }: DashboardPanelProps) {
    const { removePanel, getDataSource, openModal } = useDashboardStore();

    const handleRemove = () => {
        removePanel(panel.id);
    };

    const handleConfigure = () => {
        openModal(panel.id);
    };

    const dataSource = getDataSource(panel.dataSourceId);
    const isConfigured = panel.dataSourceId && (
        panel.chartConfig.type === 'pie' ||
        (panel.chartConfig.type === 'bar' && panel.chartConfig.xAxis && panel.chartConfig.yAxis)
    );

    // 獲取真實數據
    const chartData = dataSource?.data || [];
    const xAxisField = panel.chartConfig.xAxis;
    const yAxisField = panel.chartConfig.yAxis;

    // 圓餅圖數據處理
    const pieFields = dataSource?.fields || [];
    const numericFields = pieFields.filter(f => f.type === 'number');
    const stringFields = pieFields.filter(f => f.type === 'string' || f.type === 'date');

    // label 欄位：使用 xAxis 或第一個 string/date 欄位
    const pieLabelField = xAxisField || stringFields[0]?.name || pieFields[0]?.name || 'name';
    // value 欄位：使用 yAxis 或第一個數值欄位
    const pieValueField = yAxisField || numericFields[0]?.name || pieFields[1]?.name || pieFields[0]?.name || 'value';

    const pieColors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
    const pieData = chartData.slice(0, 5).map((record, index) => {
        const rawValue = record[pieValueField];
        const value = typeof rawValue === 'number' ? rawValue : Number(rawValue) || 0;
        return {
            name: String(record[pieLabelField] || `項目 ${index + 1}`),
            value: value,
            color: pieColors[index % pieColors.length],
        };
    });

    // 長條圖數據處理 - 轉換為 Recharts 格式
    const barChartData = chartData.map((record) => ({
        name: String(record[xAxisField || ''] || ''),
        value: Number(record[yAxisField || '']) || 0,
    }));

    return (
        <Box
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
            overflow="hidden"
            h="full"
            bg="white"
        >
            <Box p={6}>
                <Flex justify="space-between" align="center" mb={4}>
                    <VStack align="start" gap={1}>
                        <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                            {panel.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {dataSource?.name || '未知來源'}
                            {xAxisField && yAxisField && ` • ${xAxisField} vs ${yAxisField}`}
                        </Text>
                    </VStack>
                    <HStack gap={2}>
                        {isConfigured && (
                            <Button
                                size="sm"
                                variant="ghost"
                                color="gray.500"
                                _hover={{ color: "gray.700", bg: "gray.100" }}
                                borderRadius="lg"
                                onClick={handleConfigure}
                            >
                                <Icon boxSize={4}>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </Icon>
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            color="red.500"
                            _hover={{ color: "red.700", bg: "red.50" }}
                            onClick={handleRemove}
                            borderRadius="lg"
                        >
                            <Icon boxSize={4}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Icon>
                        </Button>
                    </HStack>
                </Flex>

                {/* 圖表區域 */}
                <Box
                    minH="300px"
                    bg="gray.50"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={6}
                >
                    {!isConfigured ? (
                        <VStack gap={4}>
                            <Icon boxSize={12} color="gray.400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Icon>
                            <Button
                                onClick={handleConfigure}
                                bg="blue.600"
                                color="white"
                                borderRadius="lg"
                                _hover={{ bg: "blue.700" }}
                                size="sm"
                            >
                                設定面板
                            </Button>
                        </VStack>
                    ) : chartData.length === 0 ? (
                        <Text color="gray.400" fontSize="sm">
                            無數據可顯示
                        </Text>
                    ) : panel.chartConfig.type === 'bar' ? (
                        /* 長條圖 - 使用 Recharts */
                        <Box w="full" h="250px">
                            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={4} textAlign="center">
                                {xAxisField} vs {yAxisField}
                            </Text>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        /* 圓餅圖 - 使用 Recharts */
                        <VStack gap={4} w="full">
                            <Box w="full" h="250px">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            {/* 圖例 */}
                            <VStack gap={2} align="start" w="full">
                                {pieData.map((item, index) => (
                                    <HStack key={index} gap={2}>
                                        <Box w="12px" h="12px" borderRadius="sm" bg={item.color} />
                                        <Text fontSize="xs" color="gray.600">
                                            {item.name}: {item.value}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
