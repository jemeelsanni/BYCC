import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, formatDate, formatPrice, getStatusBadgeClass } from '../../types/dashboard';

interface RecentOrdersProps {
    orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

    const toggleOrderExpand = (orderId: string) => {
        setExpandedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Recent Orders</h2>
                <Link
                    to="/admin/orders"
                    className="text-[#BD3A3A] hover:text-[#A52F2F] text-sm sm:text-base font-medium"
                >
                    View All Orders →
                </Link>
            </div>

            {orders.length > 0 ? (
                <>
                    {/* Desktop Table View (hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order._id ? order._id.substring(0, 8) + '...' : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {order.createdAt ? formatDate(order.createdAt, false) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {order.shippingAddress?.fullName || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold">
                                                {formatPrice(order.total || 0)}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status || 'pending')}`}>
                                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="text-[#BD3A3A] hover:text-[#A52F2F]"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (shown only on small screens) */}
                    <div className="md:hidden space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div
                                    className="px-4 py-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleOrderExpand(order._id || '')}
                                >
                                    <div>
                                        <div className="font-medium text-sm">
                                            Order #{order._id ? order._id.substring(0, 8) : 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.createdAt ? formatDate(order.createdAt, true) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full mr-2 ${getStatusBadgeClass(order.status || 'pending')}`}>
                                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                                        </span>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedOrders.includes(order._id || '') ? 'transform rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {expandedOrders.includes(order._id || '') && (
                                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                            <div>
                                                <div className="text-gray-500">Customer</div>
                                                <div className="font-medium">{order.shippingAddress?.fullName || "N/A"}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Total</div>
                                                <div className="font-bold text-[#BD3A3A]">{formatPrice(order.total || 0)}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-100 text-right">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center justify-center px-4 py-2 bg-[#BD3A3A] text-white text-xs font-medium rounded hover:bg-[#A52F2F]"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;