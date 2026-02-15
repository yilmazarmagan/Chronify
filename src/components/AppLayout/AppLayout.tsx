import { TimerStatusEnum } from '@enums/timer-status.enum';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import {
  AppShell,
  Box,
  Center,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
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
        <Group className={classes.logo} gap={2} my="md">
          <Text fw={900} fz={24} lts={-1}>
            Chroni
          </Text>
          <Text c="primary" fw={900} fz={24} lts={-1}>
            fy
          </Text>
        </Group>

        <Stack gap={4} className={classes.navSection}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                component="button"
                key={item.path}
                className={`${classes.navLink} ${isActive ? classes.navLinkActive : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} stroke={1.5} />
                <Text component="span">{_(item.label)}</Text>
              </Box>
            );
          })}
        </Stack>

        <Box className={classes.navFooter}>
          {status !== TimerStatusEnum.Idle && (
            <Box
              className={classes.timerIndicator}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <Group gap={8} className={classes.timerIndicatorHeader}>
                {status === TimerStatusEnum.Running ? (
                  <IconPlayerPlay size={12} fill="currentColor" />
                ) : (
                  <IconPlayerPause size={12} fill="currentColor" />
                )}
                <Text component="span" className={classes.timerTime}>
                  {formatTime(elapsed)}
                </Text>
              </Group>
              <Text
                size="xs"
                className={classes.timerProject}
                style={{ color: activeProject?.color }}
              >
                {activeProject?.name || _(msg`No Project`)}
              </Text>
            </Box>
          )}

          <Box
            component="button"
            className={`${classes.navLink} ${
              location.pathname === '/settings' ? classes.navLinkActive : ''
            }`}
            onClick={() => navigate('/settings')}
          >
            <IconSettings size={20} stroke={1.5} />
            <Text component="span">{_(msg`Settings`)}</Text>
          </Box>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense
          fallback={
            <Center style={{ height: 'calc(100vh - 40px)' }}>
              <Loader size="xl" variant="bars" />
            </Center>
          }
        >
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
