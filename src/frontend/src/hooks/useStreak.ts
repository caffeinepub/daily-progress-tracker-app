import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAllDatesInRange } from '../utils/dateRanges';
import { computeStreaks } from '../utils/streaks';
import { TaskStatus } from '../backend';

export function useStreak() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      if (!actor) return { currentStreak: 0n, bestStreak: 0n };

      // Fetch tasks for the last 90 days to compute streaks
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 90);

      const dates = getAllDatesInRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      const tasksByDate: Record<string, boolean> = {};

      for (const date of dates) {
        const tasks = await actor.getTasksByDate(date);
        const hasCompletedTask = tasks.some((t) => t.status === TaskStatus.done);
        tasksByDate[date] = hasCompletedTask;
      }

      return computeStreaks(tasksByDate, endDate.toISOString().split('T')[0]);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    currentStreak: query.data?.currentStreak || 0n,
    bestStreak: query.data?.bestStreak || 0n,
    streakRule:
      'A day counts toward your streak if you complete at least one task. Your streak breaks when you miss a day.',
    isLoading: query.isLoading,
  };
}
