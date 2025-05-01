// src/pages/Orders.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders } from '../api/orders';
import { useAuth } from '../contexts/AuthContext';
import { Footer, Navbar } from '../components/layout';

interface Order {
    _id: string;
    createdAt: string;
    total: number;
    status: string;
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Format price to Nigerian Naira
    const formatPrice = (price: string | number): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numericPrice)) return '₦0.00';

        const formattedPrice = (numericPrice * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return '₦' + formattedPrice;
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get status badge class
    const getStatusBadgeClass = (status: string): string => {
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user) {
                    navigate('/login');
                    return;
                }

                setLoading(true);
                const ordersData = await getUserOrders() as unknown as Order[];
                setOrders(ordersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load your orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="mt-8 md:mt-24 mx-4 md:mx-24 text-center py-20">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 md:mt-24 mx-4 md:mx-24">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-8 text-center py-10">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="mb-6">{error}</p>
                    <Link to="/product" className="bg-[#BD3A3A] text-white px-6 py-3 rounded-lg">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="mt-8 md:mt-24 mx-4 md:mx-24">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-4 md:p-9 mt-[65px] manrope-font">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>

                    {orders.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600 mb-6">You don't have any orders yet.</p>
                            <Link to="/product" className="bg-[#BD3A3A] text-white px-6 py-3 rounded-lg">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order._id.substring(0, 8)}...
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold">
                                                    {formatPrice(order.total)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex  whitespace-nowrap text-center text-sm font-medium">
                                                <Link
                                                    to={`/order-confirmation/${order._id}`}
                                                    className="text-[#BD3A3A]   hover:text-[#BD3A3A]/80"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Orders;