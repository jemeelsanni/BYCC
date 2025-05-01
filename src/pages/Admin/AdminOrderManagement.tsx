import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import Pagination from '../../components/ui/Pagination'; // Import the Pagination component
import AdminLayout from '../../components/layout/AdminLayout';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    user: {
        _id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    orderItems: OrderItem[];
    shippingAddress: {
        fullName: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        state: string;
    };
    paymentMethod: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    isPaid: boolean;
    paidAt?: Date;
    status: string;
    isDelivered: boolean;
    deliveredAt?: Date;
    trackingNumber?: string;
    createdAt: string;
}

const AdminOrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // For updating status
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [trackingNumber, setTrackingNumber] = useState<string>('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

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
        // Check if user is admin
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }

        const fetchOrders = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await getAllOrders() as unknown as Order[];
                setOrders(response);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, isAdmin, navigate]);

    // Filter orders based on status and search term
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = searchTerm === '' ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // Get current orders for pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Handle view order details
    const handleViewOrder = (orderId: string) => {
        navigate(`/admin/orders/${orderId}`);
    };

    // Handle update order status
    const handleUpdateStatus = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setTrackingNumber(order.trackingNumber || '');
        setShowModal(true);
        setUpdateError(null);
    };

    // Submit status update
    const handleSubmitUpdate = async () => {
        if (!selectedOrder) return;

        setUpdateLoading(true);
        setUpdateError(null);

        try {
            const result = await updateOrderStatus(
                selectedOrder._id,
                {
                    status: newStatus,
                    trackingNumber: trackingNumber || undefined
                }
            );
            const updatedOrder = result as unknown as Order;

            // Update the order in the local state
            setOrders((prevOrders) => {
                return prevOrders.map((order) => {
                    return order._id === updatedOrder._id ? updatedOrder : order;
                });
            });

            setUpdateSuccess(true);

            // Close modal after showing success message
            setTimeout(() => {
                setShowModal(false);
                setUpdateSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Error updating order status:', err);
            setUpdateError(
                err instanceof Error ? err.message : 'Failed to update order status'
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                < div className="mt-8 lg:mt-24 mx-4 lg:mx-24 text-center py-20" >
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-4">Loading orders...</p>
                </div >
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
                    <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-8 text-center py-10">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="mb-6">{error}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-[65px] manrope-font">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-6">Order Management</h1>

                    {/* Filters and Search */}
                    <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'all'
                                    ? 'bg-[#BD3A3A] text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'pending'
                                    ? 'bg-[#BD3A3A] text-white'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setStatusFilter('processing')}
                                className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'processing'
                                    ? 'bg-[#BD3A3A] text-white'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}
                            >
                                Processing
                            </button>
                            <button
                                onClick={() => setStatusFilter('shipped')}
                                className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'shipped'
                                    ? 'bg-[#BD3A3A] text-white'
                                    : 'bg-purple-100 text-purple-800'
                                    }`}
                            >
                                Shipped
                            </button>
                            <button
                                onClick={() => setStatusFilter('delivered')}
                                className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'delivered'
                                    ? 'bg-[#BD3A3A] text-white'
                                    : 'bg-green-100 text-green-800'
                                    }`}
                            >
                                Delivered
                            </button>
                            <button
                                onClick={() => setStatusFilter('cancelled')}
                                className={`px-3 py-1 rounded-md text-sm ${statusFilter === 'cancelled'
                                    ? 'bg-[#BD3A3A] text-white'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                Cancelled
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by order ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md w-full lg:w-auto"
                            />
                        </div>
                    </div>

                    {/* Order Table */}
                    {currentOrders.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No orders found matching your criteria.</p>
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
                                            Customer
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentOrders.map((order) => (
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
                                                <div className="text-sm text-gray-900">
                                                    {order.shippingAddress.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.shippingAddress.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold">
                                                    {formatPrice(order.total)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    {order.paymentMethod === 'bank' ? 'Bank Transfer' : 'Online Payment'}
                                                </div>
                                                <div className="text-sm">
                                                    <span className={`inline-flex px-2 text-xs rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                                        }`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewOrder(order._id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order)}
                                                        className="text-[#BD3A3A] hover:text-[#A52F2F]"
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination - using the imported Pagination component */}
                    {totalPages > 1 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={paginate}
                            />
                        </div>
                    )}
                </div>

                {/* Status Update Modal */}
                {showModal && selectedOrder && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>

                            {updateSuccess && (
                                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                                    Order status updated successfully!
                                </div>
                            )}

                            {updateError && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                    {updateError}
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Order ID: {selectedOrder._id}</p>
                                <p className="text-sm text-gray-600 mb-1">Customer: {selectedOrder.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-600">Current Status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </span></p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    New Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {newStatus === 'shipped' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Tracking Number
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter tracking number"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitUpdate}
                                    disabled={updateLoading}
                                    className="px-4 py-2 bg-[#BD3A3A] text-white rounded hover:bg-[#A52F2F] disabled:opacity-50"
                                >
                                    {updateLoading ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrderManagement;