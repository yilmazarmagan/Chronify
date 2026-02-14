import { Badge, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconCalendarOff } from '@tabler/icons-react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAppData } from '../../../../providers/context';
import {
  formatDurationString,
  groupTimeEntriesByDate,
  calculateTotalDuration,
} from '../../../../utils/date.utils';
import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '../../../../constants';
import dayjs from 'dayjs';
import classes from './TimesheetPage.module.scss';
import { TimeEntryCard } from '../TimeEntryCard';
import { TimeEntryModal, TimeEntryFormValues } from '../TimeEntryModal';
import type { TimeEntry } from '../../../../types/time-entry.types';

export function TimesheetPage() {
  const { _ } = useLingui();
  const { data, deleteTimeEntry, updateTimeEntry } = useAppData();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const groupedEntries = groupTimeEntriesByDate(data.timeEntries);
  const sortedDates = Object.keys(groupedEntries).toSorted(
    (a, b) => dayjs(b, DATE_FORMAT).valueOf() - dayjs(a, DATE_FORMAT).valueOf(),
  );

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntry(entry);
    open();
  };

  const handleEditSubmit = (values: TimeEntryFormValues) => {
    if (!editingEntry) return;

    const startTime = dayjs(values.startTime);
    const endTime = values.endTime ? dayjs(values.endTime) : null;

    // Calculate duration in seconds
    const duration = endTime ? endTime.diff(startTime, 'second') : 0;

    updateTimeEntry(editingEntry.id, {
      projectId: values.projectId,
      description: values.description,
      startTime: startTime.toISOString(),
      endTime: endTime?.toISOString(),
      duration,
      date: startTime.format(DATE_FORMAT),
      tags: values.tags,
    });

    close();
  };

  if (data.timeEntries.length === 0) {
    return (
      <Container size="sm" py="xl" h="100%">
        <Stack align="center" justify="center" h="100%" gap="md" opacity={0.5}>
          <IconCalendarOff size={48} stroke={1.5} />
          <Text size="lg" fw={500}>
            {_(msg`No time entries found`)}
          </Text>
          <Text size="sm">{_(msg`Start the timer to track your work.`)}</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl" className={classes.container}>
      <Title order={2} mb="xl">
        {_(msg`Timesheet`)}
      </Title>

      <Stack gap="xl">
        {sortedDates.map((date) => {
          const entries = groupedEntries[date];
          const totalDuration = calculateTotalDuration(entries);
          const formattedDate = dayjs(date, DATE_FORMAT).format(
            DISPLAY_DATE_FORMAT,
          );

          return (
            <div key={date}>
              <Group justify="space-between" mb="sm" align="flex-end">
                <Text fw={600} size="lg" c="dimmed">
                  {formattedDate}
                </Text>
                <Badge variant="light" size="lg" color="gray">
                  {formatDurationString(totalDuration)}
                </Badge>
              </Group>

              <Stack gap="xs">
                {entries
                  .toSorted(
                    (a, b) =>
                      new Date(b.startTime).getTime() -
                      new Date(a.startTime).getTime(),
                  )
                  .map((entry) => (
                    <TimeEntryCard
                      key={entry.id}
                      entry={entry}
                      onDelete={() => deleteTimeEntry(entry.id)}
                      onEdit={() => handleEditClick(entry)}
                      projectName={
                        data.projects.find((p) => p.id === entry.projectId)
                          ?.name
                      }
                      projectColor={
                        data.projects.find((p) => p.id === entry.projectId)
                          ?.color
                      }
                    />
                  ))}
              </Stack>
            </div>
          );
        })}
      </Stack>

      <TimeEntryModal
        opened={opened}
        onClose={close}
        onSubmit={handleEditSubmit}
        initialValues={editingEntry}
      />
    </Container>
  );
}
