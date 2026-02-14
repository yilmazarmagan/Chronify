import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  ActionIcon,
  Badge,
  ColorSwatch,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TIME_FORMAT } from '../../../../constants';
import type { TimeEntry } from '../../../../types/time-entry.types';
import { formatDurationString } from '../../../../utils/date.utils';
import { useAppData } from '../../../../providers/context';
import classes from './TimeEntryCard.module.scss';

interface TimeEntryCardProps {
  entry: TimeEntry;
  onDelete: () => void;
  onEdit: () => void;
  projectName?: string;
  projectColor?: string;
}

export function TimeEntryCard({
  entry,
  onDelete,
  onEdit,
  projectName,
  projectColor,
}: TimeEntryCardProps) {
  const { _ } = useLingui();
  const { data } = useAppData();
  const startTime = dayjs(entry.startTime).format(TIME_FORMAT);
  const endTime = entry.endTime ? dayjs(entry.endTime).format(TIME_FORMAT) : '';

  return (
    <Paper className={classes.card}>
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md">
          <ColorSwatch color={projectColor || 'gray'} size={10} radius="xl" />
          <Stack gap={2}>
            <Text size="sm" fw={500} lineClamp={1}>
              {entry.description || _(msg`No description`)}
            </Text>
            <Group gap={6} wrap="wrap">
              <Text size="xs" c="dimmed">
                {projectName || _(msg`No Project`)} • {startTime} - {endTime}
              </Text>
              {entry.tags && entry.tags.length > 0 && (
                <Group gap={4}>
                  {entry.tags.map((tagId) => {
                    const tag = data.tags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tagId}
                        variant="dot"
                        size="xs"
                        color={tag.color}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </Group>
              )}
            </Group>
          </Stack>
        </Group>

        <Group gap="xs">
          <Text size="sm" fw={600} className={classes.duration} mr="xs">
            {formatDurationString(entry.duration)}
          </Text>

          <Group gap={4}>
            <Tooltip label={_(msg`Edit entry`)}>
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={onEdit}
                size="sm"
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={_(msg`Delete entry`)}>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={onDelete}
                size="sm"
                className={classes.deleteBtn}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Group>
    </Paper>
  );
}
