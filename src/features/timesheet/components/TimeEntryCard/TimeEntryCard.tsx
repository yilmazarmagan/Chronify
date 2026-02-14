import {
  ActionIcon,
  ColorSwatch,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { formatDurationString } from '../../../../utils/date.utils';
import { TIME_FORMAT } from '../../../../constants';
import dayjs from 'dayjs';
import classes from './TimeEntryCard.module.scss';
import type { TimeEntry } from '../../../../types/time-entry.types';

interface TimeEntryCardProps {
  entry: TimeEntry;
  onDelete: () => void;
  projectName?: string;
  projectColor?: string;
}

export function TimeEntryCard({
  entry,
  onDelete,
  projectName,
  projectColor,
}: TimeEntryCardProps) {
  const { _ } = useLingui();
  const startTime = dayjs(entry.startTime).format(TIME_FORMAT);
  const endTime = entry.endTime ? dayjs(entry.endTime).format(TIME_FORMAT) : '';

  return (
    <Paper className={classes.card}>
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md">
          <ColorSwatch color={projectColor || 'gray'} size={10} radius="xl" />
          <Stack gap={0}>
            <Text size="sm" fw={500} lineClamp={1}>
              {entry.description || _(msg`No description`)}
            </Text>
            <Text size="xs" c="dimmed">
              {projectName || _(msg`No Project`)} • {startTime} - {endTime}
            </Text>
          </Stack>
        </Group>

        <Group gap="sm">
          <Text size="sm" fw={600} className={classes.duration}>
            {formatDurationString(entry.duration)}
          </Text>
          <Tooltip label={_(msg`Delete entry`)}>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={onDelete}
              className={classes.deleteBtn}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
}
