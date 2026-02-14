import type { AppSettings } from './app-settings.types';
import type { Project } from './project.types';
import type { TimeEntry } from './time-entry.types';
import type { Tag } from './tag.types';

export interface AppData {
  version: number;
  settings: AppSettings;
  projects: Project[];
  timeEntries: TimeEntry[];
  tags: Tag[];
}

export const DEFAULT_APP_DATA: AppData = {
  version: 1,
  settings: {
    theme: 'dark',
    primaryColor: '#E03131',
    locale: 'en',
    defaultView: 'timer',
    weekStartsOn: 'monday',
    idleReminderMinutes: 15,
  },
  projects: [],
  timeEntries: [],
  tags: [],
};
