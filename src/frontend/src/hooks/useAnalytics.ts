import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAllDatesInRange, getWeekRange, getMonthRange } from '../utils/dateRanges';
import { computeDailyCompletion } from '../utils/analytics';
import { TaskStatus } from '../backend';

export function useAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) {
        return {
          dailyCompletion: 0,
          weeklyTotal: 0,
          monthlyTotal: 0,
          totalCompleted: 0,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const todayTasks = await actor.getTasksByDate(today);
      const dailyCompletion = computeDailyCompletion(todayTasks);

      // Weekly
      const { start: weekStart, end: weekEnd } = getWeekRange(today);
      const weekDates = getAllDatesInRange(weekStart, weekEnd);
      let weeklyTotal = 0;
      for (const date of weekDates) {
        const tasks = await actor.getTasksByDate(date);
        weeklyTotal += tasks.filter((t) => t.status === TaskStatus.done).length;
      }

      // Monthly
      const { start: monthStart, end: monthEnd } = getMonthRange(today);
      const monthDates = getAllDatesInRange(monthStart, monthEnd);
      let monthlyTotal = 0;
      for (const date of monthDates) {
        const tasks = await actor.getTasksByDate(date);
        monthlyTotal += tasks.filter((t) => t.status === TaskStatus.done).length;
      }

      // All time (last 365 days as proxy)
      const yearAgo = new Date();
      yearAgo.setDate(yearAgo.getDate() - 365);
      const allDates = getAllDatesInRange(yearAgo.toISOString().split('T')[0], today);
      let totalCompleted = 0;
      for (const date of allDates) {
        const tasks = await actor.getTasksByDate(date);
        totalCompleted += tasks.filter((t) => t.status === TaskStatus.done).length;
      }

      return {
        dailyCompletion,
        weeklyTotal,
        monthlyTotal,
        totalCompleted,
      };
    },
    enabled: !!actor && !actorFetching,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    dailyCompletion: query.data?.dailyCompletion || 0,
    weeklyTotal: query.data?.weeklyTotal || 0,
    monthlyTotal: query.data?.monthlyTotal || 0,
    totalCompleted: query.data?.totalCompleted || 0,
    isLoading: query.isLoading,
  };
}
