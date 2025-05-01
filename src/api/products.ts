import { Product } from "../types";
import apiClient from "./axios";

export interface PaginatedResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const getProducts = async (page = 1, limit = 12): Promise<PaginatedResponse> => {
  const response = await apiClient.get<PaginatedResponse>(`/products?page=${page}&limit=${limit}`);
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (
  categoryName: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse> => {
  if (categoryName === 'All Products') {
    return getProducts(page, limit);
  }
  const response = await apiClient.get<PaginatedResponse>(
    `/products/category/${encodeURIComponent(categoryName)}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const searchProducts = async (
  query: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse> => {
  try {
    const response = await apiClient.get<PaginatedResponse>(
      `/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  try {
    const response = await apiClient.post<Product>('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updatedProductData: FormData): Promise<Product> => {
  try {
    const response = await apiClient.put<Product>(`/products/${id}`, updatedProductData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.delete<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};