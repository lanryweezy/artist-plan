import apiClient from './apiClient';
import { Task, Subtask, TaskPriority } from '../../types'; // Corrected path

// Interface for the backend's Task structure if it differs slightly from frontend or for creation/update payloads
// For now, we'll assume the Task type from types.ts is sufficient for responses.

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'Todo' | 'Ongoing' | 'Completed';
  projectId?: string; // Assuming projectId is a string (ObjectId)
  priority?: TaskPriority;
  tags?: string[];
  // subtasks are typically managed via separate endpoints or handled differently during creation
  dueDate?: string; // ISO string date
  assignedTo?: string; // User ID string
  estimatedHours?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  // We can update any part of the task, so most fields are optional
  // Subtasks might be handled via specific subtask endpoints
  actualHours?: number;
}

export interface CreateSubtaskData {
    title: string;
}

export interface UpdateSubtaskData {
    title?: string;
    completed?: boolean;
}

// --- Task API Calls ---

export const getTasks = async (filters?: { projectId?: string; status?: string }): Promise<Task[]> => {
  try {
    const response = await apiClient.get<{ data: { tasks: Task[] } }>('/tasks', { params: filters });
    return response.data.data.tasks;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tasks.';
    throw new Error(errorMessage);
  }
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  try {
    const response = await apiClient.get<{ data: { task: Task } }>(`/tasks/${taskId}`);
    return response.data.data.task;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch task.';
    throw new Error(errorMessage);
  }
};

export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  try {
    const response = await apiClient.post<{ data: { task: Task } }>('/tasks', taskData);
    return response.data.data.task;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to create task.';
    throw new Error(errorMessage);
  }
};

export const updateTask = async (taskId: string, taskData: UpdateTaskData): Promise<Task> => {
  try {
    const response = await apiClient.put<{ data: { task: Task } }>(`/tasks/${taskId}`, taskData);
    return response.data.data.task;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to update task.';
    throw new Error(errorMessage);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await apiClient.delete(`/tasks/${taskId}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete task.';
    throw new Error(errorMessage);
  }
};


// --- Subtask API Calls ---

export const addSubtask = async (taskId: string, subtaskData: CreateSubtaskData): Promise<Subtask> => {
    try {
        const response = await apiClient.post<{ data: { subtask: Subtask } }>(`/tasks/${taskId}/subtasks`, subtaskData);
        return response.data.data.subtask;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add subtask.';
        throw new Error(errorMessage);
    }
};

export const updateSubtask = async (taskId: string, subtaskId: string, subtaskData: UpdateSubtaskData): Promise<Subtask> => {
    try {
        const response = await apiClient.put<{ data: { subtask: Subtask } }>(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
        return response.data.data.subtask;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update subtask.';
        throw new Error(errorMessage);
    }
};

export const deleteSubtask = async (taskId: string, subtaskId: string): Promise<void> => {
    try {
        await apiClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete subtask.';
        throw new Error(errorMessage);
    }
};
