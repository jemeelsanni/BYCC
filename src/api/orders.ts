import apiClient from './axios';
import { CartItem, Order, ShippingAddress } from '../types';

export interface OrderResponse {
  order: Order;
  checkoutUrl?: string;
}


export const createOrder = async (orderData: {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'bank' | 'online';
  subtotal: number;
  deliveryFee: number;
  total: number;
}): Promise<OrderResponse> => {
  try {
    console.log("Sending order data to API:", JSON.stringify(orderData, null, 2));
    
    const response = await apiClient.post<OrderResponse>('/orders', orderData);
    
    console.log("Server response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};


export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>('/orders/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  statusData: {
    status: string;
    trackingNumber?: string;
  }
): Promise<Order> => {
  try {
    const response = await apiClient.put<Order>(`/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    throw error;
  }
};

export const markOrderAsPaid = async (
  orderId: string,
  paymentData: {
    paymentId: string;
    email: string;
    notes?: string;
  }
): Promise<Order> => {
  try {
    const response = await apiClient.put<Order>(`/orders/${orderId}/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.error(`Error marking order ${orderId} as paid:`, error);
    throw error;
  }
};

export const redirectToStripeCheckout = (checkoutUrl: string) => {
  window.location.href = checkoutUrl;
};

export const prepareOrderItems = (cartItems: CartItem[]) => {
  const orderItems = cartItems.map(item => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    
    return {
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: price,
      size: item.size || undefined,
      color: item.color || undefined,
      image: item.image || undefined
    };
  });
  
  console.log("Prepared order items:", JSON.stringify(orderItems, null, 2));
  return orderItems;
};