import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Grid, Group, Paper, Text } from '@mantine/core';
import { IconChartPie, IconClock } from '@tabler/icons-react';
import { formatDurationString } from '@utils/date.utils';
import classes from './StatsCards.module.scss';

interface ProjectStats {
  name: string;
  value: number;
  color: string;
}

interface StatsCardsProps {
  totalDuration: number;
  filteredEntriesCount: number;
  mostActiveProject: ProjectStats | null;
}

export function StatsCards({
  totalDuration,
  filteredEntriesCount,
  mostActiveProject,
}: StatsCardsProps) {
  const { _ } = useLingui();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Paper withBorder p="md" radius="md" className={classes.card}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {_(msg`Total Time`)}
            </Text>
            <IconClock className={classes.icon} size={22} stroke={1.5} />
          </Group>

          <Group align="flex-end" gap="xs" mt={25}>
            <Text className={classes.statValue}>
              {formatDurationString(totalDuration)}
            </Text>
          </Group>

          <Text size="xs" c="dimmed" mt={7}>
            {filteredEntriesCount} {_(msg`entries found`)}
          </Text>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Paper withBorder p="md" radius="md" className={classes.card}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {_(msg`Most Active Project`)}
            </Text>
            <IconChartPie className={classes.icon} size={22} stroke={1.5} />
          </Group>

          <Group align="flex-end" gap="xs" mt={25}>
            <Text fz="xl" fw={700} lineClamp={1}>
              {mostActiveProject ? mostActiveProject.name : '-'}
            </Text>
          </Group>

          <Text size="xs" c="dimmed" mt={7}>
            {mostActiveProject
              ? `${mostActiveProject.value} hours`
              : _(msg`No data`)}
          </Text>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
