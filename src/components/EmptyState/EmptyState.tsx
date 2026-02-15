import { Box, Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
}: EmptyStateProps) {
  return (
    <Center py={100}>
      <Stack align="center" gap="md" maw={400} ta="center">
        <Box style={{ opacity: 0.6, fontSize: 0 }}>{icon}</Box>
        <Stack gap={4}>
          <Title order={3}>{title}</Title>
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        </Stack>
        {actionLink && actionLabel && (
          <Button
            component={Link}
            to={actionLink}
            leftSection={<IconPlus size={18} />}
            variant="light"
            radius="md"
            mt="md"
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
