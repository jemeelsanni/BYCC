// src/pages/OrderSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../api/orders';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
    name: string;
    quantity: number;
    image?: string;
}

interface Order {
    _id: string;
    orderItems: OrderItem[];
}

const OrderSuccess: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Get orderId from URL query parameters
                const searchParams = new URLSearchParams(location.search);
                const orderId = searchParams.get('orderId');

                if (!orderId) {
                    throw new Error('Order ID not found in URL');
                }

                setLoading(true);
                const orderData = await getOrderById(orderId) as unknown as Order;
                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Could not load order details');
                setLoading(false);
            }
        };

        // Redirect to login if user is not authenticated
        if (!user) {
            navigate('/login');
            return;
        }

        fetchOrder();
    }, [location, navigate, user]);

    if (loading) {
        return (
            <div className="mt-8 md:mt-24 mx-4 md:mx-24 text-center py-20">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4">Loading order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="mt-8 md:mt-24 mx-4 md:mx-24">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-8 text-center py-10">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="mb-6">{error || 'Order details not available.'}</p>
                    <Link to="/product" className="bg-[#BD3A3A] text-white px-6 py-3 rounded-lg">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 md:mt-24 mx-4 md:mx-24">
            <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-4 md:p-9 mt-[65px] manrope-font">
                <div className="text-center mb-8">
                    <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-gray-600">
                        Order Number: <span className="font-bold">{order._id}</span>
                    </p>
                    <p className="text-green-600 mt-2">Your payment has been processed successfully.</p>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-xl mb-4 border-b pb-2">Order Summary</h3>
                    <div className="space-y-4">
                        {order.orderItems && order.orderItems.map((item: OrderItem, index: number) => (
                            <div key={index} className="flex flex-col md:flex-row justify-between border-b pb-4">
                                <div className="flex gap-4">
                                    {item.image && (
                                        <div className="w-16 h-16">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                    <Link to="/product" className="bg-[#BD3A3A] text-white px-6 py-3 rounded-lg text-center">
                        Continue Shopping
                    </Link>
                    <Link to="/account/orders" className="border-2 border-[#BD3A3A] text-[#BD3A3A] px-6 py-3 rounded-lg text-center">
                        View All Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;