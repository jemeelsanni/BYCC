/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import CheckoutForm from './CheckoutForm';
import { Link, useNavigate } from 'react-router-dom';
import { Flutterwave } from '../../assets/images';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder, redirectToStripeCheckout, OrderResponse } from '../../api/orders';
import { CartItem, ShippingAddress } from '@/types';

const Checkout: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<'bank' | 'online'>('bank');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [deliveryFee, setDeliveryFee] = useState<number>(2); // Default delivery fee
    const [total, setTotal] = useState<number>(0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
    const [activeTab, setActiveTab] = useState<'shipping' | 'payment'>('shipping');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();

        // Listen for shipping address submission events
        const handleShippingAddressSubmitted = (e: Event) => {
            setShippingAddress((e as CustomEvent<{ address: ShippingAddress }>).detail.address);
            setActiveTab('payment');
        };

        window.addEventListener('shipping-address-submitted', handleShippingAddressSubmitted);

        // Clean up event listener
        return () => {
            window.removeEventListener('shipping-address-submitted', handleShippingAddressSubmitted);
        };
    }, []);

    const loadCart = () => {
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            if (savedCart && savedCart !== "undefined") {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    setCartItems(parsedCart);
                    calculateTotals(parsedCart);
                } else {
                    // Redirect to products page if cart is empty
                    navigate('/product');
                }
            } else {
                // Redirect to products page if cart is empty
                navigate('/product');
            }
        } catch (e) {
            console.error("Error loading cart data:", e);
            setCartItems([]);
        }
    };

    const calculateTotals = (items: CartItem[]) => {
        const newSubtotal = items.reduce((sum, item) => {
            // Convert price to number if it's a string
            const numericPrice = typeof item.price === 'string'
                ? parseFloat(item.price)
                : item.price;

            // Only add to sum if it's a valid number
            return sum + (isNaN(numericPrice) ? 0 : numericPrice * item.quantity);
        }, 0);

        setSubtotal(newSubtotal);

        // Calculate delivery fee based on subtotal
        // Free shipping for orders over 50,000
        const newDeliveryFee = newSubtotal > 50 ? 0 : 2;
        setDeliveryFee(newDeliveryFee);

        // Set total
        setTotal(newSubtotal + newDeliveryFee);
    };

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

    const getImageUrl = (img: string | undefined, fallbackImage: string) => {
        return img || fallbackImage;
    };

    // Handle place order button click
    const handlePlaceOrder = async () => {
        // Check if shipping address is provided
        if (!shippingAddress) {
            alert("Please complete the shipping address form before placing your order.");
            setActiveTab('shipping');
            return;
        }

        // Check if user is logged in
        if (!user) {
            alert("Please log in to complete your order.");
            navigate('/login');
            return;
        }

        setIsPlacingOrder(true);
        setOrderError(null);

        try {
            // Convert cart items to order items format
            const orderItems = cartItems.map(item => {
                const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

                return {
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: price,
                    size: item.size || undefined,
                    color: item.color || undefined,
                    image: item.image || undefined
                };
            });

            // Create the order object
            const orderData = {
                orderItems,
                shippingAddress,
                paymentMethod: selectedMethod,
                subtotal,
                deliveryFee,
                total
            };

            // Send order to backend
            const response: OrderResponse = await createOrder(orderData);

            // Clear cart
            localStorage.removeItem('shopping-cart');

            // Set order complete
            setOrderComplete(true);

            // Redirect to appropriate page based on payment method
            if (selectedMethod === 'online' && response.checkoutUrl) {
                // For online payment, redirect to Stripe checkout
                redirectToStripeCheckout(response.checkoutUrl);
            } else {
                // For bank transfer, go to order confirmation page
                navigate('/order-confirmation', {
                    state: {
                        order: response.order,
                        paymentMethod: 'bank'
                    }
                });
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setOrderError("There was a problem processing your order. Please try again.");
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-8 lg:pt-16 pb-8">
            {/* Mobile tab navigation */}
            <div className="block md:hidden mb-4">
                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        className={`flex-1 py-2 text-center font-medium ${activeTab === 'shipping' ? 'border-b-2 border-[#BD3A3A] text-[#BD3A3A]' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('shipping')}
                    >
                        Shipping
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-medium ${activeTab === 'payment' ? 'border-b-2 border-[#BD3A3A] text-[#BD3A3A]' : 'text-gray-500'}`}
                        onClick={() => shippingAddress ? setActiveTab('payment') : null}
                    >
                        Payment
                    </button>
                </div>
            </div>

            <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 pb-10 lg:pb-[75px] mb-6 manrope-font'>
                <div>
                    {orderComplete && (
                        <div className='mb-4 font-bold text-[20px] lg:text-[26px]'>
                            <h3>Order Summary {cartItems.length} item(s)</h3>
                        </div>
                    )}

                    <div className='w-full border-b-2 border-[#F1EEEE] mb-[24px]'></div>

                    {cartItems.length > 0 && (
                        <div className='flex flex-col lg:flex-row items-start justify-between'>
                            {/* Product info and image */}
                            <div className='flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-[60px] items-start w-full lg:w-auto'>
                                <div className='w-full h-auto md:w-[207px] md:h-[182px]'>
                                    <img
                                        src={getImageUrl(cartItems[0].image, '/path/to/default-product-image.jpg')}
                                        alt={cartItems[0].name}
                                        className="w-full h-auto object-cover rounded-md md:rounded-none"
                                    />
                                </div>
                                <div className='w-full md:w-auto'>
                                    <div className='mb-4 md:mb-[34px]'>
                                        <h3 className='font-bold text-lg md:text-[20px] lg:text-[26px] mb-2 md:mb-[16px]'>
                                            {cartItems[0].name}
                                            {cartItems[0].code && <span className="block text-sm text-gray-500 mt-1">{cartItems[0].code}</span>}
                                        </h3>
                                        <p className='font-normal text-base md:text-[18px] lg:text-[20px]'>{cartItems[0].info} </p>

                                        {(cartItems[0].size || cartItems[0].color) && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {cartItems[0].size && (
                                                    <div className="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                                                        Size: <span className="font-medium">{cartItems[0].size}</span>
                                                    </div>
                                                )}
                                                {cartItems[0].color && (
                                                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
                                                        <span>Color:</span>
                                                        <div
                                                            className="w-3 h-3 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: cartItems[0].color }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className='mb-3 md:mb-[15px]'>
                                        <p className='font-bold text-xl md:text-[24px] lg:text-[30px]'>{formatPrice(cartItems[0].price)}</p>
                                    </div>
                                    <div className='font-normal text-base md:text-[20px] flex gap-4 md:gap-[33px]'>
                                        <p>Quantity:</p>
                                        <p>{cartItems[0].quantity}</p>
                                    </div>
                                    <div className='mt-4 md:mt-6'>
                                        <Link to="/cart">
                                            <button className="inline-flex items-center justify-center bg-[#BD3A3A] text-white rounded-lg px-4 md:px-8 lg:px-[55px] py-2 md:py-[13px] cursor-pointer">
                                                <span className="font-medium text-sm md:text-base">Modify Cart</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Order summary - Desktop shown on right, Mobile shown below */}
                            <div className='flex flex-col w-full lg:w-auto mt-6 lg:mt-0 border-t border-gray-200 pt-4 lg:pt-0 lg:border-t-0'>
                                <div className='hidden lg:block border-l-2 border-[#F1EEEE] h-[196px] mr-5'></div>
                                <div className=''>
                                    <div className="flex justify-between gap-4 md:gap-[180px] lg:gap-[293px] mb-0 lg:mb-2">
                                        <span className="text-base md:text-[20px] font-normal">Subtotal</span>
                                        <span className="text-base md:text-[20px] font-normal">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 lg:mt-[23px] pb-4 lg:pb-[38px] border-b-2 border-[#F1EEEE]">
                                        <span className="text-base md:text-[20px] font-normal">Delivery Fee</span>
                                        <span className="text-base md:text-[20px] font-normal">{formatPrice(deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 lg:mt-[20px]">
                                        <span className="text-base md:text-[20px] font-bold">Total</span>
                                        <span className="text-base md:text-[20px] font-bold">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='w-full border-b-2 border-[#F1EEEE] mt-6 md:mt-[44px]'></div>

                {/* Checkout content area - Mobile conditional display, Desktop always show */}
                <div className='mt-6 flex flex-col md:flex-row'>
                    <div className={`${activeTab === 'shipping' ? 'block' : 'hidden md:block'} w-full lg:w-[50%] mb-8 md:mb-0`}>
                        <CheckoutForm />
                    </div>

                    <div className={`${activeTab === 'payment' ? 'block' : 'hidden md:block'} w-full lg:w-[50%] lg:ml-auto`}>
                        <div className='mb-4 mt-4 lg:mt-0'>
                            <h3 className='manrope-font font-bold text-xl md:text-[27px] text-center md:text-left md:ml-[82px]'>CHECKOUT</h3>
                        </div>
                        <div className='w-full border-b-2 border-[#F1EEEE] mb-[24px]'></div>

                        <div className='mx-0 lg:ml-[82px] bg-[#FFF8F8] px-4 md:px-[24px] pt-6 md:pt-[42px] pb-6 md:pb-[50px] rounded-[10px]'>
                            {/* Bank Transfer Option */}
                            <div className='flex items-start cursor-pointer mb-6' onClick={() => setSelectedMethod('bank')}>
                                <div
                                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 mr-3 mt-1 ${selectedMethod === 'bank' ? 'border-red-500' : 'border-red-500'}`}
                                >
                                    {selectedMethod === 'bank' && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm md:text-[16px]">Direct Bank Transfer</h3>
                                    <p className="text-xs md:text-[14px] bg-[#FFFFFF] text-[#9F9F9F] rounded-[10px] py-3 px-3 md:py-4 md:pl-4 md:pr-16 mt-3 md:mt-6 w-full md:w-[280px] lg:w-full">
                                        Make your payment directly into our bank account. <br />
                                        Please use your Order ID as the payment reference. <br />
                                        Your order will not be shipped until the funds have cleared in our account.
                                    </p>
                                </div>
                            </div>

                            {/* Online Payment Option */}
                            <div className='flex items-start md:items-center cursor-pointer mt-4 md:mt-10' onClick={() => setSelectedMethod('online')}>
                                <div
                                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 mr-3 mt-1 ${selectedMethod === 'online' ? 'border-red-500' : 'border-red-500'}`}
                                >
                                    {selectedMethod === 'online' && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-9">
                                    <h3 className="font-semibold text-sm md:text-[16px]">Secured Online Payment</h3>
                                    <img src={Flutterwave} alt="Flutterwave" className="h-6 md:h-auto" />
                                </div>
                            </div>

                            <div className='mt-6 md:mt-[40px] lg:mt-[135px] text-xs md:text-[12px] ml-0 md:ml-10'>
                                <p className='font-normal'>Your personal data will be used to process your order, support your experience throughout <br className="hidden md:block" />
                                    this website, and for other purposes described in our privacy policy.</p>
                            </div>
                        </div>

                        {orderError && (
                            <div className="ml-0 lg:ml-[82px] mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {orderError}
                            </div>
                        )}

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || !shippingAddress}
                            className='w-full lg:w-[674px] text-white bg-[#BD3A3A] rounded-[10px] font-normal text-[16px] mt-6 md:mt-[39px] ml-0 lg:ml-[82px] p-4 disabled:opacity-70 disabled:cursor-not-allowed'
                        >
                            {isPlacingOrder ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Place Order'
                            )}
                        </button>

                        {/* Back to shipping button for mobile */}
                        {activeTab === 'payment' && (
                            <button
                                onClick={() => setActiveTab('shipping')}
                                className="md:hidden w-full text-gray-700 border border-gray-300 rounded-[10px] font-normal text-[16px] mt-4 p-3"
                            >
                                Back to Shipping Information
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout