import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useHotkeys } from '@mantine/hooks';
import { IconTags } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { CreatableMultiSelect } from '../../../../components/CreatableMultiSelect/CreatableMultiSelect';
import { useAppData } from '../../../../providers/context';
import type { TimeEntry } from '../../../../types/time-entry.types';

export interface TimeEntryFormValues {
  projectId: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  tags: string[];
}

interface TimeEntryModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: TimeEntryFormValues) => void;
  initialValues?: TimeEntry | null;
}

export function TimeEntryModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
}: TimeEntryModalProps) {
  const { _ } = useLingui();
  const { data, addTag } = useAppData();

  useHotkeys([
    [
      'mod+S',
      () => {
        if (opened) {
          form.onSubmit((values) => {
            onSubmit(values);
            onClose();
          })();
        }
      },
    ],
  ]);

  const projectOptions = data.projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const tagOptions = data.tags.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const handleCreateTag = (query: string) => {
    const newTag = addTag({ name: query, color: 'blue' });
    return newTag.id;
  };

  const form = useForm<TimeEntryFormValues>({
    initialValues: {
      projectId: '',
      description: '',
      startTime: new Date(),
      endTime: null,
      tags: [],
    },
    validate: {
      projectId: (value) => (!value ? _(msg`Project is required`) : null),
      startTime: (value) => (!value ? _(msg`Start time is required`) : null),
      endTime: (value, values) => {
        if (value && dayjs(value).isBefore(dayjs(values.startTime))) {
          return _(msg`End time must be after start time`);
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (opened) {
      if (initialValues) {
        form.setValues({
          projectId: initialValues.projectId || '',
          description: initialValues.description || '',
          startTime: new Date(initialValues.startTime),
          endTime: initialValues.endTime
            ? new Date(initialValues.endTime)
            : null,
          tags: initialValues.tags || [],
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialValues ? _(msg`Edit Time Entry`) : _(msg`New Time Entry`)}
      centered
    >
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          onClose();
        })}
      >
        <Stack>
          <Select
            label={_(msg`Project`)}
            placeholder={_(msg`Select project`)}
            data={projectOptions}
            required
            searchable
            {...form.getInputProps('projectId')}
          />

          <TextInput
            label={_(msg`Description`)}
            placeholder={_(msg`What are you working on?`)}
            {...form.getInputProps('description')}
          />

          <CreatableMultiSelect
            label={_(msg`Tags`)}
            placeholder={_(msg`Select tags`)}
            data={tagOptions}
            searchable
            clearable
            getCreateLabel={(query) => `+ ${query}`}
            onCreate={handleCreateTag}
            leftSection={<IconTags size={16} />}
            {...form.getInputProps('tags')}
          />

          <DateTimePicker
            label={_(msg`Start Time`)}
            placeholder={_(msg`Pick start date and time`)}
            required
            clearable={false}
            {...form.getInputProps('startTime')}
          />

          <DateTimePicker
            label={_(msg`End Time`)}
            placeholder={_(msg`Pick end date and time`)}
            clearable
            {...form.getInputProps('endTime')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              {_(msg`Cancel`)}
            </Button>
            <Button type="submit">
              {initialValues ? _(msg`Save Changes`) : _(msg`Create Entry`)}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
