import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ShoppingBag,
    BookOpen,
    HelpCircle,
    Users,
    MessageSquare,
    Heart,
    LogIn,
    Home,
    Search,
    ShoppingCart
} from 'lucide-react';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Get cart and wishlist count from localStorage
    useEffect(() => {
        const updateCounts = () => {
            try {
                // Update cart count
                const cart = localStorage.getItem('shopping-cart');
                if (cart) {
                    const cartItems = JSON.parse(cart);
                    setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
                }

                // Update wishlist count
                const wishlist = localStorage.getItem('wishlist');
                if (wishlist) {
                    const wishlistItems = JSON.parse(wishlist);
                    setWishlistCount(Array.isArray(wishlistItems) ? wishlistItems.length : 0);
                }
            } catch (error) {
                console.error('Error updating counts:', error);
            }
        };

        updateCounts();

        // Listen for storage events
        window.addEventListener('cart-updated', updateCounts);
        window.addEventListener('wishlist-updated', updateCounts);

        return () => {
            window.removeEventListener('cart-updated', updateCounts);
            window.removeEventListener('wishlist-updated', updateCounts);
        };
    }, []);

    // Check if a route is active
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div
            className={`fixed inset-0 bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={onClose}
        >
            <div
                className={`fixed top-0 right-0 h-full bg-white w-4/5 max-w-sm shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#BD3A3A]">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-gray-100 py-2 pl-10 pr-4 rounded-lg outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-grow overflow-y-auto p-4">
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <Home size={20} className="mr-3" />
                                    <span className="font-medium">Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/product"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/product') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <ShoppingBag size={20} className="mr-3" />
                                    <span className="font-medium">Shop Products</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/blog') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <BookOpen size={20} className="mr-3" />
                                    <span className="font-medium">Blog</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/faq') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <HelpCircle size={20} className="mr-3" />
                                    <span className="font-medium">FAQ</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/about') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <Users size={20} className="mr-3" />
                                    <span className="font-medium">About Us</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/contact') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <MessageSquare size={20} className="mr-3" />
                                    <span className="font-medium">Contact</span>
                                </Link>
                            </li>
                        </ul>

                        <div className="border-t border-gray-200 my-4"></div>

                        {/* User Links */}
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/wishlist"
                                    className={`flex items-center justify-between p-3 rounded-lg ${isActive('/wishlist') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <Heart size={20} className="mr-3" />
                                        <span className="font-medium">Wishlist</span>
                                    </div>
                                    {wishlistCount > 0 && (
                                        <span className="bg-[#BD3A3A] text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/cart"
                                    className={`flex items-center justify-between p-3 rounded-lg ${isActive('/cart') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <ShoppingCart size={20} className="mr-3" />
                                        <span className="font-medium">Shopping Cart</span>
                                    </div>
                                    {cartCount > 0 && (
                                        <span className="bg-[#BD3A3A] text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className={`flex items-center p-3 rounded-lg ${isActive('/login') ? 'bg-[#BD3A3A] text-white' : 'hover:bg-gray-100'}`}
                                    onClick={onClose}
                                >
                                    <LogIn size={20} className="mr-3" />
                                    <span className="font-medium">Login / Register</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">© 2025 Your Store</div>
                            <div className="flex space-x-3">
                                <a href="#" className="text-gray-500 hover:text-[#BD3A3A]">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-500 hover:text-[#BD3A3A]">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-500 hover:text-[#BD3A3A]">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;