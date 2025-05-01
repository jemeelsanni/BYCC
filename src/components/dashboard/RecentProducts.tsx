import React from 'react';
import { Link } from 'react-router-dom';
import { Product, formatPrice, formatDate } from '../../types/dashboard';

interface RecentProductsProps {
    products: Product[];
}


const RecentProducts: React.FC<RecentProductsProps> = ({ products }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recently Added Products</h2>
                <Link
                    to="/admin/product/create"
                    className="px-4 py-2 bg-[#BD3A3A] text-white rounded hover:bg-[#A52F2F]"
                >
                    Add Product
                </Link>
            </div>

            {products.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Added
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.slice(0, 8).map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="h-12 w-12 rounded overflow-hidden border">
                                            <img
                                                src={product.productImage?.[0] || '/placeholder-image.jpg'}
                                                alt={product.productName}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://via.placeholder.com/48';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.productName}
                                        </div>
                                        <div className="text-sm text-gray-500 line-clamp-1">
                                            {product.productInfo || 'No description available'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.productNumber || 'N/A'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-[#BD3A3A]">
                                            {formatPrice(product.productPrice)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.createdAt ? formatDate(product.createdAt, false) : 'Recently Added'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`admin/products/${product._id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="text-[#BD3A3A] hover:text-[#A52F2F] ml-3"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No products found</p>
                    <Link
                        to="/admin/product/create"
                        className="mt-4 inline-block px-4 py-2 bg-[#BD3A3A] text-white rounded-md hover:bg-[#A52F2F] transition-colors"
                    >
                        Create Your First Product
                    </Link>
                </div>
            )}

            {products.length > 0 && (
                <div className="mt-4 text-right">
                    <Link
                        to="/admin/products"
                        className="text-[#BD3A3A] hover:text-[#A52F2F] font-medium"
                    >
                        View All Products →
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RecentProducts;