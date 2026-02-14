// Timer display — large animated clock with glowing ring

import { Box, Text } from '@mantine/core';
import { TimerStatusEnum } from '../../../../enums';
import { formatTimerDuration } from '../../../../utils/date.utils';
import classes from './TimerDisplay.module.scss';

interface TimerDisplayProps {
  elapsed: number;
  status: TimerStatusEnum;
}

export function TimerDisplay({ elapsed, status }: TimerDisplayProps) {
  const time = formatTimerDuration(elapsed);

  return (
    <Box className={`${classes.container} ${classes[status]}`}>
      <svg className={classes.ring} viewBox="0 0 200 200">
        <circle className={classes.trackCircle} cx="100" cy="100" r="90" />
        <circle
          className={`${classes.progressCircle} ${status === TimerStatusEnum.Running ? classes.spinning : ''}`}
          cx="100"
          cy="100"
          r="90"
        />
      </svg>
      <div className={classes.timeDisplay}>
        <Text className={classes.digits} component="span">
          {time.hours}
        </Text>
        <Text className={classes.separator} component="span">
          :
        </Text>
        <Text className={classes.digits} component="span">
          {time.minutes}
        </Text>
        <Text className={classes.separator} component="span">
          :
        </Text>
        <Text className={classes.digits} component="span">
          {time.seconds}
        </Text>
      </div>
    </Box>
  );
}
