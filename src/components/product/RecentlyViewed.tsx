import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from '../../assets/images';
import { Product } from '../../types';


const RecentlyViewed: React.FC = () => {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadRecentlyViewed = () => {
            try {
                const savedRecentlyViewed = localStorage.getItem('recently-viewed');
                if (savedRecentlyViewed) {
                    // Filter out any products that don't have complete data
                    const parsedProducts = JSON.parse(savedRecentlyViewed);
                    // First make sure parsedProducts is an array
                    const productsArray = Array.isArray(parsedProducts) ? parsedProducts : [];
                    // Then filter out invalid products
                    const validProducts = productsArray.filter((product) =>
                        product &&
                        typeof product === 'object' &&
                        product._id &&
                        product.productName &&
                        product.productPrice &&
                        Array.isArray(product.productImage) &&
                        product.productImage.length > 0
                    );
                    setRecentProducts(validProducts);
                }
            } catch (e) {
                console.error("Error loading recently viewed products", e);
            }
        };

        loadRecentlyViewed();

        // Listen for changes to recently viewed products
        const handleRecentlyViewedUpdate = () => {
            loadRecentlyViewed();
        };

        window.addEventListener('recently-viewed-updated', handleRecentlyViewedUpdate);

        return () => {
            window.removeEventListener('recently-viewed-updated', handleRecentlyViewedUpdate);
        };
    }, []);

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

    if (recentProducts.length === 0) {
        return null; // Don't show the component if there are no recently viewed products
    }

    return (
        <div className="container mx-auto mt-12 border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8">
            <p className="manrope-font font-bold text-[20px] mb-4">Recently Viewed</p>
            <div className="border-[#F1EEEE] border-b-2 mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentProducts.slice(0, 4).map(product => (
                    <Link
                        to={`/product/${product._id}`}
                        key={product._id}
                        className="w-full rounded-lg shadow-xl hover:bg-gray-100 transition duration-300 p-4"
                    >
                        {/* Add a fallback image if the product.productImage[0] doesn't exist */}
                        <img
                            src={product.productImage && product.productImage[0] ? product.productImage[0] : '/placeholder-image.jpg'}
                            alt={product.productName}
                            className="w-full h-[180px] object-cover rounded-t-lg"
                        />
                        <div className="mx-2 mt-3">
                            <div className="jost-font">
                                <p className="uppercase font-bold text-[15px]">{product.productName}</p>
                                <p className="font-light text-[14px]">{product.productNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="inter-font text-[11px] font-normal text-[#787885] mt-2">{product.productInfo || 'No description available'}</p>
                                <p className="manrope-font font-semibold text-[13px] mt-2">{formatPrice(product.productPrice)}</p>
                            </div>
                            <div>
                                <img src={Star} alt="" className="w-16" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;