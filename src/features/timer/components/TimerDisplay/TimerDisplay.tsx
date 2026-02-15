import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Box, RingProgress, Text } from '@mantine/core';
import { TimerStatusEnum } from '../../../../enums';
import { formatTimerDuration } from '../../../../utils/date.utils';
import classes from './TimerDisplay.module.scss';

interface TimerDisplayProps {
  elapsed: number;
  status: TimerStatusEnum;
}

export function TimerDisplay({ elapsed, status }: TimerDisplayProps) {
  const { _ } = useLingui();
  const time = formatTimerDuration(elapsed);

  const statusLabel =
    status === TimerStatusEnum.Running
      ? _(msg`Recording`)
      : status === TimerStatusEnum.Paused
        ? _(msg`Paused`)
        : _(msg`Ready`);

  // Progress logic: 360 degrees (100%) every 60 seconds
  const secondsProgress =
    status === TimerStatusEnum.Idle ? 0 : ((elapsed % 60) / 60) * 100;

  // Map our Enum to Mantine colors
  const ringColor =
    status === TimerStatusEnum.Paused
      ? 'orange'
      : status === TimerStatusEnum.Running
        ? 'teal'
        : 'gray';

  return (
    <div className={`${classes.wrapper} ${classes[status]}`}>
      <div className={classes.container}>
        <RingProgress
          size={300}
          thickness={8}
          roundCaps
          rootColor="var(--mantine-color-dark-6)"
          classNames={{ label: classes.timeDisplayLabel }}
          sections={[{ value: secondsProgress, color: ringColor }]}
          label={
            <Box>
              <Text className={classes.digit} component="span">
                {time.hours}
              </Text>
              <Text className={classes.separator} component="span">
                :
              </Text>
              <Text className={classes.digit} component="span">
                {time.minutes}
              </Text>
              <Text className={classes.separator} component="span">
                :
              </Text>
              <Text className={classes.digit} component="span">
                {time.seconds}
              </Text>
            </Box>
          }
        />
      </div>

      {/* Status badge */}
      <div className={classes.statusBadge}>
        <span className={classes.statusDot} />
        {statusLabel}
      </div>
    </div>
  );
}
