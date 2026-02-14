import { Group, ActionIcon, Tooltip } from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
} from '@tabler/icons-react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { TimerStatusEnum } from '../../../../enums';
import classes from './TimerControls.module.scss';

interface TimerControlsProps {
  status: TimerStatusEnum;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled,
}: TimerControlsProps) {
  const { _ } = useLingui();

  const isRunning = status === TimerStatusEnum.Running;
  const isIdle = status === TimerStatusEnum.Idle;

  return (
    <Group className={classes.controls}>
      {isIdle ? (
        <Tooltip label={_(msg`Start Timer`)} withArrow position="bottom">
          <ActionIcon
            variant="filled"
            size={72}
            radius="xl"
            color="teal"
            onClick={onStart}
            disabled={disabled}
            className={classes.mainButton}
          >
            <IconPlayerPlay size={30} fill="currentColor" />
          </ActionIcon>
        </Tooltip>
      ) : (
        <>
          <Tooltip label={_(msg`Stop & Save`)} withArrow position="bottom">
            <ActionIcon
              variant="light"
              size={52}
              radius="xl"
              color="red"
              onClick={onStop}
              className={classes.secondaryButton}
            >
              <IconPlayerStop size={22} fill="currentColor" />
            </ActionIcon>
          </Tooltip>

          {isRunning ? (
            <Tooltip label={_(msg`Pause Timer`)} withArrow position="bottom">
              <ActionIcon
                variant="filled"
                size={72}
                radius="xl"
                color="yellow"
                onClick={onPause}
                className={`${classes.mainButton} ${classes.pauseButton}`}
              >
                <IconPlayerPause size={30} fill="currentColor" />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label={_(msg`Resume Timer`)} withArrow position="bottom">
              <ActionIcon
                variant="filled"
                size={72}
                radius="xl"
                color="teal"
                onClick={onResume}
                className={classes.mainButton}
              >
                <IconPlayerPlay size={30} fill="currentColor" />
              </ActionIcon>
            </Tooltip>
          )}
        </>
      )}
    </Group>
  );
}
