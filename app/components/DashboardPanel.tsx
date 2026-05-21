import {
    Box,
    Flex,
    Text,
    Button,
    VStack,
    HStack,
    Icon,
    Card,
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
import { useMemo } from "react";

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

    // ?脣??祕?豢?
    const chartData = dataSource?.data || [];
    const xAxisField = panel.chartConfig.xAxis;
    const yAxisField = panel.chartConfig.yAxis;

    const pieFields = dataSource?.fields || [];
    const numericFields = pieFields.filter(f => f.type === 'number');
    const stringFields = pieFields.filter(f => f.type === 'string' || f.type === 'date');

    // label 甈?嚗蝙??xAxis ?洵銝??string/date 甈?
    const pieLabelField = xAxisField || stringFields[0]?.name || pieFields[0]?.name || 'name';
    const pieValueField = yAxisField || numericFields[0]?.name || pieFields[1]?.name || pieFields[0]?.name || 'value';

    const pieColors = ['#10B981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
    const pieData = useMemo(() =>
        chartData.slice(0, 5).map((record, index) => {
            const rawValue = record[pieValueField];
            const value = typeof rawValue === 'number' ? rawValue : Number(rawValue) || 0;
            return {
                name: String(record[pieLabelField] || `? ${index + 1}`),
                value: value,
                color: pieColors[index % pieColors.length],
            };
        }),
        [chartData, pieValueField, pieLabelField]
    );

    // 雿輻 useMemo ?脰???雿喳?
    const barChartData = useMemo(() =>
        chartData.map((record) => ({
            name: String(record[xAxisField || ''] || ''),
            value: Number(record[yAxisField || '']) || 0,
        })),
        [chartData, xAxisField, yAxisField]
    );

    return (
        <Card.Root h="full">
            <Card.Body p={6}>
                <Flex justify="space-between" align="center" mb={4}>
                    <VStack align="start" gap={1}>
                        <Text fontSize="lg" fontWeight="semibold" color="white">
                            {panel.name}
                        </Text>
                        <Text fontSize="sm" color="slate.400">
                            {dataSource?.name || '尚未命名的面板'}
                            {xAxisField && yAxisField && ` ${xAxisField} vs ${yAxisField}`}
                        </Text>
                    </VStack>
                    <HStack gap={2}>
                        {isConfigured && (
                            <Button
                                size="sm"
                                variant="nexusOutline"
                                onClick={handleConfigure}
                                px={3}
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
                            color="red.400"
                            _hover={{ color: "red.300", bg: "rgba(239, 68, 68, 0.1)" }}
                            onClick={handleRemove}
                            px={3}
                        >
                            <Icon boxSize={4}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Icon>
                        </Button>
                    </HStack>
                </Flex>

                {/* ?”???*/}
                <Box
                    minH="300px"
                    bg="nexus.slateLight"
                    borderRadius="crisp"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={6}
                >
                    {!isConfigured ? (
                        <VStack gap={4}>
                            <Icon boxSize={12} color="slate.500">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Icon>
                            <Button
                                onClick={handleConfigure}
                                variant="nexusPrimary"
                                size="sm"
                            >
                                設定面板
                            </Button>
                            <Text color="slate.400" fontSize="sm" textAlign="center" maxW="xs">
                                這是尚未完成設定的面板草稿，請先選擇資料來源與圖表類型。
                            </Text>
                        </VStack>
                    ) : chartData.length === 0 ? (
                        <Text color="slate.500" fontSize="sm">
                            ?⊥?憿舐內
                        </Text>
                    ) : panel.chartConfig.type === 'bar' ? (
                        /* ?瑟???- 雿輻 Recharts */
                        <Box w="full" h="250px">
                            <Text fontSize="sm" fontWeight="medium" color="slate.300" mb={4} textAlign="center">
                                {xAxisField} vs {yAxisField}
                            </Text>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                                    <YAxis stroke="#94a3b8" fontSize={11} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff10', color: '#fff' }} />
                                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        /* ????- 雿輻 Recharts */
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
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff10', color: '#fff' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            {/* ?? */}
                            <VStack gap={2} align="start" w="full">
                                {pieData.map((item, index) => (
                                    <HStack key={index} gap={2}>
                                        <Box w="12px" h="12px" borderRadius="sm" bg={item.color} />
                                        <Text fontSize="xs" color="slate.400">
                                            {item.name}: {item.value}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    )}
                </Box>
            </Card.Body>
        </Card.Root>
    );
}

