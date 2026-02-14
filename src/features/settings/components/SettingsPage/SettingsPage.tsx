import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  ColorSwatch,
  FileButton,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconDownload,
  IconExclamationCircle,
  IconSettings,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { locales, type Locale } from '../../../../lib/i18n';
import { useAppData } from '../../../../providers/context';
import { COLOR_PRESETS } from '../../../../styles/theme';
import { downloadFile } from '../../../../utils/export.utils';
import { DEFAULT_APP_DATA } from '../../../../types/app-data.types';

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
        reader.onload = (e) => {
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
          } catch (error) {
            notifications.show({
              title: _(msg`Import Failed`),
              message: _(
                msg`The selected file is not a valid Chronify backup.`,
              ),
              color: 'red',
              icon: <IconExclamationCircle size={16} />,
            });
          }
        };
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
    </Stack>
  );
}
