import { useAppData } from '../../../providers/context';
import {
  calculateTotalDuration,
  getEarliestTimeEntryDate,
} from '../../../utils/date.utils';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { ReportRangeEnum } from '../../../enums';

export type DateRangeValue = [Date | null, Date | null];

export function useReportsData() {
  const { data } = useAppData();

  const [dateRange, setDateRange] = useState<DateRangeValue>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);
  const [rangeType, setRangeType] = useState<ReportRangeEnum>(
    ReportRangeEnum.Month,
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const handleRangeTypeChange = (value: string) => {
    const range = value as ReportRangeEnum;
    setRangeType(range);
    const now = dayjs();
    let start, end;

    switch (range) {
      case ReportRangeEnum.Today:
        start = now.startOf('day');
        end = now.endOf('day');
        break;
      case ReportRangeEnum.Week:
        start = now.startOf('week'); // depends on locale
        end = now.endOf('week');
        break;
      case ReportRangeEnum.Month:
        start = now.startOf('month');
        end = now.endOf('month');
        break;
      case ReportRangeEnum.Year:
        start = now.startOf('year');
        end = now.endOf('year');
        break;
      case ReportRangeEnum.All:
        start = getEarliestTimeEntryDate(data.timeEntries).startOf('day');
        end = now.endOf('day');
        break;
      default:
        return;
    }
    setDateRange([start.toDate(), end.toDate()]);
  };
  const filteredEntries = useMemo(() => {
    const [start, end] = dateRange;
    if (!start || !end) return [];

    const s = dayjs(start).startOf('day');
    const e = dayjs(end).endOf('day');

    return data.timeEntries.filter((entry) => {
      if (!entry.endTime) return false;

      const entryDate = dayjs(entry.startTime);
      const isWithinDateRange =
        (entryDate.isAfter(s) || entryDate.isSame(s)) &&
        (entryDate.isBefore(e) || entryDate.isSame(e));

      const matchesProject =
        !selectedProjectId || entry.projectId === selectedProjectId;

      return isWithinDateRange && matchesProject;
    });
  }, [data.timeEntries, dateRange, selectedProjectId]);

  const totalDuration = useMemo(
    () => calculateTotalDuration(filteredEntries),
    [filteredEntries],
  );

  const projectChartData = useMemo(() => {
    const stats: Record<string, number> = {};

    filteredEntries.forEach((entry) => {
      if (!entry.projectId) return;
      stats[entry.projectId] = (stats[entry.projectId] || 0) + entry.duration;
    });

    const chartData = Object.entries(stats).map(([projectId, duration]) => {
      const project = data.projects.find((p) => p.id === projectId);
      return {
        name: project ? project.name : 'Unknown',
        value: Number((duration / 3600).toFixed(2)), // Hours
        color: project ? project.color : 'gray',
      };
    });

    return [...chartData].sort((a, b) => b.value - a.value);
  }, [filteredEntries, data.projects]);

  const dailyChartData = useMemo(() => {
    const stats: Record<string, number> = {};
    const [start, end] = dateRange;
    if (!start || !end) return [];

    let current = dayjs(start).startOf('day');
    const endDate = dayjs(end).endOf('day');

    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      const dateKey = current.format('YYYY-MM-DD');
      stats[dateKey] = 0;
      current = current.add(1, 'day');
    }

    filteredEntries.forEach((entry) => {
      const dateKey = dayjs(entry.startTime).format('YYYY-MM-DD');
      if (stats[dateKey] !== undefined) {
        stats[dateKey] += entry.duration;
      }
    });

    return Object.entries(stats).map(([date, duration]) => ({
      date: dayjs(date).format('DD MMM'),
      Duration: Number((duration / 3600).toFixed(2)),
    }));
  }, [filteredEntries, dateRange]);

  const mostActiveProject = useMemo(() => {
    if (projectChartData.length === 0) return null;
    return projectChartData[0];
  }, [projectChartData]);

  return {
    dateRange,
    setDateRange,
    rangeType,
    setRangeType,
    handleRangeTypeChange,
    selectedProjectId,
    setSelectedProjectId,
    filteredEntries,
    totalDuration,
    projectChartData,
    dailyChartData,
    mostActiveProject,
  };
}
