import {
  Button,
  ColorInput,
  Group,
  Modal,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useEffect } from 'react';
import type { Project } from '../../../../types/project.types';

interface ProjectFormValues {
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

interface ProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
  initialValues?: Project | null;
}

export function ProjectModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
}: ProjectModalProps) {
  const { _ } = useLingui();

  const form = useForm<ProjectFormValues>({
    initialValues: {
      name: '',
      description: '',
      color: '#E03131',
      isActive: true,
    },
    validate: {
      name: (value) =>
        value.trim().length < 2
          ? _(msg`Name must be at least 2 characters`)
          : null,
    },
  });

  useEffect(() => {
    if (opened) {
      if (initialValues) {
        form.setValues({
          name: initialValues.name,
          description: initialValues.description || '',
          color: initialValues.color,
          isActive: initialValues.isActive,
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
      title={initialValues ? _(msg`Edit Project`) : _(msg`New Project`)}
      centered
    >
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          onClose();
        })}
      >
        <TextInput
          label={_(msg`Project Name`)}
          placeholder={_(msg`Enter project name`)}
          required
          data-autofocus
          mb="md"
          {...form.getInputProps('name')}
        />

        <Textarea
          label={_(msg`Description`)}
          placeholder={_(msg`Optional description`)}
          mb="md"
          autosize
          minRows={2}
          {...form.getInputProps('description')}
        />

        <ColorInput
          label={_(msg`Color`)}
          mb="md"
          format="hex"
          swatches={[
            '#E03131',
            '#228BE6',
            '#7950F2',
            '#12B886',
            '#FD7E14',
            '#E64980',
            '#4C6EF5',
            '#15AABF',
          ]}
          {...form.getInputProps('color')}
        />

        <Switch
          label={_(msg`Active Project`)}
          description={_(
            msg`Inactive projects won't appear in the timer selection`,
          )}
          mb="xl"
          {...form.getInputProps('isActive', { type: 'checkbox' })}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {_(msg`Cancel`)}
          </Button>
          <Button type="submit">
            {initialValues ? _(msg`Save Changes`) : _(msg`Create Project`)}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
