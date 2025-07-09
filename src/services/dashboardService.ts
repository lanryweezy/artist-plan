import apiClient from './apiClient';
// We might want a specific type for the dashboard summary response
// For now, we can use a generic one or define it inline.

export interface DashboardSummaryData {
  incompleteTasks: number;
  ongoingProjects: number;
  // Potentially other fields like:
  // upcomingDeadlines: Array<{ title: string; dueDate: string; type: 'task' | 'project' }>;
  // recentActivity: Array<{ message: string; timestamp: string }>;
  // financialsOverview?: { totalIncome: number; totalExpenses: number; netBalance: number };
}

interface DashboardSummaryResponse {
  status: string;
  data: DashboardSummaryData;
}

export const getDashboardSummary = async (): Promise<DashboardSummaryData> => {
  try {
    const response = await apiClient.get<DashboardSummaryResponse>('/dashboard/summary');
    return response.data.data; // The actual summary data is nested under response.data.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard summary.';
    throw new Error(errorMessage);
  }
};
