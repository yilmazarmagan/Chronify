import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { TimerPage } from '../features/timer/components/TimerPage';
import { TimesheetPage } from '../features/timesheet/components/TimesheetPage';
import { ProjectsPage } from '../features/projects/components/ProjectsPage';
import { ReportsPage } from '../features/reports/components/ReportsPage';
import { SettingsPage } from '../features/settings/components/SettingsPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<TimerPage />} />
          <Route path="/timesheet" element={<TimesheetPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
