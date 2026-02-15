import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { PieChart } from '@mantine/charts';
import { Box, Paper, Text, Title } from '@mantine/core';
import classes from './ProjectDistributionChart.module.scss';

interface ProjectChartItem {
  name: string;
  value: number;
  color: string;
}

interface ProjectDistributionChartProps {
  data: ProjectChartItem[];
}

export function ProjectDistributionChart({
  data,
}: ProjectDistributionChartProps) {
  const { _ } = useLingui();

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Title order={4} mb="md">
        {_(msg`Project Distribution`)}
      </Title>
      {data.length > 0 ? (
        <Box className={classes.chartContainer}>
          <PieChart
            withTooltip
            tooltipDataSource="segment"
            data={data}
            size={200}
            mx="auto" // Center
            withLabels
          />
        </Box>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          {_(msg`No data available`)}
        </Text>
      )}
    </Paper>
  );
}
