// Timer display — premium modern clock with animated gradient ring

import { Text } from '@mantine/core';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
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

  return (
    <div className={`${classes.wrapper} ${classes[status]}`}>
      <div className={classes.container}>
        {/* Animated outer gradient ring */}
        <div className={classes.outerRing} />

        {/* Circle background */}
        <div className={classes.circleBg} />

        {/* SVG progress ring */}
        <svg className={classes.ring} viewBox="0 0 200 200">
          <circle className={classes.progressCircle} cx="100" cy="100" r="80" />
        </svg>

        {/* Time digits */}
        <div className={classes.timeDisplay}>
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
        </div>
      </div>

      {/* Status badge */}
      <div className={classes.statusBadge}>
        <span className={classes.statusDot} />
        {statusLabel}
      </div>
    </div>
  );
}
