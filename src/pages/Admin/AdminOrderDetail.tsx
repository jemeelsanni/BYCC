/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { getStatusBadgeClass } from '@/types/dashboard';

interface OrderItem {
    _id?: string;
    id?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    company?: string;
}

interface PaymentResult {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
}

interface UserInfo {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface Order {
    _id: string;
    user: UserInfo;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: PaymentResult;
    subtotal: number;
    deliveryFee: number;
    total: number;
    isPaid: boolean;
    paidAt?: Date | string;
    isDelivered: boolean;
    deliveredAt?: Date | string;
    status: string;
    trackingNumber?: string;
    createdAt: string;
    updatedAt: string;
}

const AdminOrderDetail: React.FC = () => {
    // Get orderId from URL params
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Format price to Nigerian Naira
    const formatPrice = (price: number): string => {
        if (isNaN(price)) return '₦0.00';

        return '₦' + (price * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Format date
    const formatDate = (dateString?: string | Date): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge class

    useEffect(() => {
        // Check if user is admin
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await getOrderById(orderId);
                // @ts-ignore
                setOrder(result);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, user, isAdmin, navigate]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 text-center py-20">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-4">Loading order details...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error || !order) {
        return (
            <AdminLayout>
                <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
                    <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-8 text-center py-10">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="mb-6">{error || 'Order details not available.'}</p>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="bg-[#BD3A3A] text-white px-6 py-3 rounded-lg"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-[65px] manrope-font">
                    {/* Header with back button */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="flex items-center text-[#BD3A3A] hover:underline mb-2"
                            >
                                ← Back to Orders
                            </button>
                            <h1 className="text-2xl lg:text-3xl font-bold">Order Details</h1>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                            <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                            <p className="text-sm text-gray-600">Created: {formatDate(order.createdAt)}</p>
                        </div>
                    </div>

                    {/* Order Status Section */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Order Status</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-2">Payment Status</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                                {order.isPaid && order.paidAt && (
                                    <p className="text-sm text-gray-500 mt-1">Paid on: {formatDate(order.paidAt)}</p>
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-2">Delivery Status</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                                </span>
                                {order.isDelivered && order.deliveredAt && (
                                    <p className="text-sm text-gray-500 mt-1">Delivered on: {formatDate(order.deliveredAt)}</p>
                                )}
                            </div>
                        </div>

                        {order.trackingNumber && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <p className="text-sm font-medium">
                                    Tracking Number: <span className="font-semibold">{order.trackingNumber}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Customer and Shipping Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
                            <p className="text-gray-700 mb-1">
                                {order.user?.firstName || ''} {order.user?.lastName || ''}
                            </p>
                            <p className="text-gray-700 mb-1">{order.user?.email || order.shippingAddress?.email}</p>
                            <p className="text-gray-700 mb-1">{order.shippingAddress?.phone}</p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
                            <p className="text-gray-700 mb-1">{order.shippingAddress?.fullName}</p>
                            {order.shippingAddress?.company && (
                                <p className="text-gray-700 mb-1">{order.shippingAddress.company}</p>
                            )}
                            <p className="text-gray-700 mb-1">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state}
                            </p>
                            <p className="text-gray-700 mb-1">{order.shippingAddress?.country}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.orderItems.map((item, index) => (
                                        <tr key={item._id || item.id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {item.image && (
                                                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                            <img
                                                                className="h-10 w-10 rounded-md object-cover"
                                                                src={item.image}
                                                                alt={item.name}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-end">
                            <div className="w-full md:w-1/3">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Delivery Fee:</span>
                                    <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-lg font-bold text-[#BD3A3A]">{formatPrice(order.total)}</span>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">
                                    <p>Payment Method: {order.paymentMethod === 'bank' ? 'Bank Transfer' : 'Online Payment'}</p>
                                    {order.paymentResult && (
                                        <p className="mt-1">
                                            Transaction ID: {order.paymentResult.id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetail;