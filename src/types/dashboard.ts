// types/dashboard.ts - Type definitions for dashboard components

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalBlogs: number;
    totalRevenue: number;
  }
  
  export interface AnalyticsDataPoint {
    name: string;
    revenue: number;
    orders: number;
  }
  
  export interface OrderStatusData {
    name: string;
    value: number;
  }
  
  export interface Product {
    _id: string;
    productName: string;
    productNumber: string;
    productPrice: string | number;
    productImage?: string[];
    productInfo?: string;
    [key: string]: unknown; // For other properties
    createdAt?: string;
  }
  
  export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    state: string;
    [key: string]: unknown;
  }
  
  export interface Order {
    _id: string;
    createdAt: string;
    total: number;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    shippingAddress: ShippingAddress;
    [key: string]: unknown; // For other properties
  }
  
  export interface BlogPost {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    imageUrl: string;
    views: number;
    likes: number;
    createdAt: string;
    [key: string]: unknown; // For other properties
  }
  
  export interface ProductsResponse {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }
  
  export interface BlogsResponse {
    articles: BlogPost[];
    totalArticles: number;
    currentPage: number;
    totalPages: number;
  }
  
  // Common utility functions
  
  export const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numericPrice)) {
        return '₦0.00';
    }

    const formattedPrice = (numericPrice * 1000).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return '₦' + formattedPrice;
};
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export const formatDate = (dateString: string, _p0: boolean): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  export const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };