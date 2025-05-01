import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import { getProducts, deleteProduct } from '../../api/products';
import { formatPrice, formatDate } from '../../types/dashboard';
import { Product, PaginationData } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';
import {
    Package,
    PlusCircle,
    Search,
    Grid,
    List,
    Trash2,
    Edit,
    Eye,
    MoreVertical,
    Filter,

} from 'lucide-react';
import Modal from '../../components/ui/Modal';



const AdminProduct: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [categories, setCategories] = useState<string[]>([]);

    const currentPage = parseInt(searchParams.get('page') || '1');

    // Handle page change
    const handlePageChange = async (page: number) => {
        setLoading(true);
        try {
            const response = await getProducts(page);
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

    // Fetch products on initial load and page change
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts(currentPage);
                setProducts(response.products);
                setFilteredProducts(response.products);
                setPagination(response.pagination);

                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(response.products.map(product => product.category?.name || 'Uncategorized'))
                );
                setCategories(['all', ...uniqueCategories]);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    // Handle search and filtering
    useEffect(() => {
        if (!products.length) return;

        let result = [...products];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productInfo?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory && selectedCategory !== 'all') {
            result = result.filter(product =>
                (product.category?.name || 'Uncategorized') === selectedCategory
            );
        }

        // Apply sorting
        if (sortBy === 'newest') {
            result.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        } else if (sortBy === 'oldest') {
            result.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => {
                const priceA = typeof a.productPrice === 'string' ? parseFloat(a.productPrice) : a.productPrice || 0;
                const priceB = typeof b.productPrice === 'string' ? parseFloat(b.productPrice) : b.productPrice || 0;
                return priceB - priceA;
            });
        } else if (sortBy === 'price-low') {
            result.sort((a, b) => {
                const priceA = typeof a.productPrice === 'string' ? parseFloat(a.productPrice) : a.productPrice || 0;
                const priceB = typeof b.productPrice === 'string' ? parseFloat(b.productPrice) : b.productPrice || 0;
                return priceA - priceB;
            });
        } else if (sortBy === 'name-asc') {
            result.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortBy === 'name-desc') {
            result.sort((a, b) => b.productName.localeCompare(a.productName));
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, sortBy, products]);

    // Handle product deletion
    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            setDeleteLoading(true);
            await deleteProduct(productToDelete._id);

            // Remove from state
            const updatedProducts = products.filter(p => p._id !== productToDelete._id);
            setProducts(updatedProducts);
            setFilteredProducts(filteredProducts.filter(p => p._id !== productToDelete._id));

            setDeleteLoading(false);
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product');
            setDeleteLoading(false);
        }
    };

    // Render product stock status
    const renderStockStatus = (stock: number) => {
        if (stock <= 0) {
            return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
        } else if (stock < 10) {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Low Stock: {stock}</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">In Stock: {stock}</span>;
        }
    };

    if (loading && !products.length) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error && !products.length) {
        return (
            <AdminLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (products.length === 0) {
        return (
            <AdminLayout>
                <div className="text-center py-16 bg-white rounded-lg shadow-sm mx-4">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by adding your first product to your inventory.</p>
                    <Link
                        to="/admin/product/create"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#BD3A3A] text-nwhite font-medium rounded hover:bg-[#A52F2F] transition-colors"
                    >
                        <PlusCircle size={20} className="mr-2" />
                        Create Your First Product
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-1">Manage your product inventory</p>
                    </div>
                    <Link
                        to="/admin/product/create"
                        className="mt-4 sm:mt-0 px-5 py-2.5 bg-[#BD3A3A] text-white font-medium rounded hover:bg-[#A52F2F] transition-colors inline-flex items-center"
                    >
                        <PlusCircle size={18} className="mr-2" />
                        Add Product
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Search */}
                            <div className="relative flex-grow max-w-lg">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-[#BD3A3A] focus:border-[#BD3A3A] block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
                                >
                                    <Filter size={18} />
                                    <span className="hidden sm:inline">Filters</span>
                                </button>
                                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                                        aria-label="Grid view"
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                                        aria-label="List view"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex flex-wrap items-center gap-4">
                                <div>
                                    <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="categoryFilter"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A] sm:text-sm rounded-md"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category === 'all' ? 'All Categories' : category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <select
                                        id="sortBy"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A] sm:text-sm rounded-md"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="name-asc">Name: A to Z</option>
                                        <option value="name-desc">Name: Z to A</option>
                                    </select>
                                </div>

                                <div className="ml-auto self-end">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('all');
                                            setSortBy('newest');
                                        }}
                                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Counter */}
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                        Showing {filteredProducts.length} of {pagination.totalItems} products
                    </div>
                </div>

                {/* Products Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={product.productImage?.[0] || '/placeholder-image.jpg'}
                                        alt={product.productName}
                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-gray-900 font-medium mb-1 line-clamp-1">
                                                {product.productName}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-2">
                                                {product.productNumber || 'SKU N/A'}
                                            </p>
                                        </div>
                                        <div className="text-[#BD3A3A] font-bold">
                                            {formatPrice(product.productPrice)}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {product.productInfo || 'No description available'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            {renderStockStatus(product.productStock ?? 0)}
                                        </div>
                                        <div className="relative group">
                                            <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                                <MoreVertical size={18} />
                                            </button>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                                                <div className="py-1">
                                                    <Link
                                                        to={`/admin/products/${product._id}`}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Eye size={16} className="mr-2" /> View Details
                                                    </Link>
                                                    <Link
                                                        to={`/admin/product/${product._id}/edit`}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Edit size={16} className="mr-2" /> Edit Product
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        <Trash2 size={16} className="mr-2" /> Delete Product
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Products List View */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
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
                                            Stock
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Added
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden border">
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
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.productName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {product.productInfo || 'No description available'}
                                                        </div>
                                                    </div>
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
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {renderStockStatus(product.productStock ?? 0)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.createdAt ? formatDate(product.createdAt, false) : 'Recently Added'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        to={`/admin/products/${product._id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        to={`/admin/product/${product._id}/edit`}
                                                        className="text-[#BD3A3A] hover:text-[#A52F2F]"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <Modal
                    title="Delete Product"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-6 text-red-500">
                            <Trash2 size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-center mb-2">Are you sure?</h3>
                        <p className="text-gray-500 text-center mb-6">
                            You are about to delete "{productToDelete.productName}". This action cannot be undone.
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
                                onClick={handleDeleteProduct}
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

export default AdminProduct;