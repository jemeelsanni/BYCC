import { User } from '@/types';
import apiClient from './axios';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
  };
}

export const login = async (email: string, password: string) => {
  const response = await apiClient.post<LoginResponse>('/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string 
}) => {
  const response = await apiClient.post('/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/me');
  return response.data;
};

interface UserProfileUpdate {
  userId: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  state?: string;
  province?: string;
  // First name, last name, and email are not included as they shouldn't be updatable from checkout
}

// src/api/auth.js
// src/api/auth.js
// Replace your current updateUserProfile function with this corrected version

// Update your updateUserProfile function in auth.ts to use the new endpoint

export const updateUserProfile = async (profileData: UserProfileUpdate): Promise<User> => {
  try {
    // If userId is undefined, get the current user's ID from the profile
    if (!profileData.userId) {
      // Get current user profile first
      const currentUser = await getCurrentUser();
      
      // Use type assertion to access _id or try alternatives
      const user = currentUser as { _id?: string; id?: string };
      const userId = user._id || user.id;
      if (!userId) {
        throw new Error('User ID not found in profile');
      }
      profileData.userId = userId;
    }
    
    // Check again if we have a userId before making the request
    if (!profileData.userId) {
      throw new Error('Cannot update profile: User ID is missing');
    }
    
    // Use the new endpoint specifically for user profile updates
    const response = await apiClient.put(`/users/profile/${profileData.userId}`, profileData);
    return response.data as User;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

