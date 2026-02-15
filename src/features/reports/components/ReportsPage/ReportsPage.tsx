import { Container, Grid, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconChartBar } from '@tabler/icons-react';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { EmptyState } from '@components/EmptyState';
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
  const { _ } = useLingui();
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

  const hasProjects = data.projects.length > 0;

  const handleExportCSV = () => {
    const selectedProject = data.projects.find(
      (p) => p.id === selectedProjectId,
    );
    exportTimeEntriesToCSV(
      filteredEntries,
      data.projects,
      selectedProject?.name,
    );
  };

  const handleExportPDF = () => {
    const selectedProject = data.projects.find(
      (p) => p.id === selectedProjectId,
    );
    exportTimeEntriesToPDF(
      filteredEntries,
      data.projects,
      selectedProject?.name,
    );
  };

  // Defer heavy chart rendering to ensure smooth navigation
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!hasProjects) {
    return (
      <Container size="lg" py="xl" className={classes.container}>
        <EmptyState
          icon={<IconChartBar size={80} stroke={1.5} />}
          title={_(msg`No Data to Analyze`)}
          description={_(
            msg`Reports and charts will appear here once you have projects and time entries. Create a project to get started!`,
          )}
          actionLabel={_(msg`Create Project`)}
          actionLink="/projects"
        />
      </Container>
    );
  }

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
