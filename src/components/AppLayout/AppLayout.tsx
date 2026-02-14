import { TimerStatusEnum } from '@enums/timer-status.enum';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { AppShell, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppData } from '@providers/context';
import { useTimer } from '@providers/TimerProvider';
import {
  IconCalendar,
  IconChartBar,
  IconClock,
  IconFolder,
  IconPlayerPause,
  IconPlayerPlay,
  IconSettings,
} from '@tabler/icons-react';
import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import classes from './AppLayout.module.scss';
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
};

export function AppLayout() {
  const { _ } = useLingui();
  const { data } = useAppData();
  const { status, elapsed, activeEntry } = useTimer();
  const [opened] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { label: _(msg`Timer`), icon: IconClock, path: '/' },
    { label: _(msg`Timesheet`), icon: IconCalendar, path: '/timesheet' },
    { label: _(msg`Projects`), icon: IconFolder, path: '/projects' },
    { label: _(msg`Reports`), icon: IconChartBar, path: '/reports' },
  ];

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
                <span>{_(item.label)}</span>
              </button>
            );
          })}
        </div>

        <div className={classes.navFooter}>
          <div className={classes.version}>v0.1.0</div>
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
                {activeProject?.name || _(msg`No Project`)}
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
            <span>{_(msg`Settings`)}</span>
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
