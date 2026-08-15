import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, fetchTasksByDate, createTask, updateTask, toggleTask, reorderTasks, deleteTask } from "../api/tasks";
import type { CreateTaskPayload, UpdateTaskPayload } from "../api/tasks";

const TASKS_KEY = ["tasks"];

export function useTasks(assignedTo?: number) {
  return useQuery({
    queryKey: assignedTo !== undefined ? [...TASKS_KEY, assignedTo] : TASKS_KEY,
    queryFn: () => fetchTasks(assignedTo),
  });
}

export function useTasksByDate(date: string | null) {
  return useQuery({
    queryKey: ["tasks-by-date", date],
    queryFn: () => fetchTasksByDate(date!),
    enabled: date !== null,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskPayload) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskPayload }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => reorderTasks(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}
