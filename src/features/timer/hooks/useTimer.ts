import { useState, useRef, useCallback, useEffect } from "react";
import { TimerStatusEnum } from "../../../enums";

export interface UseTimerReturn {
  status: TimerStatusEnum;
  elapsed: number; // seconds
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => number; // returns total elapsed seconds
  reset: () => void;
}

export function useTimer(): UseTimerReturn {
  const [status, setStatus] = useState<TimerStatusEnum>(TimerStatusEnum.Idle);
  const [elapsed, setElapsed] = useState(0);
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

  const start = useCallback(() => {
    accumulatedRef.current = 0;
    startTimeRef.current = Date.now();
    setElapsed(0);
    setStatus(TimerStatusEnum.Running);
    clearTimer();
    intervalRef.current = setInterval(tick, 200);
  }, [clearTimer, tick]);

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

  const stop = useCallback((): number => {
    let total = accumulatedRef.current;
    if (status === TimerStatusEnum.Running) {
      total += (Date.now() - startTimeRef.current) / 1000;
    }
    clearTimer();
    const finalElapsed = Math.floor(total);
    setElapsed(0);
    accumulatedRef.current = 0;
    setStatus(TimerStatusEnum.Idle);
    return finalElapsed;
  }, [status, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setElapsed(0);
    accumulatedRef.current = 0;
    setStatus(TimerStatusEnum.Idle);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { status, elapsed, start, pause, resume, stop, reset };
}
