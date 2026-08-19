import React, { createContext, useCallback, useEffect, useState } from "react";
import { loadTasks, saveTasks } from "../storage/taskStorage";
import type { Task } from "../types/task";

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: string, fields: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    const loaded = await loadTasks();
    setTasks(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const addTask = useCallback(async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasks(updated);
      return updated;
    });
  }, []);

  const updateTask = useCallback(
    async (id: string, fields: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">>) => {
      const now = new Date().toISOString();
      setTasks((prev) => {
        const updated = prev.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              ...fields,
              updatedAt: now,
            };
          }
          return task;
        });
        saveTasks(updated);
        return updated;
      });
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== id);
      saveTasks(updated);
      return updated;
    });
  }, []);

  const toggleTaskCompletion = useCallback(async (id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            updatedAt: now,
          };
        }
        return task;
      });
      saveTasks(updated);
      return updated;
    });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
