import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Scart, Like } from '../../assets/icons';
import { getProducts } from '../../api/products';
import { Product } from '../../types';
import { ArrivalsView } from "../ui/Buttons";

const CategorySection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('men');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);
    const [cartMessageProduct, setCartMessageProduct] = useState("");
    const [wishlistMessageProduct, setWishlistMessageProduct] = useState("");

    const navigate = useNavigate();
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                let page = 1;
                let allProducts: Product[] = [];
                let hasMore = true;

                while (hasMore) {
                    const response = await getProducts(page);
                    if (response?.products?.length) {
                        allProducts = [...allProducts, ...response.products];
                        page++;
                    } else {
                        hasMore = false;
                    }
                }

                setProducts(allProducts);
                filterProductsByCategory('men', allProducts);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    const filterProductsByCategory = (category: string, productsToFilter: Product[] = products) => {
        const categoryMap: Record<string, string[]> = {
            'men': ['men', 'Men', 'MEN'],
            'women': ['women', 'Women', 'WOMEN'],
            'kids': ['children', 'Children', 'CHILDREN', 'kids', 'Kids', 'KIDS']
        };

        const categoryTerms = categoryMap[category] || [category];

        const filtered = productsToFilter.filter(product => {
            const categoryName = typeof product.category === 'string'
                ? product.category
                : product.category?.name || '';

            return categoryTerms.some(term =>
                categoryName.toLowerCase() === term.toLowerCase()
            );
        });

        setFilteredProducts(filtered.slice(0, 6));
        setCurrentIndex(0);
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        filterProductsByCategory(category);
    };

    // Load wishlist from localStorage
    useEffect(() => {
        const loadWishlist = () => {
            try {
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    const parsedWishlist = JSON.parse(savedWishlist);
                    if (Array.isArray(parsedWishlist)) {
                        setWishlist(parsedWishlist.map(item => item.id));
                    }
                }
            } catch (e) {
                console.error("Error loading wishlist:", e);
            }
        };

        loadWishlist();

        const handleStorageChange = () => loadWishlist();
        window.addEventListener('wishlist-updated', handleStorageChange);
        return () => window.removeEventListener('wishlist-updated', handleStorageChange);
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Carousel navigation
    const nextSlide = () => {
        if (isMobile) {
            setCurrentIndex(prev => (prev + 1) % filteredProducts.length);
        } else {
            const nextIndex = currentIndex + 3;
            if (nextIndex >= filteredProducts.length) {
                // If we're at the end, don't loop but show remaining products
                if (currentIndex < filteredProducts.length - 1) {
                    setCurrentIndex(filteredProducts.length - 3);
                } else {
                    setCurrentIndex(0);
                }
            } else {
                setCurrentIndex(nextIndex);
            }
        }
    };

    const prevSlide = () => {
        if (isMobile) {
            setCurrentIndex(prev => (prev - 1 + filteredProducts.length) % filteredProducts.length);
        } else {
            const prevIndex = currentIndex - 3;
            setCurrentIndex(prevIndex < 0 ? 0 : prevIndex);
        }
    };

    // Get visible products for current slide
    const getVisibleProducts = () => {
        if (isMobile) {
            return [filteredProducts[currentIndex]];
        } else {
            // Show up to 3 products, handling cases where less than 3 remain
            return filteredProducts.slice(currentIndex, currentIndex + 3);
        }
    };

    // Format price to Nigerian Naira
    const formatPrice = (price: string | number): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numericPrice)) return '₦0.00';

        return '₦' + (numericPrice * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Add to recently viewed
    const addToRecentlyViewed = (product: Product) => {
        try {
            if (!product?._id || !product.productName || !product.productPrice || !product.productImage?.length) return;

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
                recentlyViewed = JSON.parse(savedRecentlyViewed);
                if (!Array.isArray(recentlyViewed)) recentlyViewed = [];
            }

            // Remove if already exists and add to beginning
            const filteredList = recentlyViewed.filter((item: { _id?: string }) => item?._id !== product._id);
            filteredList.unshift(productToStore);
            const limitedList = filteredList.slice(0, 6);

            localStorage.setItem('recently-viewed', JSON.stringify(limitedList));
            window.dispatchEvent(new CustomEvent('recently-viewed-updated'));
        } catch (e) {
            console.error("Error updating recently viewed", e);
        }
    };

    // Add to cart functionality
    const addToCart = (product: Product, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        let currentCart = [];
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            if (savedCart) currentCart = JSON.parse(savedCart);
        } catch (e) {
            console.error("Error loading cart", e);
        }

        const existingItemIndex = currentCart.findIndex((item: { id: string }) => item.id === product._id);

        if (existingItemIndex >= 0) {
            currentCart[existingItemIndex].quantity += 1;
        } else {
            currentCart.push({
                id: product._id,
                name: product.productName,
                info: product.productInfo,
                price: product.productPrice,
                image: product.productImage[0],
                code: product.productNumber,
                quantity: 1
            });
        }

        localStorage.setItem('shopping-cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cart-updated'));

        setCartMessageProduct(product.productName);
        setShowCartMessage(true);
        setTimeout(() => setShowCartMessage(false), 2000);
    };

    // Add to wishlist functionality
    const addToWishlist = (product: Product, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!product?._id || !product.productName || !product.productPrice || !product.productImage?.length) {
            console.error("Invalid product data");
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let currentWishlist: any[] = [];
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                try {
                    currentWishlist = JSON.parse(savedWishlist);
                    if (!Array.isArray(currentWishlist)) currentWishlist = [];
                } catch (e) {
                    console.error("Error parsing wishlist", e);
                }
            }

            const isProductInWishlist = wishlist.includes(product._id);

            if (!isProductInWishlist) {
                currentWishlist.push({
                    id: product._id,
                    name: product.productName,
                    info: product.productInfo || '',
                    price: product.productPrice,
                    image: product.productImage[0],
                    code: product.productNumber || '',
                    quantity: 1
                });

                setWishlistMessageProduct(product.productName);
                setShowWishlistMessage(true);
                setTimeout(() => setShowWishlistMessage(false), 2000);
            } else {
                currentWishlist = currentWishlist.filter(item => item.id !== product._id);
            }

            localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
            setWishlist(currentWishlist.map(item => item.id));
            window.dispatchEvent(new CustomEvent('wishlist-updated'));
        } catch (e) {
            console.error("Error updating wishlist", e);
        }
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    // Show/hide navigation arrows
    const showPrevArrow = isMobile ? currentIndex > 0 : currentIndex > 0;
    const showNextArrow = isMobile
        ? currentIndex < filteredProducts.length - 1
        : currentIndex < filteredProducts.length - 3;

    if (loading) {
        return (
            <section className="py-12 md:py-16 lg:py-24">
                <div className="container mx-auto">
                    <div className="jost-font text-center">
                        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl capitalize">
                            Shop by Category
                        </h2>
                    </div>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 md:py-16 lg:py-24">
                <div className="container mx-auto">
                    <div className="jost-font text-center">
                        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl capitalize">
                            Shop by Category
                        </h2>
                    </div>
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto mt-8">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 lg:py-24">
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

                <div className="jost-font text-center">
                    <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl capitalize">
                        Shop by Category
                    </h2>
                </div>

                {/* Category Navigation */}
                <div className="mt-6 md:mt-8 flex justify-center">
                    <div className="flex gap-4 lg:gap-[34px]" role="group">
                        {['men', 'women', 'kids'].map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryChange(category)}
                                className={`font-normal text-[20px] lg:text-[25px] cursor-pointer ${activeCategory === category ? '' : 'text-[#828282]'
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="mt-8 md:mt-12 relative">
                        {/* Carousel Container */}
                        <div ref={carouselRef} className="overflow-hidden">
                            <div className="flex transition-transform duration-300 ease-in-out">
                                {getVisibleProducts().map((product) => (
                                    <div
                                        key={product._id}
                                        className={`${isMobile ? 'w-full' : 'w-1/3'} px-2 md:px-4`}
                                        onMouseEnter={() => setHoveredIndex(product._id)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
                                            <Link
                                                to={`/product/${product._id}`}
                                                onClick={() => addToRecentlyViewed(product)}
                                                className="block"
                                            >
                                                <div className="aspect-square overflow-hidden">
                                                    <img
                                                        src={product.productImage?.[0] || '/placeholder-image.jpg'}
                                                        alt={product.productName}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                </div>
                                            </Link>

                                            <div className="p-4">
                                                <Link
                                                    to={`/product/${product._id}`}
                                                    onClick={() => addToRecentlyViewed(product)}
                                                >
                                                    <h3 className="manrope-font font-bold text-base md:text-lg text-[#19191D]">
                                                        {product.productName} <span className="font-normal">{product.productNumber}</span>
                                                    </h3>
                                                    <p className="josefin-sans-font font-bold text-base md:text-lg text-[#19191D] mt-2">
                                                        {formatPrice(product.productPrice)}
                                                    </p>
                                                </Link>

                                                {/* Action Buttons */}
                                                <div className={`flex gap-2 mt-3 transition-opacity duration-200 ${hoveredIndex === product._id ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
                                                    }`}>
                                                    <button
                                                        onClick={(e) => addToWishlist(product, e)}
                                                        className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded border ${isInWishlist(product._id) ? 'bg-[#BD3A3A] text-white' : 'border-[#BD3A3A] text-[#BD3A3A]'
                                                            } transition-colors`}
                                                    >
                                                        <img src={Like} alt="" className="h-4 w-4" />
                                                        <span className="text-xs md:text-sm font-medium">
                                                            {isInWishlist(product._id) ? 'Saved' : 'Wishlist'}
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={(e) => addToCart(product, e)}
                                                        className="flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded bg-[#BD3A3A] text-white transition-colors hover:bg-[#a93434]"
                                                    >
                                                        <img src={Scart} alt="" className="h-4 w-4" />
                                                        <span className="text-xs md:text-sm font-medium">Add to Cart</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carousel Navigation */}
                        {showPrevArrow && (
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10"
                                aria-label="Previous"
                            >
                                <ChevronLeft size={24} className="text-gray-700" />
                            </button>
                        )}

                        {showNextArrow && (
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10"
                                aria-label="Next"
                            >
                                <ChevronRight size={24} className="text-gray-700" />
                            </button>
                        )}

                        {/* Carousel Indicators */}
                        <div className="flex justify-center mt-4 gap-2">
                            {Array.from({
                                length: isMobile ? filteredProducts.length : Math.ceil(filteredProducts.length / 3)
                            }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentIndex(isMobile ? index : index * 3);
                                    }}
                                    className={`h-2 rounded-full transition-all ${isMobile
                                        ? currentIndex === index
                                            ? 'w-4 bg-[#BD3A3A]'
                                            : 'w-2 bg-gray-300'
                                        : Math.floor(currentIndex / 3) === index
                                            ? 'w-4 bg-[#BD3A3A]'
                                            : 'w-2 bg-gray-300'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found for this category.</p>
                    </div>
                )}

                <div className="flex justify-center mt-8 md:mt-12 lg:mt-16">
                    <ArrivalsView />
                </div>
            </div>
        </section>
    );
};

export default CategorySection;