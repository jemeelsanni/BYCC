import apiClient from './axios';
import { User } from '../types';

export interface UserStats {
  totalUsers: number;
  newUsers: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface DeleteUserResponse {
  message: string;
}

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user statistics (admin only)
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await apiClient.get<UserStats>('/users/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const response = await apiClient.delete<DeleteUserResponse>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};