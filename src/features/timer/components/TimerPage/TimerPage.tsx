import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconFolderPlus, IconHash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { DATE_FORMAT } from '../../../../constants';
import { TimerStatusEnum } from '../../../../enums';
import { useAppData } from '../../../../providers/AppDataProvider';
import { useTimer } from '../../hooks/useTimer';
import { RecentEntries } from '../RecentEntries';
import { TimerControls } from '../TimerControls';
import { TimerDisplay } from '../TimerDisplay';
import classes from './TimerPage.module.scss';

export function TimerPage() {
  const { _ } = useLingui();
  const navigate = useNavigate();
  const { data, addTimeEntry } = useAppData();
  const { status, elapsed, start, pause, resume, stop } = useTimer();

  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
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
        tags: [],
      });
    }

    // Reset local state
    setDescription('');
    setProjectId(null);
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

  if (data.projects.length === 0) {
    return (
      <Container size="sm" py={80}>
        <Paper p="xl" radius="md" withBorder ta="center">
          <IconFolderPlus
            size={50}
            stroke={1.5}
            color="var(--mantine-color-blue-6)"
          />
          <Title order={3} mt="md">
            {_(msg`No Projects Found`)}
          </Title>
          <Text c="dimmed" mt="xs" mb="xl">
            {_(
              msg`You need to create a project before you can start tracking time.`,
            )}
          </Text>
          <Button onClick={() => navigate('/projects')}>
            {_(msg`Create Project`)}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl" className={classes.container}>
      <Stack gap="xl" align="center">
        {/* Input Section */}
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
