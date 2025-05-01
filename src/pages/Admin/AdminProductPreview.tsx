import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductImageCarousel from '../../components/product/ProductCarousel';
import ProductReview from '../../components/product/ProductReview';
import { deleteProduct, getProduct } from '../../api/products';
import Modal from '../../components/ui/Modal';
import { Archive, Edit, Eye, Package, Tag, Star, Calendar, ArrowLeft } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

interface Product {
    _id: string;
    productName: string;
    productNumber: string;
    productPrice: string;
    productStock: number;
    productInfo: string;
    productImage: string[];
    productDescription: string;
    category: {
        _id: string;
        name: string;
    };
    averageRating?: number;
    reviewCount?: number;
    createdAt?: string;
}

const AdminProductPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const navigate = useNavigate();

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                if (!id) {
                    setError('Product ID is missing');
                    setLoading(false);
                    return;
                }
                const data = await getProduct(id);
                setProduct(data as Product);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        try {
            setDeleteLoading(true);
            await deleteProduct(id);
            setDeleteLoading(false);
            setShowDeleteModal(false);
            navigate('/product');
        } catch (err) {
            setError('Failed to delete product');
            setDeleteLoading(false);
            console.error('Error deleting product:', err);
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

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStarRating = (rating?: number) => {
        if (!rating) rating = 0;
        const roundedRating = Math.round(rating);

        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-${star <= roundedRating ? 'yellow' : 'gray'}-400 text-xl`}
                    >
                        ★
                    </span>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                    ({product?.reviewCount || 0} reviews)
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="max-w-5xl mx-auto my-8 px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h3 className="text-red-600 text-lg font-medium mb-2">Error Loading Product</h3>
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Return to Products
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!product) {
        return (
            <AdminLayout>
                <div className="max-w-5xl mx-auto my-8 px-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <h3 className="text-yellow-600 text-lg font-medium mb-2">Product Not Found</h3>
                        <p className="text-yellow-700">The product you're looking for could not be found.</p>
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Return to Products
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb & Actions */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="p-1 rounded-full hover:bg-gray-100 mr-2"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>

                            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.productName}</h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                        >
                            <Edit size={18} />
                            <span>Edit</span>
                        </Link>
                        <Link
                            to={`/product/${product._id}`}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Eye size={18} />
                            <span>View Live</span>
                        </Link>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2"
                        >
                            <Archive size={18} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                    {/* Product Overview */}
                    <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="md:w-2/5 p-6 bg-gray-50">
                            <div className="h-full flex items-center justify-center rounded-lg overflow-hidden">
                                <ProductImageCarousel
                                    images={product.productImage}
                                    defaultImage={product.productImage[0]}
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="md:w-3/5 p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {product.category?.name || 'Uncategorized'}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">{product.productName}</h2>
                                    <p className="text-gray-500 font-medium">{product.productNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="text-3xl font-bold text-[#BD3A3A]">{formatPrice(product.productPrice)}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-700">{product.productInfo}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-50">
                                        <Tag size={20} className="text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Product ID</p>
                                        <p className="font-medium">{product._id.substring(0, 10)}...</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-50">
                                        <Package size={20} className="text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Stock</p>
                                        <p className="font-medium">{product.productStock} units</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-50">
                                        <Star size={20} className="text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Rating</p>
                                        <div className="mt-1">{renderStarRating(product.averageRating)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-50">
                                        <Calendar size={20} className="text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Added</p>
                                        <p className="font-medium">{formatDate(product.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-gray-200">
                        <div className="flex">
                            <button
                                className={`px-6 py-4 font-medium text-sm ${activeTab === 'details' ? 'border-b-2 border-[#BD3A3A] text-[#BD3A3A]' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Product Details
                            </button>
                            <button
                                className={`px-6 py-4 font-medium text-sm ${activeTab === 'reviews' ? 'border-b-2 border-[#BD3A3A] text-[#BD3A3A]' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews ({product.reviewCount || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'details' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-wrap">{product.productDescription || 'No description provided.'}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <ProductReview productId={product._id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete Product"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-6 text-red-500">
                            <Archive size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-center mb-2">Are you sure?</h3>
                        <p className="text-gray-500 text-center mb-6">
                            You are about to delete "{product.productName}". This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : 'Delete Product'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
};

export default AdminProductPreview;