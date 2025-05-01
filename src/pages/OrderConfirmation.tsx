import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/orders';
import { useAuth } from '../contexts/AuthContext';
import { Footer, Navbar } from '../components/layout';

interface OrderItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
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

interface Order {
    _id: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    deliveryFee: number;
    subtotal: number;
    total: number;
    isPaid: boolean;
    status: string;
    createdAt: string;
}

const OrderConfirmation: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Format price to Nigerian Naira
    const formatPrice = (price: string | number): string => {
        // Convert price to a number if it's a string
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

        // Check if it's a valid number
        if (isNaN(numericPrice)) {
            return '₦0.00';
        }

        // Convert to string with commas for thousands
        const formattedPrice = (numericPrice * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return '₦' + formattedPrice;
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);

                // First check if order was passed in location state
                if (location.state && location.state.order) {
                    setOrder(location.state.order);
                    setLoading(false);
                    return;
                }

                // If no order in state, try to fetch by ID
                if (!orderId) {
                    throw new Error('Order ID not provided');
                }

                const fetchedOrder = await getOrderById(orderId) as unknown as Order;
                setOrder(fetchedOrder);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Could not load order details. Please check your order history.');
                setLoading(false);
            }
        };

        // Check if user is logged in
        if (!user) {
            navigate('/login');
            return;
        }

        fetchOrderDetails();
    }, [location, orderId, navigate, user]);

    if (loading) {
        return (
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 text-center py-20">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4">Loading order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
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

    // Determine if this is a bank transfer order
    const isBankTransfer = order.paymentMethod === 'bank';

    return (
        <>
            <Navbar />
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-[65px] manrope-font">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600">
                            Order Number: <span className="font-bold">{order._id}</span>
                        </p>
                    </div>

                    {/* Payment Instructions for Bank Transfer */}
                    {isBankTransfer && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                            <h3 className="font-bold text-lg mb-2">Bank Transfer Instructions</h3>
                            <p className="mb-2">Please transfer the total amount of <span className="font-bold">{formatPrice(order.total)}</span> to:</p>
                            {order && (
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="mb-1"><span className="font-semibold">Bank Name:</span> First Bank of Nigeria</p>
                                    <p className="mb-1"><span className="font-semibold">Account Number:</span> 1234567890</p>
                                    <p className="mb-1"><span className="font-semibold">Account Name:</span> BYC Fashion Store</p>
                                    <p className="mb-4"><span className="font-semibold">Reference:</span> Order-{order?._id ? order._id.substring(0, 8) : 'N/A'}</p>
                                    <p className="text-sm text-gray-600">Your order will be processed once payment is confirmed.</p>
                                </div>
                            )}
                            {!order && (
                                <div className="text-center py-10">
                                    <p>Order information not available.</p>
                                    <Link to="/product" className="mt-4 inline-block bg-[#BD3A3A] text-white px-6 py-3 rounded-lg">
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="mb-8">
                        <h3 className="font-bold text-xl mb-4 border-b pb-2">Order Summary</h3>
                        <div className="space-y-4">
                            {order.orderItems.map((item: OrderItem, index: number) => (
                                <div key={index} className="flex flex-col lg:flex-row justify-between border-b pb-4">
                                    <div className="flex gap-4">
                                        {item.image && (
                                            <div className="w-16 h-16">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                                            {item.color && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span>Color:</span>
                                                    <div className="w-4 h-4 ml-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-semibold mt-2 lg:mt-0">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Shipping Information */}
                        <div>
                            <h3 className="font-bold text-xl mb-4 border-b pb-2">Shipping Information</h3>
                            <p className="mb-1"><span className="font-semibold">Name:</span> {order.shippingAddress.fullName}</p>
                            <p className="mb-1"><span className="font-semibold">Email:</span> {order.shippingAddress.email}</p>
                            <p className="mb-1"><span className="font-semibold">Phone:</span> {order.shippingAddress.phone}</p>
                            <p className="mb-1"><span className="font-semibold">Address:</span> {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</p>
                            {order.shippingAddress.company && <p className="mb-1"><span className="font-semibold">Company:</span> {order.shippingAddress.company}</p>}
                        </div>

                        {/* Payment Details */}
                        <div>
                            <h3 className="font-bold text-xl mb-4 border-b pb-2">Payment Details</h3>
                            <p className="mb-1"><span className="font-semibold">Payment Method:</span> {order.paymentMethod === 'bank' ? 'Bank Transfer' : 'Online Payment'}</p>
                            <p className="mb-1"><span className="font-semibold">Payment Status:</span> {order.isPaid ? 'Paid' : 'Pending'}</p>
                            <p className="mb-1"><span className="font-semibold">Order Status:</span> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                            <p className="mb-1"><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Order Totals */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping:</span>
                            <span>{formatPrice(order.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-center mt-8">
                        <Link to="/product" className="bg-[#BD3A3A] text-white px-6 py-3 rounded-lg text-center">
                            Continue Shopping
                        </Link>
                        <Link to="/account/orders" className="border-2 border-[#BD3A3A] text-[#BD3A3A] px-6 py-3 rounded-lg text-center">
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderConfirmation;