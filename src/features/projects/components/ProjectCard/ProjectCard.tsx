import {
  ActionIcon,
  Card,
  ColorSwatch,
  Group,
  Menu,
  Text,
  Badge,
} from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import type { Project } from '../../../../types/project.types';
import classes from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  totalDuration?: string;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  totalDuration,
}: ProjectCardProps) {
  const { _ } = useLingui();

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      padding="lg"
      className={classes.card}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group gap="xs">
            <ColorSwatch color={project.color} size={16} />
            <Text fw={600} truncate>
              {project.name}
            </Text>
          </Group>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={onEdit}>
                {_(msg`Edit`)}
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={onDelete}
              >
                {_(msg`Delete`)}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Text
        size="sm"
        c="dimmed"
        mt="md"
        lineClamp={3}
        className={classes.description}
      >
        {project.description || _(msg`No description`)}
      </Text>

      <Group mt="md" justify="space-between">
        <Group gap="xs">
          {project.isActive ? (
            <Badge color="green" variant="light" size="sm">
              {_(msg`Active`)}
            </Badge>
          ) : (
            <Badge color="gray" variant="light" size="sm">
              {_(msg`Archived`)}
            </Badge>
          )}
        </Group>

        {totalDuration && (
          <Text size="xs" c="dimmed" className={classes.duration}>
            {totalDuration}
          </Text>
        )}
      </Group>
    </Card>
  );
}
