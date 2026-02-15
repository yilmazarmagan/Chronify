import { I18nProvider } from '@lingui/react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { IdleReminder } from './components/IdleReminder';
import { activateLocale, i18n, type Locale } from './lib/i18n';
import { AppDataProvider } from './providers/AppDataProvider';
import { useAppData } from './providers/context';
import { TimerProvider } from './providers/TimerProvider';
import { AppRoutes } from './routes';
import { buildTheme } from './styles/theme';

import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './styles/global.scss';

function ThemedApp() {
  const { data, isLoading } = useAppData();
  const theme = buildTheme(data.settings.primaryColor);

  useEffect(() => {
    activateLocale(data.settings.locale as Locale);
  }, [data.settings.locale]);

  if (isLoading) {
    return null;
  }

  return (
    <I18nProvider i18n={i18n}>
      <MantineProvider
        theme={theme}
        forceColorScheme={
          data.settings.theme === 'auto' ? undefined : data.settings.theme
        }
      >
        <TimerProvider>
          <Notifications position="top-right" />
          <IdleReminder />
          <ModalsProvider>
            <AppRoutes />
          </ModalsProvider>
        </TimerProvider>
      </MantineProvider>
    </I18nProvider>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <ThemedApp />
    </AppDataProvider>
  );
}
