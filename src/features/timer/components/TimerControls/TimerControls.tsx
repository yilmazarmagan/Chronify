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
    <Group gap="lg" className={classes.controls}>
      {isIdle ? (
        <Tooltip label={_(msg`Start Timer`)} withArrow>
          <ActionIcon
            variant="filled"
            size={64}
            radius="xl"
            color="teal"
            onClick={onStart}
            disabled={disabled}
            className={classes.mainButton}
          >
            <IconPlayerPlay size={32} fill="currentColor" />
          </ActionIcon>
        </Tooltip>
      ) : (
        <>
          <Tooltip label={_(msg`Stop & Save`)} withArrow>
            <ActionIcon
              variant="light"
              size={56}
              radius="xl"
              color="red"
              onClick={onStop}
              className={classes.secondaryButton}
            >
              <IconPlayerStop size={28} fill="currentColor" />
            </ActionIcon>
          </Tooltip>

          {isRunning ? (
            <Tooltip label={_(msg`Pause Timer`)} withArrow>
              <ActionIcon
                variant="filled"
                size={64}
                radius="xl"
                color="yellow"
                onClick={onPause}
                className={classes.mainButton}
              >
                <IconPlayerPause size={32} fill="currentColor" />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label={_(msg`Resume Timer`)} withArrow>
              <ActionIcon
                variant="filled"
                size={64}
                radius="xl"
                color="teal"
                onClick={onResume}
                className={classes.mainButton}
              >
                <IconPlayerPlay size={32} fill="currentColor" />
              </ActionIcon>
            </Tooltip>
          )}
        </>
      )}
    </Group>
  );
}
