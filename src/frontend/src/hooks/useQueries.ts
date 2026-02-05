import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Task, TaskStatus, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetTasksByDate(date: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks', date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasksByDate(date);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; date: string; category: string | null; notes: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createTask(params.title, params.date, params.category, params.notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useEditTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      taskId: bigint;
      title: string;
      date: string;
      status: TaskStatus;
      category: string | null;
      notes: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.editTask(params.taskId, params.title, params.date, params.status, params.category, params.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { taskId: bigint; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTask(params.taskId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useToggleTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { taskId: bigint; currentStatus: TaskStatus; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      const tasks = await actor.getTasksByDate(params.date);
      const task = tasks.find((t) => t.id === params.taskId);
      if (!task) throw new Error('Task not found');

      const newStatus = params.currentStatus === TaskStatus.done ? TaskStatus.pending : TaskStatus.done;
      await actor.editTask(task.id, task.title, task.date, newStatus, task.category || null, task.notes || null);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
