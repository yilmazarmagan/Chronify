import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT } from '../constants';
import type { TimeEntry } from '../types/time-entry.types';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

/**
 * Formats total seconds into HH:MM:SS object strings.
 * Used for timer display.
 */
export function formatTimerDuration(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
}

/**
 * Formats seconds into a human readable string like "00:00:00" or "1h 30m"
 */
export function formatDurationString(seconds: number): string {
  const { hours, minutes, seconds: secs } = formatTimerDuration(seconds);
  if (seconds >= 3600) {
    return `${hours}:${minutes}:${secs}`;
  }
  return `${minutes}:${secs}`;
}

/**
 * Returns today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  return dayjs().format(DATE_FORMAT);
}

/**
 * Groups time entries by date string (YYYY-MM-DD)
 */
export function groupTimeEntriesByDate(
  entries: TimeEntry[],
): Record<string, TimeEntry[]> {
  const groups: Record<string, TimeEntry[]> = {};
  for (const entry of entries) {
    if (!entry.endTime) continue; // Skip running entries
    const date = entry.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
  }
  return groups;
}

/**
 * Calculates total duration of time entries in seconds
 */
export function calculateTotalDuration(entries: TimeEntry[]): number {
  return entries.reduce((acc, curr) => acc + (curr.duration || 0), 0);
}
