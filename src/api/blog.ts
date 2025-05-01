import { Article, PaginatedArticlesResponse, ArticleInput } from "../types";
import apiClient from "./axios";

export const getArticles = async (page = 1, limit = 10): Promise<PaginatedArticlesResponse> => {
  const response = await apiClient.get<PaginatedArticlesResponse>(`/articles?page=${page}&limit=${limit}`);
  return response.data;
};


export const getArticle = async (id: string): Promise<Article> => {
  const response = await apiClient.get<Article>(`/articles/${id}`);
  return response.data;
};

export const createArticle = async (articleData: ArticleInput): Promise<Article> => {
  const formData = new FormData();
  formData.append('title', articleData.title);
  formData.append('content', articleData.content);
  formData.append('authorName', articleData.authorName);
  formData.append('authorTitle', articleData.authorTitle);
  
  if (articleData.image) {
    formData.append('image', articleData.image);
  }

  const response = await apiClient.post<Article>('/articles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const updateArticle = async (id: string, articleData: ArticleInput): Promise<Article> => {
  const formData = new FormData();
  formData.append('title', articleData.title);
  formData.append('content', articleData.content);
  formData.append('authorName', articleData.authorName);
  formData.append('authorTitle', articleData.authorTitle);
  
  if (articleData.image) {
    formData.append('image', articleData.image);
  }

  const response = await apiClient.put<Article>(`/articles/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const deleteArticle = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/articles/${id}`);
  return response.data;
};

export const recordArticleView = async (id: string): Promise<{ views: number }> => {
  const response = await apiClient.post<{ views: number }>(`/articles/${id}/view`);
  return response.data;
};

export const likeArticle = async (id: string, userId?: string): Promise<{ likes: number, liked: boolean }> => {
  const response = await apiClient.post<{ likes: number, liked: boolean }>(`/articles/${id}/like`, { userId });
  return response.data;
};

export const checkArticleLike = async (id: string, userId?: string): Promise<{ likes: number, liked: boolean }> => {
  const response = await apiClient.post<{ likes: number, liked: boolean }>(`/articles/${id}/check-like`, { userId });
  return response.data;
};

export const uploadEditorImage = async (image: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', image);
  
  const response = await apiClient.post<{ url: string }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};