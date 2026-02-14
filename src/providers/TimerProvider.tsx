import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
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
