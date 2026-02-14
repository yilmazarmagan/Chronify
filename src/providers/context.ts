import { createContext, useContext } from 'react';
import type { AppData } from '../types/app-data.types';
import type { AppSettings } from '../types/app-settings.types';
import type { Project } from '../types/project.types';
import type { Tag } from '../types/tag.types';
import type { TimeEntry } from '../types/time-entry.types';

export interface AppDataContextType {
  data: AppData;
  isLoading: boolean;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Projects
  addProject: (
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Time Entries
  addTimeEntry: (
    entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ) => TimeEntry;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;

  // Tags
  addTag: (tag: Omit<Tag, 'id'>) => Tag;
  deleteTag: (id: string) => void;

  // Data Management
  setAllData: (data: AppData) => void;
}

export const AppDataContext = createContext<AppDataContextType | null>(null);

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
