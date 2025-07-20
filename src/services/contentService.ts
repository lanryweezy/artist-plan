import apiClient from './apiClient';
import {
    ContentItem,
    LyricsItem,
    ContentItemType,
    ContentItemStatus,
    LyricsItemStatus
} from '../../types'; // Assuming types are in root types.ts

// --- ContentItem Types ---
export interface CreateContentItemData {
  title: string;
  description?: string;
  type: ContentItemType | string;
  status?: ContentItemStatus | string;
  tags?: string[];
  filePathOrUrl?: string;
  thumbnailUrl?: string;
  fileSize?: string;
  associatedProjectId?: string;
  campaignId?: string;
  source?: 'Uploaded' | 'AI Generated Strategy' | 'AI Generated Post' | 'Lyrics Editor' | 'Other';
}
export interface UpdateContentItemData extends Partial<CreateContentItemData> {}

// --- LyricsItem Types ---
export interface CreateLyricsItemData {
  title: string;
  lyricsText: string;
  notes?: string;
  status?: LyricsItemStatus | string;
  tags?: string[];
  associatedProjectId?: string;
}
export interface UpdateLyricsItemData extends Partial<CreateLyricsItemData> {}


// === ContentItem API Calls ===

export const getContentItems = async (filters?: { type?: string, status?: string, projectId?: string, campaignId?: string }): Promise<ContentItem[]> => {
  try {
    const response = await apiClient.get<{ data: { items: ContentItem[] } }>('/content/items', { params: filters });
    return response.data.data.items;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch content items.';
    throw new Error(errorMessage);
  }
};

export const getContentItemById = async (itemId: string): Promise<ContentItem> => {
  try {
    const response = await apiClient.get<{ data: { item: ContentItem } }>(`/content/items/${itemId}`);
    return response.data.data.item;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch content item details.';
    throw new Error(errorMessage);
  }
};

// Note: For actual file uploads, this would need to handle FormData
// and the backend would need a multipart/form-data parser (e.g., multer)
export const createContentItem = async (itemData: CreateContentItemData | FormData): Promise<ContentItem> => {
  try {
    // If itemData is FormData, headers might need to be 'multipart/form-data'
    // Axios might set it automatically if FormData is passed.
    const headers = itemData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post<{ data: { item: ContentItem } }>('/content/items', itemData, { headers });
    return response.data.data.item;
  } catch (error: any)    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to create content item.';
    throw new Error(errorMessage);
  }
};

export const updateContentItem = async (itemId: string, itemData: UpdateContentItemData | FormData): Promise<ContentItem> => {
  try {
    const headers = itemData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put<{ data: { item: ContentItem } }>(`/content/items/${itemId}`, itemData, { headers });
    return response.data.data.item;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to update content item.';
    throw new Error(errorMessage);
  }
};

export const deleteContentItem = async (itemId: string): Promise<void> => {
  try {
    await apiClient.delete(`/content/items/${itemId}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete content item.';
    throw new Error(errorMessage);
  }
};


// === LyricsItem API Calls ===

export const getLyricsItems = async (filters?: { status?: string, projectId?: string }): Promise<LyricsItem[]> => {
  try {
    const response = await apiClient.get<{ data: { items: LyricsItem[] } }>('/content/lyrics', { params: filters });
    return response.data.data.items;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch lyrics items.';
    throw new Error(errorMessage);
  }
};

export const getLyricsItemById = async (lyricsId: string): Promise<LyricsItem> => {
  try {
    const response = await apiClient.get<{ data: { item: LyricsItem } }>(`/content/lyrics/${lyricsId}`);
    return response.data.data.item;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch lyrics item details.';
    throw new Error(errorMessage);
  }
};

export const createLyricsItem = async (itemData: CreateLyricsItemData): Promise<LyricsItem> => {
  try {
    const response = await apiClient.post<{ data: { item: LyricsItem } }>('/content/lyrics', itemData);
    return response.data.data.item;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to create lyrics item.';
    throw new Error(errorMessage);
  }
};

export const updateLyricsItem = async (lyricsId: string, itemData: UpdateLyricsItemData): Promise<LyricsItem> => {
  try {
    const response = await apiClient.put<{ data: { item: LyricsItem } }>(`/content/lyrics/${lyricsId}`, itemData);
    return response.data.data.item;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'Failed to update lyrics item.';
    throw new Error(errorMessage);
  }
};

export const deleteLyricsItem = async (lyricsId: string): Promise<void> => {
  try {
    await apiClient.delete(`/content/lyrics/${lyricsId}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete lyrics item.';
    throw new Error(errorMessage);
  }
};
