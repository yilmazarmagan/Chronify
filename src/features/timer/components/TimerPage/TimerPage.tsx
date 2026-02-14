import { CreatableMultiSelect } from '@components/CreatableMultiSelect/CreatableMultiSelect';
import { DATE_FORMAT } from '@constants/date.constants';
import { TimerStatusEnum } from '@enums/timer-status.enum';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Container, Group, Select, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAppData } from '@providers/context';
import { IconHash, IconTags } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { RecentEntries } from '../RecentEntries';
import { TimerControls } from '../TimerControls';
import { TimerDisplay } from '../TimerDisplay';
import classes from './TimerPage.module.scss';

export function TimerPage() {
  const { _ } = useLingui();
  const { data, addTimeEntry, addTag } = useAppData();
  const { status, elapsed, start, pause, resume, stop } = useTimer();

  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const startTimeRef = useRef<string | null>(null);

  const handleStart = () => {
    if (!projectId) {
      notifications.show({
        title: _(msg`Project Required`),
        message: _(msg`Please select a project to start the timer.`),
        color: 'red',
      });
      return;
    }

    if (!description.trim()) {
      notifications.show({
        title: _(msg`Description Required`),
        message: _(
          msg`Please enter a description for what you are working on.`,
        ),
        color: 'red',
      });
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = new Date().toISOString();
    }
    start();
  };

  const handleStop = () => {
    const duration = stop();
    const endTime = new Date().toISOString();

    if (duration > 0) {
      addTimeEntry({
        projectId: projectId || undefined,
        description: description,
        startTime: startTimeRef.current || new Date().toISOString(),
        endTime: endTime,
        duration: duration,
        date: dayjs(startTimeRef.current).format(DATE_FORMAT),
        tags: selectedTags,
      });
    }

    // Reset local state
    setDescription('');
    setProjectId(null);
    setSelectedTags([]);
    startTimeRef.current = null;
  };

  const handleResume = (projectId: string, description: string) => {
    setProjectId(projectId);
    setDescription(description);
  };

  const projectOptions = data.projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const tagOptions = data.tags.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  // Helper to add new tags on the fly
  const handleCreateTag = (query: string) => {
    const newTag = addTag({ name: query, color: 'blue' }); // Default color
    return newTag.id;
  };

  if (data.projects.length === 0) {
    // ... (no projects UI remains same)
  }

  return (
    <Container size="sm" py="xl" className={classes.container}>
      <Stack gap="xl" align="center">
        {/* Input Section */}
        <Stack w="100%" gap="xs">
          <Group w="100%" align="flex-end" className={classes.inputGroup}>
            <TextInput
              placeholder={_(msg`What are you working on?`)}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={status !== TimerStatusEnum.Idle}
              size="md"
              className={classes.descriptionInput}
              variant="filled"
            />
            <Select
              placeholder={_(msg`Project`)}
              data={projectOptions}
              value={projectId}
              onChange={setProjectId}
              disabled={status !== TimerStatusEnum.Idle}
              size="md"
              searchable
              clearable
              leftSection={<IconHash size={16} />}
              className={classes.projectSelect}
              variant="filled"
              comboboxProps={{
                transitionProps: { transition: 'pop', duration: 200 },
              }}
            />
          </Group>
          <CreatableMultiSelect
            placeholder={_(msg`Add tags...`)}
            data={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            disabled={status !== TimerStatusEnum.Idle}
            searchable
            clearable
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={handleCreateTag}
            leftSection={<IconTags size={16} />}
            variant="filled"
            size="sm"
            comboboxProps={{
              transitionProps: { transition: 'pop', duration: 200 },
            }}
          />
        </Stack>

        {/* Timer Display */}
        <TimerDisplay elapsed={elapsed} status={status} />

        {/* Controls */}
        <TimerControls
          status={status}
          onStart={handleStart}
          onPause={pause}
          onResume={resume}
          onStop={handleStop}
        />

        {/* Recent Entries */}
        <RecentEntries onResume={handleResume} />
      </Stack>
    </Container>
  );
}
