import { useEffect } from 'react';
import { useIdle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useTimer } from '@providers/TimerProvider';
import { TimerStatusEnum } from '@enums/timer-status.enum';
import { IconClockExclamation } from '@tabler/icons-react';
import { useAppData } from '@providers/context';

export function IdleReminder() {
  const { _ } = useLingui();
  const { status } = useTimer();
  const { data } = useAppData();

  // Use dynamic threshold from settings (convert minutes to ms)
  // Default to a very large number if disabled (0) to avoid unnecessary triggers
  const threshold =
    data.settings.idleReminderMinutes > 0
      ? data.settings.idleReminderMinutes * 60 * 1000
      : 24 * 60 * 60 * 1000; // 24 hours fallback if disabled

  const idle = useIdle(threshold);

  useEffect(() => {
    // If user becomes idle and timer is not running
    if (
      idle &&
      status === TimerStatusEnum.Idle &&
      data.settings.idleReminderMinutes > 0
    ) {
      notifications.show({
        id: 'idle-reminder',
        title: _(msg`Are you working?`),
        message: _(
          msg`It looks like you're active but haven't started the timer yet.`,
        ),
        color: 'yellow',
        icon: <IconClockExclamation size={18} />,
        autoClose: 10000,
      });
    }
  }, [idle, status, _, data.settings.idleReminderMinutes]);

  return null;
}
