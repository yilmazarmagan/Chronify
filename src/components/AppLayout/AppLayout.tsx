import { AppShell, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  IconClock,
  IconCalendar,
  IconFolder,
  IconChartBar,
  IconSettings,
  IconPlayerPlay,
  IconPlayerPause,
} from '@tabler/icons-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useTimer } from '@providers/TimerProvider';
import { TimerStatusEnum } from '@enums/timer-status.enum';
import { useAppData } from '@providers/context';
import classes from './AppLayout.module.scss';

const NAV_ITEMS = [
  { label: 'Timer', icon: IconClock, path: '/' },
  { label: 'Timesheet', icon: IconCalendar, path: '/timesheet' },
  { label: 'Projects', icon: IconFolder, path: '/projects' },
  { label: 'Reports', icon: IconChartBar, path: '/reports' },
];

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
};

export function AppLayout() {
  const { data } = useAppData();
  const { status, elapsed, activeEntry } = useTimer();
  const [opened] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const activeProject = data.projects.find(
    (p) => p.id === activeEntry.projectId,
  );

  return (
    <AppShell
      navbar={{ width: 220, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <AppShell.Navbar className={classes.navbar}>
        <div className={classes.logo}>
          Chroni<span className={classes.logoAccent}>fy</span>
        </div>

        <div className={classes.navSection}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`${classes.navLink} ${isActive ? classes.navLinkActive : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} stroke={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={classes.navFooter}>
          {status !== TimerStatusEnum.Idle && (
            <div
              className={classes.timerIndicator}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <div className={classes.timerIndicatorHeader}>
                {status === TimerStatusEnum.Running ? (
                  <IconPlayerPlay size={12} fill="currentColor" />
                ) : (
                  <IconPlayerPause size={12} fill="currentColor" />
                )}
                <span className={classes.timerTime}>{formatTime(elapsed)}</span>
              </div>
              <div
                className={classes.timerProject}
                style={{ color: activeProject?.color }}
              >
                {activeProject?.name || 'No Project'}
              </div>
            </div>
          )}

          <button
            className={`${classes.navLink} ${
              location.pathname === '/settings' ? classes.navLinkActive : ''
            }`}
            onClick={() => navigate('/settings')}
          >
            <IconSettings size={20} stroke={1.5} />
            <span>Settings</span>
          </button>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense
          fallback={
            <div
              style={{
                height: 'calc(100vh - 40px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader size="xl" variant="bars" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
