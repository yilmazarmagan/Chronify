import { Title, Text, Stack } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

export function ReportsPage() {
  const { _ } = useLingui();

  return (
    <Stack align="center" justify="center" h="100%" gap="md">
      <IconChartBar size={64} stroke={1.2} color="var(--mantine-color-primary-filled)" />
      <Title order={2}>{_(msg`Reports`)}</Title>
      <Text c="dimmed">{_(msg`View your reports and statistics`)}</Text>
    </Stack>
  );
}
