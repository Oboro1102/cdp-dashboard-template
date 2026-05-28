import { useMemo } from "react";
import { Box, Button, Card, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStore } from "../stores/dashboardStore";
import { brand } from "../chakraTheme";

interface DashboardPanelProps {
  panel: {
    id: string;
    name: string;
    dataSourceId: string;
    chartConfig: {
      type: "bar" | "pie";
      xAxis?: string;
      yAxis?: string;
    };
  };
}

export function DashboardPanel({ panel }: DashboardPanelProps) {
  const { removePanel, getDataSource, openModal } = useDashboardStore();

  const dataSource = getDataSource(panel.dataSourceId);
  const chartData = dataSource?.data || [];
  const xAxisField = panel.chartConfig.xAxis;
  const yAxisField = panel.chartConfig.yAxis;

  const isConfigured =
    panel.dataSourceId &&
    (panel.chartConfig.type === "pie" ||
      (panel.chartConfig.type === "bar" && panel.chartConfig.xAxis && panel.chartConfig.yAxis));

  const pieFields = dataSource?.fields || [];
  const numericFields = pieFields.filter((f) => f.type === "number");
  const stringFields = pieFields.filter((f) => f.type === "string" || f.type === "date");
  const pieLabelField = xAxisField || stringFields[0]?.name || pieFields[0]?.name || "name";
  const pieValueField = yAxisField || numericFields[0]?.name || pieFields[1]?.name || pieFields[0]?.name || "value";
  const pieColors = [brand.colors.amber, brand.colors.amberLight, "#F1C06D", "#8D5A14", "#FFDCA4"];

  const pieData = useMemo(
    () =>
      chartData.slice(0, 5).map((record, index) => {
        const rawValue = record[pieValueField];
        const value = typeof rawValue === "number" ? rawValue : Number(rawValue) || 0;
        return {
          name: String(record[pieLabelField] || `項目 ${index + 1}`),
          value,
          color: pieColors[index % pieColors.length],
        };
      }),
    [chartData, pieValueField, pieLabelField],
  );

  const barChartData = useMemo(
    () =>
      chartData.map((record) => ({
        name: String(record[xAxisField || ""] || ""),
        value: Number(record[yAxisField || ""]) || 0,
      })),
    [chartData, xAxisField, yAxisField],
  );

  return (
    <Card.Root
      h="full"
      bg="nexus.surfaceCard"
      borderWidth="1px"
      borderColor="nexus.lineSoft"
      boxShadow="panel"
      overflow="hidden"
    >
      <Card.Body p={6}>
        <Flex justify="space-between" align="center" mb={4} gap={4}>
          <VStack align="start" gap={1}>
            <Text fontSize="lg" fontWeight="semibold" color="nexus.text">
              {panel.name}
            </Text>
            <Text fontSize="sm" color="nexus.textMuted">
              {dataSource?.name || "尚未選擇資料來源"}
              {xAxisField && yAxisField ? ` · ${xAxisField} 對 ${yAxisField}` : ""}
            </Text>
          </VStack>

          <HStack gap={2}>
            {isConfigured && (
              <Button size="sm" variant="nexusOutline" onClick={() => openModal(panel.id)} px={3}>
                設定
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              color="red.300"
              _hover={{ color: "red.200", bg: "rgba(239, 68, 68, 0.1)" }}
              onClick={() => removePanel(panel.id)}
              px={3}
            >
              刪除
            </Button>
          </HStack>
        </Flex>

        <Box
          minH="300px"
          bg="nexus.bg1"
          borderRadius="panel"
          borderWidth="1px"
          borderColor="nexus.lineSoft"
          boxShadow="inset"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            inset={0}
            bg={`radial-gradient(circle at top left, ${brand.colors.amberAlpha} 0%, transparent 30%), radial-gradient(circle at bottom right, rgba(232, 168, 77, 0.06) 0%, transparent 32%)`}
            pointerEvents="none"
          />

          {!isConfigured ? (
            <VStack gap={4} position="relative">
              <Text color="nexus.textDim" fontSize="sm" textAlign="center" maxW="xs">
                這個面板還沒設定完成。先選擇資料來源與欄位，才能開始繪圖。
              </Text>
              <Button onClick={() => openModal(panel.id)} variant="nexusPrimary" size="sm">
                完成設定
              </Button>
            </VStack>
          ) : chartData.length === 0 ? (
            <Text color="nexus.textDim" fontSize="sm" position="relative">
              目前來源沒有可繪製的資料。
            </Text>
          ) : panel.chartConfig.type === "bar" ? (
            <Box w="full" h="250px" position="relative">
              <Text fontSize="sm" fontWeight="medium" color="nexus.textMuted" mb={4} textAlign="center">
                {xAxisField} · {yAxisField}
              </Text>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(39,50,68,0.65)" />
                  <XAxis dataKey="name" stroke={brand.colors.textDim} fontSize={11} />
                  <YAxis stroke={brand.colors.textDim} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: brand.colors.bg2,
                      borderColor: brand.colors.lineSoft,
                      color: brand.colors.text,
                      borderRadius: "14px",
                    }}
                    cursor={{ fill: "rgba(216, 138, 26, 0.08)" }}
                  />
                  <Bar dataKey="value" fill={brand.colors.amber} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <VStack gap={4} w="full" position="relative">
              <Box w="full" h="250px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={86}
                      fill={brand.colors.amber}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: brand.colors.bg2,
                        borderColor: brand.colors.lineSoft,
                        color: brand.colors.text,
                        borderRadius: "14px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <VStack gap={2} align="start" w="full">
                {pieData.map((item, index) => (
                  <HStack key={index} gap={2}>
                    <Box w="12px" h="12px" borderRadius="sm" bg={item.color} />
                    <Text fontSize="xs" color="nexus.textMuted">
                      {item.name} · {item.value}
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
