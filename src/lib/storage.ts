// Storage layer — JSON read/write via Tauri FS (with localStorage fallback for browser dev)

import {
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
} from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import type { AppData } from '../types/app-data.types';
import { DEFAULT_APP_DATA } from '../types/app-data.types';

const DATA_FILE = 'data.json';
const LOCAL_STORAGE_KEY = 'chronify_data';

// Check if running in Tauri environment
const isTauri = () =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export async function loadAppData(): Promise<AppData> {
  // Browser (localStorage) fallback
  if (!isTauri()) {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AppData;
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
      }
    }
    // Save default data initially
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_APP_DATA));
    return { ...DEFAULT_APP_DATA };
  }

  // Tauri (File System)
  try {
    const dir = await appDataDir();
    const filePath = await join(dir, DATA_FILE);

    if (await exists(filePath)) {
      const content = await readTextFile(filePath);
      const data = JSON.parse(content) as AppData;
      return data;
    }

    // First launch: create and save default data
    await saveAppData(DEFAULT_APP_DATA);
    return { ...DEFAULT_APP_DATA };
  } catch (error) {
    console.error('Failed to load app data:', error);
    return { ...DEFAULT_APP_DATA };
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  // Browser (localStorage) fallback
  if (!isTauri()) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return;
  }

  // Tauri (File System)
  try {
    const dir = await appDataDir();
    await mkdir(dir, { recursive: true });
    const filePath = await join(dir, DATA_FILE);
    await writeTextFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save app data:', error);
    throw error; // Re-throw to handle in UI if needed
  }
}
