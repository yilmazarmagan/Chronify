import { EmptyState } from '@components/EmptyState';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  Badge,
  Box,
  Container,
  Group,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendarOff,
  IconFolderPlus,
  IconHash,
  IconSearch,
  IconTags,
  IconX,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '../../../../constants';
import { useAppData } from '../../../../providers/context';
import type { TimeEntry } from '../../../../types/time-entry.types';
import {
  calculateTotalDuration,
  formatDurationString,
  groupTimeEntriesByDate,
} from '../../../../utils/date.utils';
import { TimeEntryCard } from '../TimeEntryCard';
import { TimeEntryFormValues, TimeEntryModal } from '../TimeEntryModal';
import classes from './TimesheetPage.module.scss';

export function TimesheetPage() {
  const { _ } = useLingui();
  const { data, deleteTimeEntry, updateTimeEntry } = useAppData();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const hasProjects = data.projects.length > 0;

  const filteredEntries = useMemo(() => {
    return data.timeEntries.filter((entry) => {
      const matchesSearch =
        !searchQuery ||
        entry.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = !projectId || entry.projectId === projectId;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tagId) => entry.tags?.includes(tagId));

      return matchesSearch && matchesProject && matchesTags;
    });
  }, [data.timeEntries, searchQuery, projectId, selectedTags]);

  const groupedEntries = groupTimeEntriesByDate(filteredEntries);
  const sortedDates = Object.keys(groupedEntries).toSorted(
    (a, b) => dayjs(b, DATE_FORMAT).valueOf() - dayjs(a, DATE_FORMAT).valueOf(),
  );

  const projectOptions = data.projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const tagOptions = data.tags.map((t) => ({
    value: t.id,
    label: t.name,
  }));

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

  if (!hasProjects) {
    return (
      <Container size="sm" py="xl" className={classes.container}>
        <EmptyState
          icon={<IconFolderPlus size={80} stroke={1.5} />}
          title={_(msg`No Projects Found`)}
          description={_(
            msg`You need projects before you can see your work history. Start by creating one.`,
          )}
          actionLabel={_(msg`Create Project`)}
          actionLink="/projects"
        />
      </Container>
    );
  }

  if (data.timeEntries.length === 0) {
    return (
      <Container size="sm" py="xl" className={classes.container}>
        <EmptyState
          icon={<IconCalendarOff size={80} stroke={1.5} />}
          title={_(msg`No Entries Yet`)}
          description={_(
            msg`Your time entries will show up here. Start the timer to track your productivity!`,
          )}
          actionLabel={_(msg`Start Timer`)}
          actionLink="/"
        />
      </Container>
    );
  }

  return (
    <Container size="md" py="xl" className={classes.container}>
      <Group justify="space-between" mb="xl">
        <Title order={2}>{_(msg`Timesheet`)}</Title>
      </Group>

      {/* Filter Section */}
      <Stack mb="xl" gap="xs">
        <Group grow align="flex-end">
          <TextInput
            placeholder={_(msg`Search descriptions...`)}
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            rightSection={
              searchQuery && (
                <IconX
                  size={16}
                  onClick={() => setSearchQuery('')}
                  style={{ cursor: 'pointer' }}
                />
              )
            }
          />
          <Select
            placeholder={_(msg`Filter by project`)}
            leftSection={<IconHash size={16} />}
            data={projectOptions}
            value={projectId}
            onChange={setProjectId}
            clearable
          />
          <MultiSelect
            placeholder={_(msg`Filter by tags`)}
            leftSection={<IconTags size={16} />}
            data={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            clearable
            maxValues={3}
          />
        </Group>
        {(searchQuery || projectId || selectedTags.length > 0) && (
          <Group gap="xs">
            <Badge
              variant="outline"
              color="teal"
              radius="sm"
              styles={{
                root: { borderStyle: 'dashed', height: 28 },
                label: { textTransform: 'none', fontWeight: 500 },
              }}
            >
              {filteredEntries.length} {_(msg`entries found`)}
            </Badge>
            <Text
              size="xs"
              c="dimmed"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSearchQuery('');
                setProjectId(null);
                setSelectedTags([]);
              }}
            >
              {_(msg`Clear all filters`)}
            </Text>
          </Group>
        )}
      </Stack>

      <Stack gap="xl">
        {sortedDates.map((date) => {
          const entries = groupedEntries[date];
          const totalDuration = calculateTotalDuration(entries);
          const formattedDate = dayjs(date, DATE_FORMAT).format(
            DISPLAY_DATE_FORMAT,
          );

          return (
            <Box key={date}>
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
            </Box>
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
