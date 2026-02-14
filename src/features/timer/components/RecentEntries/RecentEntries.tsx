import {
  Paper,
  Text,
  Group,
  Stack,
  ColorSwatch,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useAppData } from '../../../../providers/context';
import { formatDurationString } from '../../../../utils/date.utils';
import { DATE_FORMAT, TIME_FORMAT } from '../../../../constants';
import dayjs from 'dayjs';
import classes from './RecentEntries.module.scss';

interface RecentEntriesProps {
  onResume: (projectId: string, description: string) => void;
}

export function RecentEntries({ onResume }: RecentEntriesProps) {
  const { _ } = useLingui();
  const { data } = useAppData();

  // Get today's entries, sorted by start time desc
  const today = dayjs().format(DATE_FORMAT);
  const entries = data.timeEntries
    .filter((e) => e.date === today && e.endTime) // Only finished entries
    .slice(0, 5);

  if (entries.length === 0) {
    return (
      <Text c="dimmed" size="sm" ta="center" mt="xl">
        {_(msg`No entries yet for today.`)}
      </Text>
    );
  }

  return (
    <Stack gap="sm" mt={40} w="100%" maw={600}>
      <Text size="sm" fw={500} c="dimmed" mb="xs">
        {_(msg`Today's Activity`)}
      </Text>

      {entries.map((entry) => {
        const project = data.projects.find((p) => p.id === entry.projectId);
        const startTime = dayjs(entry.startTime).format(TIME_FORMAT);
        const endTime = entry.endTime
          ? dayjs(entry.endTime).format(TIME_FORMAT)
          : '';

        return (
          <Paper key={entry.id} className={classes.entryCard}>
            <Group justify="space-between">
              <Group gap="md">
                <ColorSwatch
                  color={project?.color || 'gray'}
                  size={12}
                  radius="xl"
                />
                <Stack gap={2}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {entry.description || _(msg`No description`)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {project?.name || _(msg`No Project`)} • {startTime} -{' '}
                    {endTime}
                  </Text>
                </Stack>
              </Group>

              <Group gap="sm">
                <Text size="sm" fw={600} className={classes.duration}>
                  {formatDurationString(entry.duration)}
                </Text>

                <Tooltip label={_(msg`Continue this task`)} position="left">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    color="gray"
                    onClick={() =>
                      onResume(entry.projectId || '', entry.description || '')
                    }
                    className={classes.resumeBtn}
                  >
                    <IconPlayerPlay size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Paper>
        );
      })}
    </Stack>
  );
}
