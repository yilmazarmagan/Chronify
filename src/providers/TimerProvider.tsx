import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { notifications } from '@mantine/notifications';
import { listen } from '@tauri-apps/api/event';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TimerStatusEnum } from '../enums';

interface TimerContextType {
  status: TimerStatusEnum;
  elapsed: number;
  start: (projectId?: string, description?: string, tags?: string[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => {
    duration: number;
    startTime: string;
    endTime: string;
    projectId?: string;
    description: string;
    tags: string[];
  };
  reset: () => void;
  // Metadata for the active entry
  activeEntry: {
    projectId?: string;
    description: string;
    tags: string[];
    startTime: string | null;
  };
  setMetadata: (metadata: {
    projectId?: string;
    description?: string;
    tags?: string[];
  }) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { _ } = useLingui();
  const [status, setStatus] = useState<TimerStatusEnum>(TimerStatusEnum.Idle);
  const [elapsed, setElapsed] = useState(0);
  const [metadata, setMetadataState] = useState<{
    projectId?: string;
    description: string;
    tags: string[];
    startTime: string | null;
  }>({
    description: '',
    tags: [],
    startTime: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const total = accumulatedRef.current + (now - startTimeRef.current) / 1000;
    setElapsed(Math.floor(total));
  }, []);

  const start = useCallback(
    (projectId?: string, description = '', tags: string[] = []) => {
      const nowISO = new Date().toISOString();
      accumulatedRef.current = 0;
      startTimeRef.current = Date.now();
      setElapsed(0);
      setStatus(TimerStatusEnum.Running);
      setMetadataState({ projectId, description, tags, startTime: nowISO });
      clearTimer();
      intervalRef.current = setInterval(tick, 200);
    },
    [clearTimer, tick],
  );

  const pause = useCallback(() => {
    if (status !== TimerStatusEnum.Running) return;
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
    clearTimer();
    setStatus(TimerStatusEnum.Paused);
  }, [status, clearTimer]);

  const resume = useCallback(() => {
    if (status !== TimerStatusEnum.Paused) return;
    startTimeRef.current = Date.now();
    setStatus(TimerStatusEnum.Running);
    intervalRef.current = setInterval(tick, 200);
  }, [status, tick]);

  const stop = useCallback(() => {
    let total = accumulatedRef.current;
    const endTime = new Date().toISOString();
    if (status === TimerStatusEnum.Running) {
      total += (Date.now() - startTimeRef.current) / 1000;
    }
    clearTimer();
    const finalElapsed = Math.floor(total);
    const result = {
      duration: finalElapsed,
      startTime: metadata.startTime || new Date().toISOString(),
      endTime,
      projectId: metadata.projectId,
      description: metadata.description,
      tags: metadata.tags,
    };

    setElapsed(0);
    accumulatedRef.current = 0;
    setStatus(TimerStatusEnum.Idle);
    setMetadataState({ description: '', tags: [], startTime: null });

    return result;
  }, [status, clearTimer, metadata]);

  const reset = useCallback(() => {
    clearTimer();
    setElapsed(0);
    accumulatedRef.current = 0;
    setStatus(TimerStatusEnum.Idle);
    setMetadataState({ description: '', tags: [], startTime: null });
  }, [clearTimer]);

  const setMetadata = useCallback(
    (updates: {
      projectId?: string;
      description?: string;
      tags?: string[];
    }) => {
      setMetadataState((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    let unlisten: (() => void) | null = null;

    async function setupShortcut() {
      if (!window.__TAURI_INTERNALS__) return;

      try {
        const unlistenFn = await listen('shortcut-event', (event: any) => {
          if (event.payload === 'toggle-timer') {
            setStatus((currentStatus) => {
              if (currentStatus === TimerStatusEnum.Idle) {
                // Check metadata inside setStatus to avoid stale closures
                setMetadataState((currentMetadata) => {
                  if (
                    currentMetadata.projectId &&
                    currentMetadata.description.trim()
                  ) {
                    start(
                      currentMetadata.projectId,
                      currentMetadata.description,
                      currentMetadata.tags,
                    );
                    notifications.show({
                      title: _(msg`Timer Started`),
                      message: _(msg`Global shortcut activated.`),
                      color: 'teal',
                      autoClose: 2000,
                    });
                  } else {
                    notifications.show({
                      title: _(msg`Cannot Start Timer`),
                      message: _(
                        msg`Select a project and create a description first.`,
                      ),
                      color: 'red',
                      autoClose: 3000,
                    });
                  }
                  return currentMetadata;
                });
                return currentStatus; // Let start() handle status change
              } else if (currentStatus === TimerStatusEnum.Running) {
                pause();
                notifications.show({
                  title: _(msg`Timer Paused`),
                  message: _(msg`Global shortcut activated.`),
                  color: 'yellow',
                  autoClose: 2000,
                });
                return TimerStatusEnum.Paused;
              } else if (currentStatus === TimerStatusEnum.Paused) {
                resume();
                notifications.show({
                  title: _(msg`Timer Resumed`),
                  message: _(msg`Global shortcut activated.`),
                  color: 'blue',
                  autoClose: 2000,
                });
                return TimerStatusEnum.Running;
              }
              return currentStatus;
            });
          }
        });

        unlisten = unlistenFn;
      } catch (err) {
        console.error('Failed to setup shortcut listener:', err);
      }
    }

    setupShortcut();

    return () => {
      if (unlisten) unlisten();
    };
  }, [start, pause, resume]);

  return (
    <TimerContext.Provider
      value={{
        status,
        elapsed,
        start,
        pause,
        resume,
        stop,
        reset,
        activeEntry: metadata,
        setMetadata,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
}
