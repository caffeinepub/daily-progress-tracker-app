import { Task, TaskStatus } from '../backend';

export function computeDailyCompletion(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === TaskStatus.done).length;
  return Math.round((completed / tasks.length) * 100);
}
