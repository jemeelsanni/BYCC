/* eslint-disable no-prototype-builtins */
import { AnalyticsDataPoint, Order, OrderStatusData } from '../../types/dashboard';

// Generate analytics data based on selected time period

export const formatDate = (dateString: string, shortFormat: boolean = false): string => {
  const date = new Date(dateString);
  
  if (shortFormat) {
    // Short format for mobile views
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  
  // Regular format with full date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const generateAnalyticsData = (period: string, orders: Order[]): AnalyticsDataPoint[] => {
  const data: AnalyticsDataPoint[] = [];
  const now = new Date();
  
  if (period === 'daily') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Filter orders for this day
      const dayOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getDate() === date.getDate() && 
               orderDate.getMonth() === date.getMonth() &&
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      data.push({
        name: dayStr,
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }
  } else if (period === 'weekly') {
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekStr = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      // Filter orders for this week
      const weekOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });
      
      const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      data.push({
        name: weekStr,
        revenue: weekRevenue,
        orders: weekOrders.length
      });
    }
  } else if (period === 'monthly') {
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      // Filter orders for this month
      const monthOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      data.push({
        name: monthStr,
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }
  } else if (period === 'yearly') {
    // Last 3 years
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      const yearStr = date.getFullYear().toString();
      
      // Filter orders for this year
      const yearOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === date.getFullYear();
      });
      
      const yearRevenue = yearOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      data.push({
        name: yearStr,
        revenue: yearRevenue,
        orders: yearOrders.length
      });
    }
  }
  
  return data;
};

// Get orders by status for pie chart
export const getOrdersByStatus = (orders: Order[]): OrderStatusData[] => {
  const statusCounts: Record<string, number> = {
    'pending': 0,
    'processing': 0,
    'shipped': 0,
    'delivered': 0,
    'cancelled': 0
  };
  
  orders.forEach(order => {
    const status = order.status || 'pending';
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });
  
  return Object.entries(statusCounts)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value > 0) // Only include statuses with orders
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
};