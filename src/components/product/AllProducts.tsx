import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Scart, Like } from '../../assets/icons';
import CategoryDropdown from '../ui/CategoryDropdown';
import ViewToggle from '../ui/Toggle';
import Pagination from '../ui/Pagination';
import RecentlyViewed from './RecentlyViewed';
import { getProducts, getProductsByCategory } from '../../api/products';
import { ChevronDown, Filter } from 'lucide-react';
import { CartItem, PaginationData, Product } from '../../types';



const AllProducts: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);
    const [cartMessageProduct, setCartMessageProduct] = useState("");
    const [wishlistMessageProduct, setWishlistMessageProduct] = useState("");
    const [currentCategory, setCurrentCategory] = useState('All Products');
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    });

    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState<{ min: number, max: number | null }>({ min: 0, max: null });
    const [sortBy, setSortBy] = useState('newest');

    const navigate = useNavigate();

    // Get page from URL or default to 1
    const currentPage = parseInt(searchParams.get('page') || '1');

    // Load view preference from localStorage
    useEffect(() => {
        const savedView = localStorage.getItem('product-view-mode');
        if (savedView === 'list' || savedView === 'grid') {
            setViewMode(savedView);
        }
    }, []);

    // Update view mode and save to localStorage
    const handleViewChange = (view: 'grid' | 'list') => {
        setViewMode(view);
        localStorage.setItem('product-view-mode', view);
    };

    // Update the useEffect part in AllProducts.tsx that sets up the wishlist state
    // Replace the current wishlist setup code with this:

    useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                try {
                    const parsedWishlist = JSON.parse(savedWishlist);
                    if (Array.isArray(parsedWishlist)) {
                        // Extract just the IDs for the wishlist state
                        setWishlist(parsedWishlist.map(item => item.id));
                    } else {
                        setWishlist([]);
                    }
                } catch (e) {
                    console.error("Error parsing wishlist:", e);
                    setWishlist([]);
                }
            }
        } catch (e) {
            console.error("Error loading wishlist from localStorage", e);
        }

        // Listen for wishlist updates
        const handleWishlistUpdate = () => {
            try {
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    const parsedWishlist = JSON.parse(savedWishlist);
                    if (Array.isArray(parsedWishlist)) {
                        // Extract just the IDs for the wishlist state
                        setWishlist(parsedWishlist.map(item => item.id));
                    } else {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }
            } catch (e) {
                console.error("Error handling wishlist update", e);
            }
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdate);

        return () => {
            window.removeEventListener('wishlist-updated', handleWishlistUpdate);
        };
    }, []);

    const renderRating = (rating: number, reviewCount: number) => {
        return (
            <div className="flex items-center mt-1">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`text-${star <= Math.round(rating || 0) ? 'yellow' : 'gray'}-400 text-sm`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                    ({reviewCount || 0})
                </span>
            </div>
        );
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

    // Extract numeric price for sorting/filtering
    const getNumericPrice = (price: string | number): number => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numericPrice || 0;
    };

    const handleCategoryChange = async (category: string) => {
        setCurrentCategory(category);
        setLoading(true);
        try {
            const response = await getProductsByCategory(category, 1);
            setProducts(response.products);
            setPagination(response.pagination);

            // Reset to page 1 when changing category
            setSearchParams({ page: '1' });

            setLoading(false);
        } catch (err) {
            console.error(`Error fetching ${category} products:`, err);
            setError(`Failed to load ${category} products`);
            setLoading(false);
        }
    };

    const handlePageChange = async (page: number) => {
        setLoading(true);
        try {
            let response;
            if (currentCategory === 'All Products') {
                response = await getProducts(page);
            } else {
                response = await getProductsByCategory(currentCategory, page);
            }

            setProducts(response.products);
            setPagination(response.pagination);
            // Update URL with new page number
            setSearchParams({ page: page.toString() });

            // Scroll to top when changing page
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setLoading(false);
        } catch (err) {
            console.error(`Error fetching page ${page}:`, err);
            setError(`Failed to load page ${page}`);
            setLoading(false);
        }
    };

    // Apply filters
    useEffect(() => {
        if (!products.length) return;

        let filtered = [...products];

        // Apply search filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productInfo?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply price filter
        if (priceRange.min > 0 || priceRange.max) {
            filtered = filtered.filter(product => {
                const price = getNumericPrice(product.productPrice);
                if (priceRange.min > 0 && priceRange.max) {
                    return price >= priceRange.min && price <= priceRange.max;
                } else if (priceRange.min > 0) {
                    return price >= priceRange.min;
                } else if (priceRange.max) {
                    return price <= priceRange.max;
                }
                return true;
            });
        }

        // Apply sorting
        if (sortBy === 'newest') {
            filtered.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => getNumericPrice(b.productPrice) - getNumericPrice(a.productPrice));
        } else if (sortBy === 'price-low') {
            filtered.sort((a, b) => getNumericPrice(a.productPrice) - getNumericPrice(b.productPrice));
        } else if (sortBy === 'name-asc') {
            filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortBy === 'name-desc') {
            filtered.sort((a, b) => b.productName.localeCompare(a.productName));
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, priceRange, sortBy]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts(currentPage);
                setProducts(response.products);
                setFilteredProducts(response.products);
                setPagination(response.pagination);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    // Add product to recently viewed
    const addToRecentlyViewed = (product: Product) => {
        try {
            // Make sure the product has all required fields before adding to recently viewed
            if (!product || !product._id || !product.productName || !product.productPrice ||
                !Array.isArray(product.productImage) || product.productImage.length === 0) {
                console.error("Invalid product data for recently viewed:", product);
                return;
            }

            // Create a simplified version of the product to store
            const productToStore = {
                _id: product._id,
                productName: product.productName,
                productNumber: product.productNumber || '',
                productPrice: product.productPrice,
                productImage: product.productImage,
                productInfo: product.productInfo || ''
            };

            let recentlyViewed = [];
            const savedRecentlyViewed = localStorage.getItem('recently-viewed');

            if (savedRecentlyViewed) {
                try {
                    recentlyViewed = JSON.parse(savedRecentlyViewed);
                    // Make sure it's an array
                    if (!Array.isArray(recentlyViewed)) {
                        recentlyViewed = [];
                    }
                } catch (e) {
                    console.error("Error parsing recently viewed products:", e);
                    recentlyViewed = [];
                }
            }

            // Remove if product is already in the list
            const filteredList = recentlyViewed.filter((item: { _id?: string }) =>
                item && item._id && item._id !== product._id
            );

            // Add product to the beginning of the list
            filteredList.unshift(productToStore);

            // Keep only the last 6 items
            const limitedList = filteredList.slice(0, 6);

            localStorage.setItem('recently-viewed', JSON.stringify(limitedList));
            window.dispatchEvent(new CustomEvent('recently-viewed-updated'));
        } catch (e) {
            console.error("Error updating recently viewed products", e);
        }
    };

    const addToCart = (product: Product, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        let currentCart = [];
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            if (savedCart) {
                currentCart = JSON.parse(savedCart);
            }
        } catch (e) {
            console.error("Error loading cart from localStorage", e);
        }

        const existingItemIndex = currentCart.findIndex((item: { id: string }) => item.id === product._id);

        if (existingItemIndex >= 0) {
            currentCart[existingItemIndex].quantity += 1;
        } else {
            const cartItem = {
                id: product._id,
                name: product.productName,
                info: product.productInfo,
                price: product.productPrice,
                image: product.productImage[0],
                code: product.productNumber,
                quantity: 1
            };
            currentCart.push(cartItem);
        }

        localStorage.setItem('shopping-cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cart-updated'));

        setCartMessageProduct(product.productName);
        setShowCartMessage(true);

        setTimeout(() => {
            setShowCartMessage(false);
        }, 2000);
    };

    // Replace the addToWishlist function in AllProducts.tsx with this implementation:

    // Updated addToWishlist function for AllProducts.tsx with validation
    const addToWishlist = (product: Product, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // Validate product has required fields before proceeding
        if (!product || !product._id || !product.productName ||
            !product.productPrice || parseFloat(product.productPrice) <= 0 ||
            !Array.isArray(product.productImage) || product.productImage.length === 0) {
            console.error("Invalid product data for wishlist:", product);
            return;
        }

        try {
            let currentWishlist: CartItem[] = [];
            const savedWishlist = localStorage.getItem('wishlist');

            if (savedWishlist) {
                try {
                    const parsedWishlist = JSON.parse(savedWishlist);
                    if (Array.isArray(parsedWishlist)) {
                        // Filter out any invalid items
                        currentWishlist = parsedWishlist.filter(item =>
                            item && item.id && item.name && item.price &&
                            (typeof item.price === 'number' ? item.price > 0 :
                                typeof item.price === 'string' ? parseFloat(item.price) > 0 : false)
                        );
                    }
                } catch (e) {
                    console.error("Error parsing wishlist:", e);
                }
            }

            // Check if product is already in wishlist
            const isProductInWishlist = wishlist.includes(product._id);

            if (!isProductInWishlist) {
                // Convert Product to CartItem format
                const wishlistItem = {
                    id: product._id,
                    name: product.productName,
                    info: product.productInfo || '',
                    price: product.productPrice,
                    image: product.productImage[0],
                    code: product.productNumber || '',
                    quantity: 1
                };

                // Add the new item to the wishlist (keep existing valid items)
                currentWishlist.push(wishlistItem);

                // Show success message
                setWishlistMessageProduct(product.productName);
                setShowWishlistMessage(true);
                setTimeout(() => {
                    setShowWishlistMessage(false);
                }, 2000);
            } else {
                // If already in wishlist, remove it
                currentWishlist = currentWishlist.filter(item => item.id !== product._id);
            }

            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

            // Update wishlist state with the IDs from the updated wishlist
            setWishlist(currentWishlist.map(item => item.id));

            // Dispatch event for components that listen to wishlist changes
            window.dispatchEvent(new CustomEvent('wishlist-updated'));
        } catch (e) {
            console.error("Error updating wishlist", e);
        }
    };
    // Replace the isInWishlist function in AllProducts.tsx
    // This correctly checks the wishlist items based on the updated data structure
    // This version uses the wishlist state variable to check if a product is in the wishlist


    const isInWishlist = (productId: string) => {
        return wishlist.includes(productId);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setPriceRange({ min: 0, max: null });
        setSortBy('newest');
    };

    if (loading && !products.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
                    <p className="text-lg font-medium mb-4">{error}</p>
                    <button
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center py-12 max-w-md">
                    <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
                    <p className="text-gray-600 mb-6">Be the first to add products to the BYC store.</p>
                    <Link
                        to="/product/create"
                        className="inline-block px-6 py-3 bg-[#BD3A3A] text-white font-medium rounded-lg hover:bg-[#a93434] transition-colors"
                    >
                        Create Your First Product
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Notification Toasts */}
                {showCartMessage && (
                    <div className="fixed top-20 right-4 md:right-10 z-50 max-w-sm">
                        <div className="bg-[#BD3A3A] text-white p-4 rounded-lg shadow-lg animate-fadeIn">
                            <div className="flex items-center justify-between gap-4">
                                <p>{cartMessageProduct} added to cart!</p>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="bg-white text-[#BD3A3A] px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                    View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showWishlistMessage && (
                    <div className="fixed top-20 right-4 md:right-10 z-50 max-w-sm">
                        <div className="bg-[#BD3A3A] text-white p-4 rounded-lg shadow-lg animate-fadeIn">
                            <div className="flex items-center justify-between gap-4">
                                <p>{wishlistMessageProduct} added to wishlist!</p>
                                <button
                                    onClick={() => navigate('/wishlist')}
                                    className="bg-white text-[#BD3A3A] px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                    View Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Container */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-4 md:p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h1 className="manrope-font font-bold text-xl md:text-2xl">
                                {currentCategory === 'All Products' ? 'All Products' : `${currentCategory}'s Products`}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Filter Toggle Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    aria-expanded={showFilters}
                                    aria-controls="filter-panel"
                                >
                                    <Filter size={16} />
                                    <span className="hidden md:inline">Filters</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                                    />
                                </button>


                                <CategoryDropdown
                                    onCategoryChange={handleCategoryChange}
                                    initialCategory="All Products"
                                />

                            </div>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div
                            id="filter-panel"
                            className="p-4 md:p-6 bg-gray-50 border-b border-gray-200 animate-fadeIn"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                {/* Search Filter */}
                                <div>
                                    <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Products
                                    </label>
                                    <input
                                        id="searchFilter"
                                        type="text"
                                        placeholder="Search by name or SKU..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent"
                                    />
                                </div>

                                {/* Price Range Filter */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Price
                                        </label>
                                        <input
                                            id="minPrice"
                                            type="number"
                                            min="0"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="self-center mt-6">—</div>
                                    <div className="flex-1">
                                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Price
                                        </label>
                                        <input
                                            id="maxPrice"
                                            type="number"
                                            min="0"
                                            value={priceRange.max || ''}
                                            onChange={(e) => setPriceRange({
                                                ...priceRange,
                                                max: e.target.value ? parseInt(e.target.value) : null
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Sort By Dropdown */}
                                <div>
                                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <select
                                        id="sortBy"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BD3A3A] focus:border-transparent"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="name-asc">Name: A to Z</option>
                                        <option value="name-desc">Name: Z to A</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Toggle & Results Count */}
                    <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600">
                            Showing {filteredProducts.length} of {pagination.totalItems} products
                        </p>
                        <ViewToggle activeView={viewMode} onViewChange={handleViewChange} />
                    </div>

                    {/* Products Display */}
                    {filteredProducts.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-600 mb-4">No products found matching your filters.</p>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-[#BD3A3A] text-white rounded-md hover:bg-[#a93434] transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className={`p-4 md:p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' : 'flex flex-col gap-4 md:gap-6'}`}>
                            {filteredProducts.map(product => (
                                <div
                                    key={product._id}
                                    className={`group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${viewMode === 'list' ? 'flex' : ''}`}
                                    onMouseEnter={() => setHoveredIndex(product._id)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <Link
                                        to={`/product/${product._id}`}
                                        className={`${viewMode === 'list' ? 'flex-shrink-0 w-1/3' : 'block'}`}
                                        onClick={() => addToRecentlyViewed(product)}
                                    >
                                        <div className={`aspect-square overflow-hidden ${viewMode === 'list' ? 'h-full' : ''}`}>
                                            <img
                                                src={product.productImage && product.productImage[0] ? product.productImage[0] : '/placeholder-image.jpg'}
                                                alt={product.productName}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>

                                    <div className={`p-4 flex flex-col ${viewMode === 'list' ? 'flex-grow' : ''}`}>
                                        <Link
                                            to={`/product/${product._id}`}
                                            onClick={() => addToRecentlyViewed(product)}
                                        >
                                            <h2 className="jost-font uppercase font-bold text-base md:text-lg mb-1 line-clamp-1">{product.productName}</h2>
                                            <p className="jost-font font-light text-sm text-gray-600 mb-2">{product.productNumber || 'N/A'}</p>

                                            <div className="mb-2 min-h-[40px]">
                                                <p className="inter-font text-xs text-gray-600 line-clamp-2">
                                                    {product.productInfo || 'No description available'}
                                                </p>
                                            </div>

                                            <p className="manrope-font font-semibold text-sm md:text-base mb-2">{formatPrice(product.productPrice)}</p>

                                            {renderRating(product.averageRating || 0, product.reviewCount || 0)}
                                        </Link>

                                        {/* Action Buttons - Always visible on mobile, hover on desktop */}
                                        <div className={`flex gap-2 mt-3 transition-opacity duration-200 ${hoveredIndex === product._id ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>

                                            <>
                                                <button
                                                    onClick={(e) => addToWishlist(product, e)}
                                                    className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded border ${isInWishlist(product._id) ? 'bg-[#BD3A3A] text-white' : 'border-[#BD3A3A] text-[#BD3A3A]'} transition-colors`}
                                                    aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                                >
                                                    <img src={Like} alt="" className="h-4 w-4" />
                                                    <span className="text-xs md:text-sm font-medium">
                                                        {isInWishlist(product._id) ? 'Saved' : 'Wishlist'}
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={(e) => addToCart(product, e)}
                                                    className="flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded bg-[#BD3A3A] text-white transition-colors hover:bg-[#a93434]"
                                                    aria-label="Add to cart"
                                                >
                                                    <img src={Scart} alt="" className="h-4 w-4" />
                                                    <span className="text-xs md:text-sm font-medium">Add to Cart</span>
                                                </button>
                                            </>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="p-4 md:p-6 border-t border-gray-200 flex justify-center">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                {/* Recently Viewed Section */}
                <section className="mt-12 md:mt-16 lg:mt-24">
                    <RecentlyViewed />
                </section>
            </div>
        </main>
    );
};

export default AllProducts;