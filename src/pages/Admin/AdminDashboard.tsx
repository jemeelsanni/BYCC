import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../api/orders';
import { getProducts } from '../../api/products';
import { getArticles } from '../../api/blog';

// Import dashboard types
import {
    DashboardStats as StatsType,
    AnalyticsDataPoint,
    OrderStatusData,
    Order,
    Product,
    ProductsResponse,
    BlogsResponse
} from '../../types/dashboard';

// Import dashboard components
import DashboardStats from '../../components/dashboard/DashboardStats';
import TimePeriodSelector from '../../components/dashboard/TimePeriodSelector';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import RecentProducts from '../../components/dashboard/RecentProducts';
import RecentOrders from '../../components/dashboard/RecentOrders';
import AdminLayout from '../../components/layout/AdminLayout';

// Import analytics utilities
import {
    generateAnalyticsData,
    getOrdersByStatus
} from '../../components/dashboard/DashboardAnalytics';

const AdminDashboard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<StatsType>({
        totalProducts: 0,
        totalOrders: 0,
        totalBlogs: 0,
        totalRevenue: 0
    });
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [timePeriod, setTimePeriod] = useState<string>('monthly');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsDataPoint[]>([]);
    const [ordersByStatus, setOrdersByStatus] = useState<OrderStatusData[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch orders
                const orders = await getAllOrders() as unknown as Order[];

                // Fetch products
                const productsResponse = await getProducts(1, 8) as ProductsResponse;

                // Fetch blogs
                const blogsResponse = await getArticles(1, 4) as unknown as BlogsResponse;

                // Calculate total revenue from orders
                const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

                // Set stats
                setStats({
                    totalProducts: productsResponse.pagination?.totalItems || productsResponse.products?.length || 0,
                    totalOrders: orders?.length || 0,
                    totalBlogs: blogsResponse?.totalArticles || blogsResponse?.articles?.length || 0,
                    totalRevenue: totalRevenue || 0
                });

                // Set analytics data based on current time period
                setAnalyticsData(generateAnalyticsData(timePeriod, orders || []));

                // Set orders by status for pie chart
                setOrdersByStatus(getOrdersByStatus(orders || []));

                // Set recent products
                setRecentProducts(productsResponse.products || []);

                // Set recent orders (last 5)
                setRecentOrders((orders || []).slice(0, 5));

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Update analytics data when time period changes
    useEffect(() => {
        const updateAnalyticsData = async () => {
            try {
                if (!loading) {
                    const orders = await getAllOrders() as unknown as Order[];
                    setAnalyticsData(generateAnalyticsData(timePeriod, orders || []));
                }
            } catch (err) {
                console.error('Error updating analytics data:', err);
            }
        };

        updateAnalyticsData();
    }, [timePeriod, loading]);

    const handlePeriodChange = (period: string) => {
        setTimePeriod(period);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="mx-4 lg:mx-8">
                    <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-8 text-center py-10">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mx-4 lg:mx-8 mb-12">
                <div className="bg-white border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard Overview</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('admin/product/create')}
                                className="px-4 py-2 bg-[#BD3A3A] text-white rounded hover:bg-[#A52F2F]"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <DashboardStats stats={stats} />

                    {/* Time Period Selector */}
                    <TimePeriodSelector
                        selectedPeriod={timePeriod}
                        onPeriodChange={handlePeriodChange}
                    />

                    {/* Analytics Charts */}
                    <AnalyticsChart
                        data={analyticsData}
                        period={timePeriod}
                        ordersByStatus={ordersByStatus}
                    />

                    {/* Recent Products */}
                    <RecentProducts products={recentProducts} />

                    {/* Recent Orders */}
                    <RecentOrders orders={recentOrders} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;