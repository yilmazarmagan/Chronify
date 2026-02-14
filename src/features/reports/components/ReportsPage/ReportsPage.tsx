import { Container, Grid, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { DailyActivityChart } from '../DailyActivityChart';
import { ProjectDistributionChart } from '../ProjectDistributionChart';
import { ReportsHeader } from '../ReportsHeader';
import { StatsCards } from '../StatsCards';
import { useReportsData } from '../../hooks/useReportsData';
import {
  exportTimeEntriesToCSV,
  exportTimeEntriesToPDF,
} from '../../../../utils/export.utils';
import { useAppData } from '../../../../providers/context';
import classes from './ReportsPage.module.scss';

export function ReportsPage() {
  const { data } = useAppData();
  const {
    rangeType,
    handleRangeTypeChange,
    dateRange,
    setDateRange,
    setRangeType,
    selectedProjectId,
    setSelectedProjectId,
    filteredEntries,
    totalDuration,
    projectChartData,
    dailyChartData,
    mostActiveProject,
  } = useReportsData();

  const handleExportCSV = () => {
    exportTimeEntriesToCSV(filteredEntries, data.projects);
  };

  const handleExportPDF = () => {
    exportTimeEntriesToPDF(filteredEntries, data.projects);
  };

  // Defer heavy chart rendering to ensure smooth navigation
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <ReportsHeader
        rangeType={rangeType}
        onRangeTypeChange={handleRangeTypeChange}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRangeTypeSelect={setRangeType}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        projects={data.projects}
      />

      <StatsCards
        totalDuration={totalDuration}
        filteredEntriesCount={filteredEntries.length}
        mostActiveProject={mostActiveProject}
      />

      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          {isReady ? (
            <ProjectDistributionChart data={projectChartData} />
          ) : (
            <Skeleton h={350} radius="md" />
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          {isReady ? (
            <DailyActivityChart data={dailyChartData} />
          ) : (
            <Skeleton h={350} radius="md" />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
