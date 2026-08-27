import React, { createContext, useCallback, useEffect, useState } from "react";
import API from "../services/api";
import type { Task } from "../types/task";
type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTask: (
    id: string,
    fields: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  clearTasks: () => void;
};

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);

      const response = await API.get("/tasks");

      const formattedTasks = response.data.map((task: any) => ({
        id: task._id,
        title: task.title,
        description: task.description || "",
        completed: task.completed || false,
        priority: task.priority || "medium",
        dueDate: task.dueDate || "",
        category: task.category || "",
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.log("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const addTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      try {
        console.log("SENDING TASK:", taskData);

        const response = await API.post("/tasks", taskData);

        console.log("API RESPONSE:", response.data);

        const task = response.data;

        const newTask: Task = {
          id: task._id,
          title: task.title,
          description: task.description || "",
          completed: task.completed || false,
          priority: task.priority || "medium",
          dueDate: task.dueDate || "",
          category: task.category || "",
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };

        setTasks((prev) => [newTask, ...prev]);
      } catch (error: any) {
        console.log("❌ ERROR loading tasks:", error.message);
        console.log("❌ ERROR details:", error.response?.data);
      }
    },
    [],
  );

  const updateTask = useCallback(
    async (
      id: string,
      fields: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
    ) => {
      try {
        const response = await API.put(`/tasks/${id}`, fields);

        const task = response.data;

        const updatedTask: Task = {
          id: task._id,
          title: task.title,
          description: task.description || "",
          completed: task.completed || false,
          priority: task.priority || "medium",
          dueDate: task.dueDate || "",
          category: task.category || "",
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };

        setTasks((prev) =>
          prev.map((item) => (item.id === id ? updatedTask : item)),
        );
      } catch (error) {
        console.log("Error updating task:", error);
      }
    },
    [],
  );

  const deleteTask = useCallback(async (id: string) => {
    try {
      await API.delete(`/tasks/${id}`);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  }, []);

  const toggleTaskCompletion = useCallback(
    async (id: string) => {
      const task = tasks.find((item) => item.id === id);

      if (!task) return;

      await updateTask(id, {
        completed: !task.completed,
      });
    },
    [tasks, updateTask],
  );

  const clearTasks = useCallback(() => {
    setTasks([]);
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
        clearTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
