import apiClient from './apiClient';
import { Project, Task, ProjectType } from '../../types'; // Assuming these types are in the root types.ts

// --- Project Types (for request/response if different from main types) ---
export interface CreateProjectData {
  name: string;
  description?: string;
  status?: 'New' | 'Idea' | 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Archived';
  projectType?: ProjectType | string; // Allow string for flexibility if types.ts ProjectType is strict
  startDate?: string; // ISO string date
  endDate?: string;   // ISO string date
  dueDate?: string;   // ISO string date
  budget?: number;
  // Milestones will be part of the project data or managed via separate endpoints
  milestones?: Array<{ title: string; date: string; status?: 'Pending' | 'In Progress' | 'Completed' | 'Delayed'; description?: string }>;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  actualCost?: number;
  resources?: Array<{ name: string; link: string; type: string }>;
}

export interface MilestoneData {
    title: string;
    date: string; // ISO string
    status?: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
    description?: string;
}


// --- Project API Calls ---

export const getProjects = async (filters?: { status?: string; projectType?: string }): Promise<Project[]> => {
  try {
    const response = await apiClient.get<{ data: { projects: Project[] } }>('/projects', { params: filters });
    return response.data.data.projects;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch projects.';
    throw new Error(errorMessage);
  }
};

export const getProjectById = async (projectId: string): Promise<{project: Project, tasks?: Task[]}> => {
  try {
    // The backend route /api/projects/:id currently returns { project, shows (for tour) }
    // Assuming it might be { project, tasks } for a project, or just project.
    // Let's adjust based on the actual backend response structure.
    // For now, assuming it returns { data: { project: Project } } and tasks might be fetched separately or included.
    const response = await apiClient.get<{ data: { project: Project } }>(`/projects/${projectId}`);
    // If backend includes tasks: const { project, tasks } = response.data.data; return { project, tasks };
    return { project: response.data.data.project };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch project details.';
    throw new Error(errorMessage);
  }
};

export const createProject = async (projectData: CreateProjectData): Promise<Project> => {
  try {
    const response = await apiClient.post<{ data: { project: Project } }>('/projects', projectData);
    return response.data.data.project;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to create project.';
    throw new Error(errorMessage);
  }
};

export const updateProject = async (projectId: string, projectData: UpdateProjectData): Promise<Project> => {
  try {
    const response = await apiClient.put<{ data: { project: Project } }>(`/projects/${projectId}`, projectData);
    return response.data.data.project;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to update project.';
    throw new Error(errorMessage);
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await apiClient.delete(`/projects/${projectId}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete project.';
    throw new Error(errorMessage);
  }
};

// --- Project Tasks API Call ---
export const getTasksForProject = async (projectId: string): Promise<Task[]> => {
    try {
        const response = await apiClient.get<{ data: { tasks: Task[] } }>(`/projects/${projectId}/tasks`);
        return response.data.data.tasks;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tasks for project.';
        throw new Error(errorMessage);
    }
};


// --- Milestone API Calls (if managing them as separate sub-resources) ---
// Backend routes for milestones are /api/projects/:projectId/milestones/:milestoneId

export const addMilestoneToProject = async (projectId: string, milestoneData: MilestoneData): Promise<Project> => { // Assuming backend returns updated project
    try {
        // The backend controller for addMilestone returns { milestone: addedMilestone }
        // but for react-query, it's often easier if mutations return the full updated parent resource or we manually update cache.
        // For now, let's assume we refetch the project or the backend returns the full project.
        // If it just returns the milestone, the return type here would be Milestone.
        const response = await apiClient.post<{ data: { milestone: any } /* or project: Project */ }>(`/projects/${projectId}/milestones`, milestoneData);
        // If backend returns the full project:
        // return response.data.data.project;
        // For now, we'll rely on query invalidation to refetch the project.
        // This function's return type might need adjustment based on actual backend response.
        // Let's assume a refetch for now, so the exact return type of THIS function is less critical
        // if the calling mutation just invalidates.
        // However, to make it more directly usable with setQueryData, returning the project is better.
        // For now, let's make it void and rely on invalidation.
        // UPDATE: Backend addMilestone returns the new milestone. We need to update project cache manually or refetch.
        // Let's expect the backend to ideally return the updated project or handle cache update in mutation's onSuccess.
        // For now, this service will just make the call. The component will handle cache.
        return response.data as any; // Placeholder, actual type depends on backend response
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add milestone.';
        throw new Error(errorMessage);
    }
};

export const updateMilestoneInProject = async (projectId: string, milestoneId: string, milestoneData: Partial<MilestoneData>): Promise<Project> => {
    try {
        const response = await apiClient.put<{ data: { milestone: any } }>(`/projects/${projectId}/milestones/${milestoneId}`, milestoneData);
        // Similar to addMilestone, ideally backend returns updated project or component handles cache.
        return response.data as any; // Placeholder
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update milestone.';
        throw new Error(errorMessage);
    }
};

export const deleteMilestoneFromProject = async (projectId: string, milestoneId: string): Promise<void> => {
    try {
        await apiClient.delete(`/projects/${projectId}/milestones/${milestoneId}`);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete milestone.';
        throw new Error(errorMessage);
    }
};
