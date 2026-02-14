import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Container,
  Grid,
  Group,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconFolderOff, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useAppData } from '../../../../providers/context';
import type { Project } from '../../../../types/project.types';
import {
  calculateTotalDuration,
  formatDurationString,
} from '../../../../utils/date.utils';
import { ProjectCard } from '../ProjectCard';
import { ProjectModal } from '../ProjectModal';
import classes from './ProjectsPage.module.scss';

export function ProjectsPage() {
  const { _ } = useLingui();
  const { data, addProject, updateProject, deleteProject } = useAppData();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const filteredProjects = data.projects.filter(
    (p) => showArchived || p.isActive,
  );

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    open();
  };

  const handleAddNew = () => {
    setEditingProject(null);
    open();
  };

  const handleDelete = (project: Project) => {
    modals.openConfirmModal({
      title: _(msg`Delete Project`),
      children: (
        <Text size="sm">
          {_(
            msg`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`,
          )}
        </Text>
      ),
      labels: { confirm: _(msg`Delete`), cancel: _(msg`Cancel`) },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProject(project.id),
      centered: true,
    });
  };

  const handleSubmit = (
    values: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (editingProject) {
      updateProject(editingProject.id, values);
    } else {
      addProject(values);
    }
  };

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Group justify="space-between" mb="xl">
        <Title order={2}>{_(msg`Projects`)}</Title>
        <Group>
          <Switch
            label={_(msg`Show Archived`)}
            checked={showArchived}
            onChange={(event) => setShowArchived(event.currentTarget.checked)}
            size="sm"
          />
          <Button leftSection={<IconPlus size={20} />} onClick={handleAddNew}>
            {_(msg`New Project`)}
          </Button>
        </Group>
      </Group>

      {filteredProjects.length === 0 ? (
        <Container size="sm" py="xl">
          <Group
            justify="center"
            align="center"
            style={{ flexDirection: 'column', opacity: 0.5 }}
          >
            <IconFolderOff size={64} stroke={1.5} />
            <Text size="lg" fw={500} mt="md">
              {_(msg`No projects found`)}
            </Text>
            <Text size="sm">
              {_(msg`Create your first project to get started.`)}
            </Text>
          </Group>
        </Container>
      ) : (
        <Grid>
          {filteredProjects.map((project) => {
            const projectEntries = data.timeEntries.filter(
              (e) => e.projectId === project.id,
            );
            const totalDuration = calculateTotalDuration(projectEntries);
            const durationString =
              totalDuration > 0
                ? formatDurationString(totalDuration)
                : undefined;

            return (
              <Grid.Col
                key={project.id}
                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
              >
                <ProjectCard
                  project={project}
                  onEdit={() => handleEdit(project)}
                  onDelete={() => handleDelete(project)}
                  totalDuration={durationString}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      )}

      <ProjectModal
        key={editingProject ? `edit-${editingProject.id}` : 'new'}
        opened={opened}
        onClose={() => {
          close();
          setEditingProject(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingProject}
      />
    </Container>
  );
}
