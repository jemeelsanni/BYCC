import React from 'react';

interface Product {
    _id: string;
    productName: string;
    productPrice: string;
    productImage?: string[];
}

interface SearchResultsProps {
    products: Product[];
    onResultClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, onResultClick }) => {
    // Format price to Nigerian Naira
    const formatPrice = (price: string | number): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numericPrice)) return '₦0.00';

        const formattedPrice = (numericPrice * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return '₦' + formattedPrice;
    };

    return (
        <div className="w-full bg-white mt-2 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
            <ul>
                {products.map((product) => (
                    <li key={product._id} className="border-b border-gray-100">
                        <a
                            href={`/product/${product._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer block"
                            onClick={() => {
                                // Just call the cleanup function
                                onResultClick();

                                // Log for debugging
                                console.log("Opening product in new tab:", product._id);
                            }}
                        >
                            {product.productImage && product.productImage[0] && (
                                <div className="w-12 h-12 mr-3">
                                    <img
                                        src={product.productImage[0]}
                                        alt={product.productName}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{product.productName}</p>
                                <p className="text-sm text-gray-600">{formatPrice(product.productPrice)}</p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;