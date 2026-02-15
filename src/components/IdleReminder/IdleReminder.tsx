import { useEffect, useRef } from 'react';
import { useIdle } from '@mantine/hooks';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useTimer } from '@providers/TimerProvider';
import { TimerStatusEnum } from '@enums/timer-status.enum';
import { useAppData } from '@providers/context';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

export function IdleReminder() {
  const { _ } = useLingui();
  const { status } = useTimer();
  const { data } = useAppData();
  const notificationSent = useRef(false);

  // Use dynamic threshold from settings (convert minutes to ms)
  // Default to a very large number if disabled (0) to avoid unnecessary triggers
  const threshold =
    data.settings.idleReminderMinutes > 0
      ? data.settings.idleReminderMinutes * 60 * 1000
      : 24 * 60 * 60 * 1000; // 24 hours fallback if disabled

  const idle = useIdle(threshold);

  // Reset notification flag when user becomes active again
  useEffect(() => {
    if (!idle) {
      notificationSent.current = false;
    }
  }, [idle]);

  useEffect(() => {
    // Request permission on mount so it's ready for idle reminders
    async function checkPermission() {
      // Check if we're running inside Tauri
      if (!window.__TAURI_INTERNALS__) {
        return;
      }

      try {
        const granted = await isPermissionGranted();
        if (!granted) {
          await requestPermission();
        }
      } catch (err) {
        console.error('Failed to request notification permission:', err);
      }
    }
    checkPermission();
  }, []);

  useEffect(() => {
    // If user becomes idle and timer is not running
    if (
      idle &&
      status === TimerStatusEnum.Idle &&
      data.settings.idleReminderMinutes > 0 &&
      !notificationSent.current
    ) {
      notificationSent.current = true;
      sendSystemNotification(
        _(msg`Are you working?`),
        _(msg`It looks like you're active but haven't started the timer yet.`),
      );
    }
  }, [idle, status, _, data.settings.idleReminderMinutes]);

  return null;
}

async function sendSystemNotification(title: string, body: string) {
  // Check if we're running inside Tauri
  if (!window.__TAURI_INTERNALS__) {
    return;
  }

  try {
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    if (permissionGranted) {
      sendNotification({ title, body });
    }
  } catch {
    console.warn('System notification not available');
  }
}
