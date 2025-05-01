import apiClient from './axios';

export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    review: string;
    comment: string;
    name: string;
    date: string;
}

export interface RatingSummary {
    averageRating: number;
    totalReviews: number;
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStars: number;
}

export interface ProductReviewsResponse {
    reviews: Review[];
    summary: RatingSummary;
}

export interface ReviewInput {
    rating: number;
    title: string;
    comment: string;
}

export const getProductReviews = async (productId: string): Promise<ProductReviewsResponse> => {
    try {
        const response = await apiClient.get<ProductReviewsResponse>(`/products/${productId}/reviews`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
    }
};

export const addReview = async (productId: string, reviewData: ReviewInput): Promise<Review> => {
    try {
        const response = await apiClient.post<Review>(`/products/${productId}/reviews`, reviewData);
        return response.data;
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
};


export const updateReview = async (reviewId: string, reviewData: Partial<ReviewInput>): Promise<Review> => {
    try {
        const response = await apiClient.put<Review>(`/reviews/${reviewId}`, reviewData);
        return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};


export const deleteReview = async (reviewId: string): Promise<{ message: string }> => {
    try {
        const response = await apiClient.delete<{ message: string }>(`/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};