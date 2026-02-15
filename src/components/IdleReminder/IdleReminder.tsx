import { invoke } from '@tauri-apps/api/core';
import { useEffect, useRef } from 'react';
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
  const activeSinceMs = useRef<number | null>(null);

  useEffect(() => {
    // Check permission on mount
    async function checkPermission() {
      if (!window.__TAURI_INTERNALS__) return;
      try {
        const granted = await isPermissionGranted();
        if (!granted) await requestPermission();
      } catch (err) {
        console.error('Failed to request notification permission:', err);
      }
    }
    checkPermission();
  }, []);

  useEffect(() => {
    if (!window.__TAURI_INTERNALS__) return;
    if (!data.settings.idleReminderEnabled) {
      activeSinceMs.current = null; // Reset when disabled
      return;
    }

    const thresholdMs = data.settings.idleReminderMinutes * 60 * 1000;

    // Check every 5 seconds
    const intervalId = setInterval(async () => {
      try {
        const idleTimeMs = await invoke<number>('get_system_idle_time');

        // User is ACTIVE (interacting with system within last 5 seconds)
        if (idleTimeMs < 5000) {
          if (activeSinceMs.current === null) {
            activeSinceMs.current = Date.now();
          } else if (status === TimerStatusEnum.Idle) {
            // Calculate how long they have been active AND timer is idle
            const activeDuration = Date.now() - activeSinceMs.current;

            if (activeDuration >= thresholdMs && !notificationSent.current) {
              notificationSent.current = true;
              sendSystemNotification(
                _(msg`Are you working?`),
                _(
                  msg`It looks like you have been active for a while. Don't forget to track your time!`,
                ),
              );
            }
          }
        } else {
          // User stopped interacting (idle > 5s), reset active counter
          activeSinceMs.current = null;
          // Only reset notification flag when user becomes idle again to avoid spam
          notificationSent.current = false;
        }
      } catch (err) {
        console.error('Failed to get system idle time:', err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [
    data.settings.idleReminderEnabled,
    data.settings.idleReminderMinutes,
    status,
    _,
  ]);

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
