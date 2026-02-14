import type { DateRangeValue } from '../../hooks/useReportsData';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Group,
  Menu,
  SegmentedControl,
  Select,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconCalendar,
  IconDownload,
  IconFileSpreadsheet,
  IconFileTypePdf,
  IconHash,
} from '@tabler/icons-react';
import { ReportRangeEnum } from '../../../../enums';

interface ReportsHeaderProps {
  rangeType: ReportRangeEnum;
  onRangeTypeChange: (value: string) => void;
  dateRange: DateRangeValue;
  onDateRangeChange: (val: DateRangeValue) => void;
  onRangeTypeSelect: (val: ReportRangeEnum) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  selectedProjectId: string | null;
  onProjectChange: (val: string | null) => void;
  projects: { id: string; name: string }[];
}

export function ReportsHeader({
  rangeType,
  onRangeTypeChange,
  dateRange,
  onDateRangeChange,
  onRangeTypeSelect,
  onExportCSV,
  onExportPDF,
  selectedProjectId,
  onProjectChange,
  projects,
}: ReportsHeaderProps) {
  const { _ } = useLingui();

  const projectOptions = [
    { label: _(msg`All Projects`), value: 'all' },
    ...projects.map((p) => ({ label: p.name, value: p.id })),
  ];

  return (
    <Group justify="space-between" align="center" mb="xl">
      <Title order={2}>{_(msg`Reports`)}</Title>
      <Group>
        <SegmentedControl
          value={rangeType}
          onChange={onRangeTypeChange}
          data={[
            { label: _(msg`Today`), value: ReportRangeEnum.Today },
            { label: _(msg`Week`), value: ReportRangeEnum.Week },
            { label: _(msg`Month`), value: ReportRangeEnum.Month },
            { label: _(msg`Year`), value: ReportRangeEnum.Year },
            { label: _(msg`All`), value: ReportRangeEnum.All },
          ]}
        />

        <Select
          placeholder={_(msg`All Projects`)}
          data={projectOptions}
          value={selectedProjectId || 'all'}
          onChange={(val) => onProjectChange(val === 'all' ? null : val)}
          leftSection={<IconHash size={16} />}
          w={180}
        />

        <DatePickerInput
          type="range"
          placeholder={_(msg`Pick dates range`)}
          value={dateRange}
          onChange={(val) => {
            onDateRangeChange(val);
            onRangeTypeSelect(ReportRangeEnum.Custom);
          }}
          leftSection={<IconCalendar size={16} />}
          clearable
          w={220}
        />

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              {_(msg`Export`)}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{_(msg`Download Report`)}</Menu.Label>
            <Menu.Item
              leftSection={<IconFileSpreadsheet size={16} />}
              onClick={onExportCSV}
            >
              {_(msg`Export as CSV`)}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconFileTypePdf size={16} />}
              onClick={onExportPDF}
            >
              {_(msg`Export as PDF`)}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
