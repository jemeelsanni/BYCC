import { Category } from "../types";
import apiClient from "./axios";

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
};

export const getCategory = async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', categoryData);
    return response.data;
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
};