/* eslint-disable @typescript-eslint/no-explicit-any */
// Common types used across the application

// User types
export interface User {
    lastLogin: any;
    isAdmin: any;
    createdAt: any
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    // Extended user profile fields
    phone?: string;
    company?: string;
    country?: string;
    city?: string;
    state?: string;
    province?: string;
  }
  
  export interface UserRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // Product types
  
  
  // Cart types
  export interface CartItem {
    id: string;
    name: string;
    info?: string;
    code?: string;
    image?: string;
    price: number | string;
    quantity: number;
    size?: string;
    color?: string;
  }
  
  // Order types
  export interface ShippingAddress {
    fullName: string;
    company: string;
    country: string;
    city: string;
    state: string;
    province: string;
    phone: string;
    email: string;
  }
  
  export interface Order {
    _id: any;
    orderNumber: number;
    date: string;
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: 'bank' | 'online';
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  }
  // API Response types
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }


  export interface Article {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    authorTitle: string;
    imageUrl: string;
    imagePublicId: string;
    views: number;
    likes: number;
  likedBy: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaginatedArticlesResponse {
    articles: Article[];
    currentPage: number;
    totalPages: number;
    totalArticles: number;
  }
  
  export interface ArticleInput {
    title: string;
    content: string;
    authorName: string;
    authorTitle: string;
    image?: File;
  }
  
  export interface ViewResponse {
    views: number;
  }
  
  export interface UploadResponse {
    url: string;
  }

  export interface LikeResponse {
    likes: number;
    liked: boolean;
  }

  // src/types/index.ts

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Product {
  _id: string;
  productName: string;
  productNumber: string;
  category?: {
    _id: string;
    name: string;
  };
  productPrice: string;
  productInfo: string;
  productCategory?: string;
  productStock?: number;
  productImage: string[];
  productDescription?: string;
  productSize?: string;
  createdAt?: string;
  updatedAt?: string;
  averageRating?: number;
  reviewCount?: number;
  
}

export interface ProductReviewProps {
  productId: string;
}

export interface SidebarItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

