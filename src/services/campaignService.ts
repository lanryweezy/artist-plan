import apiClient from './apiClient';
import { Campaign, CampaignType, CampaignStatus, MarketingTaskType } from '../../types'; // Assuming types are in root types.ts

export interface CreateCampaignData {
  name: string;
  campaignType: CampaignType | string; // Allow string for flexibility if CampaignType is strict
  status?: CampaignStatus | string;
  description?: string;
  startDate?: string; // ISO string date
  endDate?: string;   // ISO string date
  targetAudience?: string;
  keyObjectives?: string[];
  budget?: string;
  channels?: string[];
  linkedProjectId?: string; // ObjectId as string
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  // For fields that might be added during an update but not creation
  // e.g., performanceMetrics, aiGeneratedContent - though these might be complex objects
  // and potentially have their own dedicated update endpoints or methods.
  // For now, keeping it simple, assuming they are part of the main update payload if changed.
  aiGeneratedContent?: { tool: MarketingTaskType; output: string; timestamp: string }[];
}


export const getCampaigns = async (filters?: { status?: string; campaignType?: string }): Promise<Campaign[]> => {
  try {
    const response = await apiClient.get<{ data: { campaigns: Campaign[] } }>('/campaigns', { params: filters });
    return response.data.data.campaigns;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaigns.';
    throw new Error(errorMessage);
  }
};

export const getCampaignById = async (campaignId: string): Promise<Campaign> => {
  try {
    const response = await apiClient.get<{ data: { campaign: Campaign } }>(`/campaigns/${campaignId}`);
    return response.data.data.campaign;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch campaign details.';
    throw new Error(errorMessage);
  }
};

export const createCampaign = async (campaignData: CreateCampaignData): Promise<Campaign> => {
  try {
    const response = await apiClient.post<{ data: { campaign: Campaign } }>('/campaigns', campaignData);
    return response.data.data.campaign;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to create campaign.';
    throw new Error(errorMessage);
  }
};

export const updateCampaign = async (campaignId: string, campaignData: UpdateCampaignData): Promise<Campaign> => {
  try {
    const response = await apiClient.put<{ data: { campaign: Campaign } }>(`/campaigns/${campaignId}`, campaignData);
    return response.data.data.campaign;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to update campaign.';
    throw new Error(errorMessage);
  }
};

export const deleteCampaign = async (campaignId: string): Promise<void> => {
  try {
    await apiClient.delete(`/campaigns/${campaignId}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete campaign.';
    throw new Error(errorMessage);
  }
};
