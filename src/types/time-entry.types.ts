export interface TimeEntry {
  id: string;
  projectId?: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
