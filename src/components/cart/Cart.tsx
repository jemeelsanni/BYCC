import React, { useState, useEffect } from 'react';
import { BlueBoxers, Decrease, Increase } from '../../assets/images';
import { Like, Delete } from "../../assets/icons";
import { RecentlyViewed } from '../product';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    interface CartItem {
        id: string;
        name: string;
        info?: string;
        code?: string;
        image?: string;
        price: number;
        quantity: number;
        size?: string;
        color?: string;
    }

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        loadCart();

        window.addEventListener('storage', loadCart);
        window.addEventListener('cart-updated', loadCart);

        return () => {
            window.removeEventListener('storage', loadCart);
            window.removeEventListener('cart-updated', loadCart);
        };
    }, []);

    const loadCart = () => {
        try {
            const savedCart = localStorage.getItem('shopping-cart');

            if (savedCart && savedCart !== "undefined") {
                const parsedCart = JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    setCartItems(parsedCart);
                    calculateTotals(parsedCart);
                } else {
                    console.error("Invalid cart data format:", parsedCart);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        } catch (e) {
            console.error("Error loading cart data:", e);
            setCartItems([]);
        }
    };

    const calculateTotals = (items: CartItem[]) => {
        const newSubtotal = items.reduce((sum, item) => {
            const numericPrice = typeof item.price === 'string'
                ? parseFloat(item.price)
                : item.price;

            return sum + (isNaN(numericPrice) ? 0 : numericPrice * item.quantity);
        }, 0);

        setSubtotal(newSubtotal);
        setTotal(newSubtotal);
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);
        calculateTotals(updatedCart);
        localStorage.setItem('shopping-cart', JSON.stringify(updatedCart));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cart-updated'));
    };

    const removeItem = (id: string) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        calculateTotals(updatedCart);
        localStorage.setItem('shopping-cart', JSON.stringify(updatedCart));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cart-updated'));
    };

    const addToWishlist = (item: CartItem) => {
        try {
            let currentWishlist: CartItem[] = [];
            const savedWishlist = localStorage.getItem('wishlist');

            if (savedWishlist) {
                currentWishlist = JSON.parse(savedWishlist);
            }

            const isInWishlist = currentWishlist.some(wishlistItem => wishlistItem.id === item.id);

            if (!isInWishlist) {
                currentWishlist.push(item);
                localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

                window.dispatchEvent(new CustomEvent('wishlist-updated'));
            }
        } catch (e) {
            console.error("Error updating wishlist", e);
        }
    };

    const formatPrice = (price: string | number): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

        if (isNaN(numericPrice)) {
            return '₦0.00';
        }

        const formattedPrice = (numericPrice * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return '₦' + formattedPrice;
    };

    const getImageUrl = (img: string | undefined) => {
        return img || BlueBoxers;
    };

    const formatColor = (colorCode?: string): string => {
        if (!colorCode) return 'N/A';

        const colorMap: { [key: string]: string } = {
            '#3870C4': 'Blue',
            '#BD3A3A': 'Red',
            '#000000': 'Black'
        };

        return colorMap[colorCode] || colorCode;
    };

    return (
        <main className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-200">
                        <h1 className="font-bold text-xl md:text-2xl manrope-font">
                            Shopping Cart {cartItems.length > 0 && `(${cartItems.length} item${cartItems.length !== 1 ? 's' : ''})`}
                        </h1>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="mx-auto w-16 h-16 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                                <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
                                <Link to="/products">
                                    <button className="px-6 py-3 bg-[#BD3A3A] text-white font-medium rounded-lg hover:bg-[#a93434] transition-colors">
                                        Browse Products
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="p-4 md:p-6">
                                        <div className="hidden lg:grid grid-cols-5 gap-6 items-center">
                                            <div className="col-span-3 flex gap-6">
                                                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.name || "Product"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-lg">{item.name || "Product Name"}</h3>
                                                    <p className="text-gray-600 text-sm mt-1">{item.info || "Product Description"}</p>

                                                    {item.code && (
                                                        <p className="text-gray-500 text-xs mt-2">SKU: {item.code}</p>
                                                    )}

                                                    <div className="mt-2 flex gap-4">
                                                        {item.size && (
                                                            <p className="text-gray-600 text-sm">
                                                                Size: <span className="font-medium">{item.size}</span>
                                                            </p>
                                                        )}
                                                        {item.color && (
                                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                                <span>Color: <span className="font-medium">{formatColor(item.color)}</span></span>
                                                                <div
                                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: item.color }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-4 mt-4">
                                                        <button
                                                            onClick={() => addToWishlist(item)}
                                                            className="flex items-center text-sm border border-[#BD3A3A] text-[#BD3A3A] rounded-md px-3 py-1 hover:bg-red-50 transition-colors"
                                                        >
                                                            <img src={Like} alt="" className="h-4 w-4 mr-1" />
                                                            Save for later
                                                        </button>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
                                                        >
                                                            <img src={Delete} alt="" className="h-4 w-4 mr-1" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <img src={Decrease} alt="Decrease" className="w-5 h-5" />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value);
                                                            if (!isNaN(value) && value >= 1) {
                                                                handleQuantityChange(item.id, value);
                                                            }
                                                        }}
                                                        className="w-12 h-10 text-center outline-none manrope-font font-medium text-lg"
                                                        aria-label="Quantity"
                                                    />
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <img src={Increase} alt="Increase" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-xl">{formatPrice(item.price || 0)}</p>
                                            </div>
                                        </div>

                                        <div className="lg:hidden">
                                            <div className="flex">
                                                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-md overflow-hidden">
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        alt={item.name || "Product"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-bold text-base manrope-font">{item.name}</h3>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-red-600"
                                                            aria-label="Remove item"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {item.code && (
                                                        <p className="text-gray-500 text-xs mt-1">SKU: {item.code}</p>
                                                    )}

                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        {item.size && (
                                                            <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
                                                                Size: {item.size}
                                                            </div>
                                                        )}
                                                        {item.color && (
                                                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
                                                                <span>Color: {formatColor(item.color)}</span>
                                                                <div
                                                                    className="w-3 h-3 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: item.color }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        <p className="font-bold text-base">{formatPrice(item.price || 0)}</p>

                                                        <div className="flex items-center border border-gray-300 rounded-md">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-600"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value);
                                                                    if (!isNaN(value) && value >= 1) {
                                                                        handleQuantityChange(item.id, value);
                                                                    }
                                                                }}
                                                                className="w-10 h-8 text-center outline-none text-sm font-medium"
                                                                aria-label="Quantity"
                                                            />
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-600"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => addToWishlist(item)}
                                                        className="mt-3 text-[#BD3A3A] text-xs flex items-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a1 1 0 000 1.414l4.243 4.243a1 1 0 001.414 0l4.243-4.243a1 1 0 000-1.414 1 1 0 00-1.414 0L8 10.586l-3.293-3.293a1 1 0 00-1.414 0z" />
                                                        </svg>
                                                        Save for later
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200">
                            <div className="p-4 md:p-6">
                                <div className="max-w-md ml-auto">
                                    <h2 className="font-bold text-lg md:text-xl mb-4">Order Summary</h2>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">Calculated at checkout</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-lg">Total</span>
                                            <span className="font-bold text-lg">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Link to="/products">
                                            <button className="w-full py-2 px-4 border border-[#BD3A3A] text-[#BD3A3A] font-medium rounded-lg hover:bg-red-50 transition-colors text-center">
                                                Continue Shopping
                                            </button>
                                        </Link>
                                        <Link to="/checkout">
                                            <button className="w-full py-2 px-4 bg-[#BD3A3A] text-white font-medium rounded-lg hover:bg-[#a93434] transition-colors text-center">
                                                Proceed to Checkout
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <section className="mt-12 md:mt-16 lg:mt-24">
                    <RecentlyViewed />
                </section>
            </div>
        </main>
    );
};

export default Cart;