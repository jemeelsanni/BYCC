import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types';
import { Delete } from "../../assets/icons";
import { BlueBoxers } from '../../assets/images';
import { Star } from '../../assets/images';
import { Heart, ShoppingBag } from 'lucide-react';

const Wishlist: React.FC = () => {
    const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadWishlist();
        setIsLoading(false);

        window.addEventListener('wishlist-updated', loadWishlist);

        return () => {
            window.removeEventListener('wishlist-updated', loadWishlist);
        };
    }, []);

    const loadWishlist = () => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');

            if (savedWishlist && savedWishlist !== "undefined") {
                const parsedWishlist = JSON.parse(savedWishlist);

                if (Array.isArray(parsedWishlist)) {
                    const validItems = parsedWishlist.filter(item =>
                        item &&
                        item.id &&
                        item.name &&
                        item.price &&
                        (typeof item.price === 'number' ? item.price > 0 :
                            typeof item.price === 'string' ? parseFloat(item.price) > 0 : false)
                    );

                    setWishlistItems(validItems);

                    if (validItems.length !== parsedWishlist.length) {
                        localStorage.setItem('wishlist', JSON.stringify(validItems));
                        window.dispatchEvent(new CustomEvent('wishlist-updated'));
                    }
                } else {
                    console.error("Invalid wishlist format:", parsedWishlist);
                    setWishlistItems([]);
                    localStorage.setItem('wishlist', JSON.stringify([]));
                    window.dispatchEvent(new CustomEvent('wishlist-updated'));
                }
            } else {
                setWishlistItems([]);
            }
        } catch (e) {
            console.error("Error loading wishlist:", e);
            setWishlistItems([]);
            // Clear problematic wishlist
            localStorage.setItem('wishlist', JSON.stringify([]));
            window.dispatchEvent(new CustomEvent('wishlist-updated'));
        }
    };

    const removeFromWishlist = (id: string) => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');

            if (savedWishlist) {
                const wishlistItems = JSON.parse(savedWishlist);

                const updatedWishlist = wishlistItems.filter((item: CartItem) => item.id !== id);

                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

                setWishlistItems(updatedWishlist);

                showNotification(`Item removed from wishlist`);

                window.dispatchEvent(new CustomEvent('wishlist-updated'));
            }
        } catch (e) {
            console.error("Error removing item from wishlist:", e);
        }
    };

    const addToCart = (item: CartItem) => {
        try {
            let currentCart: CartItem[] = [];
            const savedCart = localStorage.getItem('shopping-cart');

            if (savedCart) {
                currentCart = JSON.parse(savedCart);
            }

            // Check if product is already in cart
            const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex >= 0) {
                // If item already exists, increase quantity
                currentCart[existingItemIndex].quantity += 1;
            } else {
                // Otherwise add new item to cart
                currentCart.push({ ...item, quantity: 1 });
            }

            // Update localStorage
            localStorage.setItem('shopping-cart', JSON.stringify(currentCart));

            // Clear the wishlist after adding to cart
            removeFromWishlist(item.id);

            // Show success notification
            showNotification(`${item.name} added to cart!`);

            // Dispatch event for components that listen to cart changes
            window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (e) {
            console.error("Error adding to cart:", e);
        }
    };

    // Format price to Nigerian Naira
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

    // Get fallback image if needed
    const getImageUrl = (img: string | undefined) => {
        return img || BlueBoxers;
    };

    // Show notification (toast)
    const showNotification = (message: string) => {
        // Create a toast element
        const toast = document.createElement('div');
        toast.className = 'fixed top-20 right-4 bg-[#BD3A3A] text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.style.animation = 'fadeIn 0.3s ease-out forwards';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove the toast after a delay
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
            </div>
        );
    }

    // Empty state
    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="container mt-12 mx-auto  border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                        <Heart size={36} className="text-gray-400" />
                    </div>
                </div>
                <p className="manrope-font font-bold text-xl md:text-2xl mb-2">Your wishlist is empty</p>
                <p className="manrope-font text-gray-500 mb-6 max-w-md mx-auto">Save items you love and want to revisit later by adding them to your wishlist.</p>
                <Link to="/products">
                    <button className="manrope-font inline-flex items-center justify-center bg-[#BD3A3A] text-white font-medium rounded-lg px-6 py-3 hover:bg-[#a52f2f] transition duration-200">
                        <ShoppingBag size={18} className="mr-2" />
                        <span>Browse Products</span>
                    </button>
                </Link>
            </div>
        );
    }

    // Render wishlist items
    return (
        <div className=" container mx-auto mt-12 border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <p className="manrope-font font-bold text-[20px]">
                    My Wishlist
                    <span className="text-[#BD3A3A] ml-2">
                        ({wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''})
                    </span>
                </p>
                <Link to="/products" className="text-[#BD3A3A] hover:text-[#a52f2f] manrope-font font-medium flex items-center mt-2 sm:mt-0">
                    <ShoppingBag size={18} className="mr-2" />
                    Continue Shopping
                </Link>
            </div>
            <div className="border-[#F1EEEE] border-b-2 mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map(item => (
                    <div key={item.id} className="w-full rounded-lg shadow-xl hover:bg-gray-100 transition duration-300 p-4 relative">
                        <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-red-50 transition-colors"
                            aria-label="Remove from wishlist"
                        >
                            <img src={Delete} alt="Remove" className="h-4 w-4" />
                        </button>

                        <Link to={`/product/${item.id}`}>
                            <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-[180px] object-cover rounded-t-lg"
                            />
                        </Link>

                        <div className="mx-2 mt-3">
                            <div className="jost-font">
                                <p className="uppercase font-bold text-[15px]">{item.name}</p>
                                <p className="font-light text-[14px]">{item.code || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="inter-font text-[11px] font-normal text-[#787885] mt-2">
                                    {item.info || 'No description available'}
                                </p>
                                <p className="manrope-font font-semibold text-[13px] mt-2">
                                    {formatPrice(item.price || 0)}
                                </p>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <img src={Star} alt="" className="w-16" />
                                <button
                                    onClick={() => addToCart(item)}
                                    className="bg-[#BD3A3A] text-white font-medium rounded-lg px-3 py-1 text-sm hover:bg-[#a52f2f] transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;