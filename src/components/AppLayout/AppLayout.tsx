import { AppShell, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  IconClock,
  IconCalendar,
  IconFolder,
  IconChartBar,
  IconSettings,
} from '@tabler/icons-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import classes from './AppLayout.module.scss';

const NAV_ITEMS = [
  { label: 'Timer', icon: IconClock, path: '/' },
  { label: 'Timesheet', icon: IconCalendar, path: '/timesheet' },
  { label: 'Projects', icon: IconFolder, path: '/projects' },
  { label: 'Reports', icon: IconChartBar, path: '/reports' },
];

export function AppLayout() {
  const [opened] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

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
