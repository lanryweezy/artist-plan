import apiClient from './apiClient';
import { User } from '../types'; // Assuming User type from types.ts

// Define interfaces for request payloads and response structures
// These should align with your backend's expected request/response

export interface AuthResponse { // Exporting for use in components
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface SignupData { // Exporting for use in components
  name: string;
  email: string;
  password?: string; // Password for email signup
  passwordConfirm?: string;
  provider?: 'google' | 'apple' | 'email'; // For OAuth or email
  photoURL?: string;
  // Add other fields if your backend signup expects them for OAuth
}

export interface LoginData { // Exporting for use in components
  email: string;
  password?: string; // Password for email login
  provider?: 'google' | 'apple' | 'email'; // For OAuth
  idToken?: string; // For OAuth, if you verify ID token on backend
}


export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    // Axios error structure: error.response.data contains the error payload from backend
    // Ensure the backend sends a meaningful error structure, e.g., { message: "...", errors: {} }
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'An unknown error occurred during signup.';
    throw new Error(errorMessage);
  }
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', loginData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data?.errors && Object.values(error.response.data.errors).map((e: any) => e.message).join(', ')) ||
                         error.message ||
                         'An unknown error occurred during login.';
    throw new Error(errorMessage);
  }
};

// Example for a protected route, e.g., fetching current user profile
// This would typically live in a userService.ts but is here for example
export interface UserProfileResponse {
    status: string;
    data: {
        user: User;
    };
}
export const getMe = async (): Promise<UserProfileResponse> => {
    try {
        // Ensure your backend has a GET /api/auth/me or similar protected route
        const response = await apiClient.get<UserProfileResponse>('/auth/me');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message ||
                             error.message ||
                             'Could not fetch user profile.';
        throw new Error(errorMessage);
    }
};
