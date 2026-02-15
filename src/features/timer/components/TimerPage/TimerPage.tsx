import { CreatableMultiSelect } from '@components/CreatableMultiSelect/CreatableMultiSelect';
import { DATE_FORMAT } from '@constants/date.constants';
import { TimerStatusEnum } from '@enums/timer-status.enum';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Container, Group, Select, Stack, TextInput } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAppData } from '@providers/context';
import { useTimer } from '@providers/TimerProvider';
import { IconFolderPlus, IconHash, IconTags } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { EmptyState } from '@components/EmptyState';
import { RecentEntries } from '../RecentEntries';
import { TimerControls } from '../TimerControls';
import { TimerDisplay } from '../TimerDisplay';
import classes from './TimerPage.module.scss';

export function TimerPage() {
  const { _ } = useLingui();
  const { data, addTimeEntry, addTag } = useAppData();
  const {
    status,
    elapsed,
    start,
    pause,
    resume,
    stop,
    activeEntry,
    setMetadata,
  } = useTimer();

  const hasProjects = data.projects.length > 0;

  useHotkeys([
    [
      'space',
      () => {
        if (!hasProjects) return;
        if (status === TimerStatusEnum.Idle) handleStart();
        else if (status === TimerStatusEnum.Running) pause();
        else if (status === TimerStatusEnum.Paused) resume();
      },
    ],
  ]);

  const handleStart = () => {
    if (!activeEntry.projectId) {
      notifications.show({
        title: _(msg`Project Required`),
        message: _(msg`Please select a project to start the timer.`),
        color: 'red',
      });
      return;
    }

    if (!activeEntry.description.trim()) {
      notifications.show({
        title: _(msg`Description Required`),
        message: _(
          msg`Please enter a description for what you are working on.`,
        ),
        color: 'red',
      });
      return;
    }

    start(activeEntry.projectId, activeEntry.description, activeEntry.tags);
  };

  const handleStop = () => {
    const result = stop();

    if (result.duration > 0) {
      addTimeEntry({
        projectId: result.projectId,
        description: result.description,
        startTime: result.startTime,
        endTime: result.endTime,
        duration: result.duration,
        date: dayjs(result.startTime).format(DATE_FORMAT),
        tags: result.tags,
      });
    }
  };

  const handleResume = (projectId: string, description: string) => {
    setMetadata({ projectId, description });
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

  if (!hasProjects) {
    return (
      <Container size="sm" py="xl" className={classes.container}>
        <EmptyState
          icon={<IconFolderPlus size={80} stroke={1.5} />}
          title={_(msg`No Projects Yet`)}
          description={_(
            msg`You need at least one project to start tracking time. Create your first project to get things moving!`,
          )}
          actionLabel={_(msg`Create Project`)}
          actionLink="/projects"
        />
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl" className={classes.container}>
      <Stack gap="xl" align="center">
        {/* Input Section */}
        <Stack w="100%" gap="xs" maw={600} mx="auto">
          <Group w="100%" align="flex-end" wrap="nowrap">
            <TextInput
              placeholder={_(msg`What are you working on?`)}
              value={activeEntry.description}
              onChange={(e) =>
                setMetadata({ description: e.currentTarget.value })
              }
              disabled={status !== TimerStatusEnum.Idle}
              size="md"
              className={classes.descriptionInput}
              variant="filled"
            />
            <Select
              placeholder={_(msg`Project`)}
              data={projectOptions}
              value={activeEntry.projectId || null}
              onChange={(val) => setMetadata({ projectId: val || undefined })}
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
            value={activeEntry.tags}
            onChange={(tags) => setMetadata({ tags })}
            disabled={status !== TimerStatusEnum.Idle}
            searchable
            clearable
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={handleCreateTag}
            leftSection={<IconTags size={16} />}
            variant="filled"
            size="md"
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
