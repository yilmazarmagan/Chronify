import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { AreaChart } from '@mantine/charts';
import { Box, Paper, Text, Title } from '@mantine/core';
import classes from './DailyActivityChart.module.scss';

interface DailyActivityItem {
  date: string;
  Duration: number;
}

interface DailyActivityChartProps {
  data: DailyActivityItem[];
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const { _ } = useLingui();

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Title order={4} mb="md">
        {_(msg`Daily Activity`)}
      </Title>
      {data.length > 0 ? (
        <Box className={classes.chartContainer}>
          <AreaChart
            h={300}
            data={data}
            dataKey="date"
            series={[{ name: 'Duration', color: 'blue.6' }]}
            curveType="monotone"
            tickLine="y"
            gridAxis="xy"
            withLegend
            unit="h"
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
