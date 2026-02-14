import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadAppData, saveAppData } from '../lib/storage';
import type { AppData } from '../types/app-data.types';
import { DEFAULT_APP_DATA } from '../types/app-data.types';
import type { AppSettings } from '../types/app-settings.types';
import type { Project } from '../types/project.types';
import type { Tag } from '../types/tag.types';
import type { TimeEntry } from '../types/time-entry.types';
import { AppDataContext } from './context';

// Helper: Sort Projects (Active first, then updatedAt desc)
const sortProjects = (projects: Project[]) => {
  return projects.toSorted((a, b) => {
    if (a.isActive === b.isActive) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.isActive ? -1 : 1;
  });
};

// Helper: Sort Time Entries (startTime desc)
const sortTimeEntries = (entries: TimeEntry[]) => {
  return entries.toSorted(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  );
};

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_APP_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on app startup
  useEffect(() => {
    loadAppData()
      .then((loaded) => {
        const sorted = {
          ...loaded,
          projects: sortProjects(loaded.projects),
          timeEntries: sortTimeEntries(loaded.timeEntries),
        };
        setData(sorted);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Persist data to file on every change
  const persistData = useCallback(async (newData: AppData) => {
    // Ensure lists are sorted before persisting
    const sortedData = {
      ...newData,
      projects: sortProjects(newData.projects),
      timeEntries: sortTimeEntries(newData.timeEntries),
    };

    setData(sortedData);
    try {
      await saveAppData(sortedData);
    } catch (error) {
      console.error('Failed to persist data:', error);
    }
  }, []);

  // --- Settings ---
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      const newData = {
        ...data,
        settings: { ...data.settings, ...updates },
      };
      persistData(newData);
    },
    [data, persistData],
  );

  // --- Projects ---
  const addProject = useCallback(
    (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
      const now = new Date().toISOString();
      const newProject: Project = {
        ...project,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      const newData = {
        ...data,
        projects: [...data.projects, newProject],
      };
      persistData(newData);
      return newProject;
    },
    [data, persistData],
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      const newData = {
        ...data,
        projects: data.projects.map((p) =>
          p.id === id
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p,
        ),
      };
      persistData(newData);
    },
    [data, persistData],
  );

  const deleteProject = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        projects: data.projects.filter((p) => p.id !== id),
      };
      persistData(newData);
    },
    [data, persistData],
  );

  // --- Time Entries ---
  const addTimeEntry = useCallback(
    (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>): TimeEntry => {
      const now = new Date().toISOString();
      const newEntry: TimeEntry = {
        ...entry,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      const newData = {
        ...data,
        timeEntries: [...data.timeEntries, newEntry],
      };
      persistData(newData);
      return newEntry;
    },
    [data, persistData],
  );

  const updateTimeEntry = useCallback(
    (id: string, updates: Partial<TimeEntry>) => {
      const newData = {
        ...data,
        timeEntries: data.timeEntries.map((e) =>
          e.id === id
            ? { ...e, ...updates, updatedAt: new Date().toISOString() }
            : e,
        ),
      };
      persistData(newData);
    },
    [data, persistData],
  );

  const deleteTimeEntry = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        timeEntries: data.timeEntries.filter((e) => e.id !== id),
      };
      persistData(newData);
    },
    [data, persistData],
  );

  // --- Tags ---
  const addTag = useCallback(
    (tag: Omit<Tag, 'id'>): Tag => {
      const newTag: Tag = { ...tag, id: uuidv4() };
      const newData = {
        ...data,
        tags: [...data.tags, newTag],
      };
      persistData(newData);
      return newTag;
    },
    [data, persistData],
  );

  const deleteTag = useCallback(
    (id: string) => {
      const newData = {
        ...data,
        tags: data.tags.filter((t) => t.id !== id),
      };
      persistData(newData);
    },
    [data, persistData],
  );

  const value = useMemo(
    () => ({
      data,
      isLoading,
      updateSettings,
      addProject,
      updateProject,
      deleteProject,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
      addTag,
      deleteTag,
      setAllData: persistData,
    }),
    [
      data,
      isLoading,
      updateSettings,
      addProject,
      updateProject,
      deleteProject,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
      addTag,
      deleteTag,
      persistData,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
