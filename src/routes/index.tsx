import { Container, Center, Loader } from '@mantine/core';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';

// Lazy load pages for better performance
const TimerPage = lazy(() =>
  import('../features/timer/components/TimerPage').then((m) => ({
    default: m.TimerPage,
  })),
);
const TimesheetPage = lazy(() =>
  import('../features/timesheet/components/TimesheetPage').then((m) => ({
    default: m.TimesheetPage,
  })),
);
const ProjectsPage = lazy(() =>
  import('../features/projects/components/ProjectsPage').then((m) => ({
    default: m.ProjectsPage,
  })),
);
const ReportsPage = lazy(() =>
  import('../features/reports/components/ReportsPage').then((m) => ({
    default: m.ReportsPage,
  })),
);
const SettingsPage = lazy(() =>
  import('../features/settings/components/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  })),
);

const PageLoader = () => (
  <Container h="100vh">
    <Center h="100%">
      <Loader size="xl" variant="bars" />
    </Center>
  </Container>
);

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<TimerPage />} />
            <Route path="/timesheet" element={<TimesheetPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
