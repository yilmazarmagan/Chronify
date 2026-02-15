import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Center,
  ColorSwatch,
  FileButton,
  Group,
  NumberInput,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconDeviceDesktop,
  IconDownload,
  IconExclamationCircle,
  IconMoon,
  IconSettings,
  IconSun,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { locales, type Locale } from '../../../../lib/i18n';
import { useAppData } from '../../../../providers/context';
import { COLOR_PRESETS } from '../../../../styles/theme';
import { DEFAULT_APP_DATA } from '../../../../types/app-data.types';
import { downloadFile } from '../../../../utils/export.utils';

export function SettingsPage() {
  const { _ } = useLingui();
  const { data, updateSettings, setAllData } = useAppData();

  const handleExportBackup = () => {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(
      jsonString,
      `chronify_backup_${new Date().toISOString().split('T')[0]}.json`,
      'application/json',
    );
  };

  const handleImportBackup = (file: File | null) => {
    if (!file) return;

    modals.openConfirmModal({
      title: _(msg`Confirm Backup Restoration`),
      children: (
        <Text size="sm">
          {_(
            msg`This will overwrite all your current data with the backup file. This action cannot be undone.`,
          )}
        </Text>
      ),
      labels: { confirm: _(msg`Import Now`), cancel: _(msg`Cancel`) },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            // Basic validation
            if (!importedData.projects || !importedData.timeEntries) {
              throw new Error('Invalid backup file');
            }
            setAllData(importedData);
            notifications.show({
              title: _(msg`Backup Restored`),
              message: _(msg`Your data has been successfully imported.`),
              color: 'green',
              icon: <IconCheck size={16} />,
            });
          } catch {
            notifications.show({
              title: _(msg`Import Failed`),
              message: _(
                msg`The selected file is not a valid Chronify backup.`,
              ),
              color: 'red',
              icon: <IconExclamationCircle size={16} />,
            });
          }
        });
        reader.readAsText(file);
      },
    });
  };

  const handleResetData = () => {
    modals.openConfirmModal({
      title: _(msg`Reset All Data?`),
      children: (
        <Text size="sm">
          {_(
            msg`Are you sure you want to delete all entries, projects, and settings? This action is permanent.`,
          )}
        </Text>
      ),
      labels: { confirm: _(msg`Yes, Reset All`), cancel: _(msg`Cancel`) },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        setAllData(DEFAULT_APP_DATA);
        notifications.show({
          title: _(msg`Data Reset`),
          message: _(msg`All data has been cleared.`),
          color: 'blue',
          icon: <IconTrash size={16} />,
        });
      },
    });
  };

  return (
    <Stack gap="xl">
      <Group gap="sm">
        <IconSettings size={28} stroke={1.5} />
        <Title order={2}>{_(msg`Settings`)}</Title>
      </Group>

      {/* Appearance */}
      <Paper p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          {_(msg`Appearance`)}
        </Title>
        <Stack gap="md">
          <Box>
            <Text size="sm" fw={500} mb="xs">
              {_(msg`Theme`)}
            </Text>
            <SegmentedControl
              value={data.settings.theme}
              onChange={(val) =>
                updateSettings({ theme: val as 'dark' | 'light' | 'auto' })
              }
              data={[
                {
                  value: 'auto',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconDeviceDesktop size={16} />
                      <span>{_(msg`System`)}</span>
                    </Center>
                  ),
                },
                {
                  value: 'light',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconSun size={16} />
                      <span>{_(msg`Light`)}</span>
                    </Center>
                  ),
                },
                {
                  value: 'dark',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconMoon size={16} />
                      <span>{_(msg`Dark`)}</span>
                    </Center>
                  ),
                },
              ]}
            />
          </Box>

          <Box>
            <Text size="sm" fw={500} mb="xs">
              {_(msg`Accent Color`)}
            </Text>
            <Text c="dimmed" size="xs" mb="md">
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
                        ? '3px solid var(--mantine-color-primary-6)'
                        : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
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

      {/* Notifications */}
      <Paper p="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          {_(msg`Notifications & Reminders`)}
        </Title>
        <Stack gap="md">
          <Box>
            <Group justify="space-between" align="center" mb="sm">
              <Box>
                <Text size="sm" fw={500}>
                  {_(msg`Idle Reminder`)}
                </Text>
                <Text c="dimmed" size="xs">
                  {_(
                    msg`Show a notification if you use computer but haven't started your timer.`,
                  )}
                </Text>
              </Box>
              <Switch
                checked={data.settings.idleReminderEnabled}
                onChange={(event) =>
                  updateSettings({
                    idleReminderEnabled: event.currentTarget.checked,
                  })
                }
              />
            </Group>

            {data.settings.idleReminderEnabled && (
              <Group align="center" mt="xs">
                <NumberInput
                  label={_(msg`Reminder Threshold`)}
                  value={data.settings.idleReminderMinutes}
                  onChange={(val) =>
                    updateSettings({ idleReminderMinutes: Number(val) || 1 })
                  }
                  min={1}
                  max={120}
                  step={1}
                  w={120}
                  suffix={_(msg` min`)}
                />
              </Group>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Data Management */}
      <Paper p="lg" radius="md" withBorder>
        <Title order={4} mb="md" c="red">
          {_(msg`Data Management`)}
        </Title>
        <Text c="dimmed" size="sm" mb="xl">
          {_(
            msg`Export your data for backup or import an existing backup file.`,
          )}
        </Text>

        <Group>
          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={handleExportBackup}
          >
            {_(msg`Export Backup (JSON)`)}
          </Button>

          <FileButton onChange={handleImportBackup} accept="application/json">
            {(props) => (
              <Button
                {...props}
                variant="light"
                color="blue"
                leftSection={<IconUpload size={16} />}
              >
                {_(msg`Import Backup`)}
              </Button>
            )}
          </FileButton>

          <Button
            variant="subtle"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={handleResetData}
          >
            {_(msg`Reset All Data`)}
          </Button>
        </Group>
      </Paper>
      <Box py="xl" style={{ textAlign: 'center' }}>
        <Text size="xs" c="dimmed" ta="center" mt="xl">
          {_(msg`Version`)} v0.1.0
        </Text>
      </Box>
    </Stack>
  );
}
