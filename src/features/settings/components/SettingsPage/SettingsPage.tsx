import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  ColorSwatch,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { locales, type Locale } from '../../../../lib/i18n';
import { useAppData } from '../../../../providers/AppDataProvider';
import { COLOR_PRESETS } from '../../../../styles/theme';

export function SettingsPage() {
  const { _ } = useLingui();
  const { data, updateSettings } = useAppData();

  return (
    <Stack gap="xl">
      <Group gap="sm">
        <IconSettings size={28} stroke={1.5} />
        <Title order={2}>{_(msg`Settings`)}</Title>
      </Group>

      {/* Accent Color */}
      <Paper p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          {_(msg`Accent Color`)}
        </Title>
        <Text c="dimmed" size="sm" mb="md">
          {_(msg`Choose the primary color for the app`)}
        </Text>
        <SimpleGrid cols={8} spacing="sm">
          {COLOR_PRESETS.map((preset) => (
            <ColorSwatch
              key={preset.hex}
              color={preset.hex}
              size={40}
              onClick={() => updateSettings({ primaryColor: preset.hex })}
              style={{
                cursor: 'pointer',
                outline:
                  data.settings.primaryColor === preset.hex
                    ? '3px solid var(--mantine-color-white)'
                    : 'none',
                outlineOffset: 2,
              }}
            />
          ))}
        </SimpleGrid>
      </Paper>

      {/* Language */}
      <Paper p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          {_(msg`Language`)}
        </Title>
        <SegmentedControl
          value={data.settings.locale}
          onChange={(val) => updateSettings({ locale: val as Locale })}
          data={(Object.entries(locales) as [string, string][]).map(
            ([key, label]) => ({
              value: key,
              label,
            }),
          )}
        />
      </Paper>
    </Stack>
  );
}
