import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo, Cart, Favorite, Search, User } from "../../assets/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import ProductNavigation from "./ProductNavigation";
import { useAuth } from "../../contexts/AuthContext";
import UserMenu from "../Menu/UserMenu";
import MobileNav from "./MobileNav";
import { Product } from "../../types";
import { searchProducts } from "../../api/products";
import SearchResults from "../ui/SimpleSearchResults";

const Navbar: React.FC = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProductNavOpen, setIsProductNavOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const { loginWithRedirect, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Handle search input change
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (!value.trim() || value.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);
        try {
            // Make the search API call
            const result = await searchProducts(value);

            // Process the results based on the API response structure
            if (result && Array.isArray(result.products)) {
                setSearchResults(result.products);
            } else if (Array.isArray(result)) {
                setSearchResults(result);
            } else {
                console.error('Unexpected search result format:', result);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search result selection
    const handleResultSelection = () => {
        setShowResults(false);
        setIsSearchActive(false);
        setSearchQuery('');
    };

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            navigate(`/products/search?q=${encodeURIComponent(searchQuery)}`);
            setShowResults(false);
            setIsSearchActive(false);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update cart count on mount and when localStorage changes
    useEffect(() => {
        const updateCartCount = () => {
            try {
                const savedCart = localStorage.getItem('shopping-cart');
                if (savedCart) {
                    const cart = JSON.parse(savedCart);
                    if (Array.isArray(cart)) {
                        const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                        setCartItemCount(totalQuantity);
                    }
                } else {
                    setCartItemCount(0);
                }
            } catch (error) {
                console.error("Error loading cart", error);
                setCartItemCount(0);
            }
        };

        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cart-updated', updateCartCount);
        const intervalId = setInterval(updateCartCount, 1000);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cart-updated', updateCartCount);
            clearInterval(intervalId);
        };
    }, []);

    return (
        <header className="relative bg-white z-50 mb-4 md:mb-8 lg:mb-14 mt-10">
            {/* Mobile Navigation */}
            {<MobileNav
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />}

            {/* Product Navigation Dropdown */}
            {isProductNavOpen && (
                <div className="absolute top-full left-0 w-full bg-white z-50 shadow-md">
                    <ProductNavigation />
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
                <div className="flex items-center justify-between">
                    {/* Left Section: Mobile Menu & Logo / Desktop Navigation */}
                    <div className="flex items-center">
                        {/* Mobile: Hamburger Menu & Logo */}
                        <div className="flex md:hidden items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="text-gray-800 hover:text-gray-600 transition-colors"
                                aria-label="Open menu"
                            >
                                <FontAwesomeIcon icon={faBars} className="text-xl" />
                            </button>
                            <Link to="/" className="block">
                                <img src={Logo} alt="BYC Africa Logo" className="h-8 w-auto" />
                            </Link>
                        </div>

                        {/* Desktop: Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-6 ml-4">
                            <button
                                className="text-gray-800 hover:text-gray-600 font-medium capitalize transition-colors"
                                onClick={() => setIsProductNavOpen(!isProductNavOpen)}
                            >
                                Shop Products
                            </button>
                            <Link to="/blog" className="text-gray-800 hover:text-gray-600 font-medium capitalize transition-colors">
                                Blog
                            </Link>
                            <Link to="/" className="text-gray-800 hover:text-gray-600 font-medium uppercase transition-colors">
                                FAQ
                            </Link>
                        </nav>
                    </div>

                    {/* Center: Desktop Logo / Search */}
                    <div className="hidden md:flex items-center flex-grow justify-center" ref={searchRef}>
                        {!isSearchActive ? (
                            <Link to="/" className="mx-auto">
                                <img src={Logo} alt="BYC Africa Logo" className="h-10 w-auto" />
                            </Link>
                        ) : (
                            <div className="relative w-full max-w-2xl mx-8">
                                <form onSubmit={handleSearch} className="flex items-center border-b border-gray-400 py-2">
                                    <input
                                        type="text"
                                        placeholder="Search Products"
                                        className="outline-none bg-transparent w-full"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSearchActive(false);
                                            setSearchQuery('');
                                            setShowResults(false);
                                        }}
                                        className="ml-4 text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </form>

                                {/* Desktop search results dropdown */}
                                {showResults && (
                                    <div className="absolute z-50 w-full mt-1">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500 bg-white rounded-md shadow-lg">
                                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                                                Searching...
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <SearchResults
                                                products={searchResults}
                                                onResultClick={handleResultSelection}
                                            />
                                        ) : searchQuery.length >= 2 ? (
                                            <div className="p-4 text-center text-gray-500 bg-white rounded-md shadow-lg">
                                                No products found
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Section: Icons & User Menu */}
                    <div className="flex items-center">
                        {/* Mobile: User & Cart Icons */}
                        <div className="flex md:hidden items-center gap-4">
                            {isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <button onClick={() => loginWithRedirect()} aria-label="Login" className="text-gray-800">
                                    <img src={User} alt="Login" className="w-6 h-6" />
                                </button>
                            )}

                            <Link to="/cart" className="relative text-gray-800">
                                <img src={Cart} alt="Shopping Cart" className="w-6 h-6" />
                                {cartItemCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItemCount > 99 ? '99+' : cartItemCount}
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Desktop: Additional Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-6 mr-6">
                            <Link to="/about" className="text-gray-800 hover:text-gray-600 font-medium capitalize transition-colors">
                                About Us
                            </Link>
                            <Link to="/contact" className="text-gray-800 hover:text-gray-600 font-medium capitalize transition-colors">
                                Contact
                            </Link>
                        </nav>

                        {/* Desktop: Action Icons */}
                        <div className="hidden md:flex items-center space-x-6">
                            {!isSearchActive && (
                                <button
                                    onClick={() => setIsSearchActive(true)}
                                    aria-label="Search"
                                    className="text-gray-800 hover:text-gray-600 transition-colors"
                                >
                                    <img src={Search} alt="Search" className="w-5 h-5" />
                                </button>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <UserMenu />
                                    <Link to="/wishlist" className="text-gray-800 hover:text-gray-600 transition-colors">
                                        <img src={Favorite} alt="Wishlist" className="w-5 h-5" />
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={() => loginWithRedirect()}
                                    aria-label="Login"
                                    className="text-gray-800 hover:text-gray-600 transition-colors"
                                >
                                    <img src={User} alt="Login" className="w-5 h-5" />
                                </button>
                            )}

                            <Link to="/cart" className="relative text-gray-800 hover:text-gray-600 transition-colors">
                                <img src={Cart} alt="Shopping Cart" className="w-5 h-5" />
                                {cartItemCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItemCount > 99 ? '99+' : cartItemCount}
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="mt-4 md:hidden relative" ref={searchRef}>
                    <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search Products"
                            className="flex-grow px-4 py-2 outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button
                            type="submit"
                            className="bg-gray-100 px-4 py-2 text-gray-700"
                            aria-label="Search"
                        >
                            <img src={Search} alt="Search" className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Mobile search results dropdown */}
                    {showResults && (
                        <div className="absolute z-50 w-full mt-1">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 bg-white rounded-md shadow-lg">
                                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                                    Searching...
                                </div>
                            ) : searchResults.length > 0 ? (
                                <SearchResults
                                    products={searchResults}
                                    onResultClick={handleResultSelection}
                                />
                            ) : searchQuery.length >= 2 ? (
                                <div className="p-4 text-center text-gray-500 bg-white rounded-md shadow-lg">
                                    No products found
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;