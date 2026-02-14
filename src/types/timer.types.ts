import { TimerStatusEnum } from "../enums";

export interface TimerState {
  status: TimerStatusEnum;
  elapsed: number;
}
