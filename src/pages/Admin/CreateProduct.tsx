import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createProduct } from '../../api/products';
import { Category } from '../../types';
import { getCategories } from '../../api/categories';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';

interface ApiError {
    response?: {
        data?: string;
    };
    message?: string;
}

const CreateProduct: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        productName: '',
        productNumber: '',
        categoryId: '',
        productPrice: '',
        productStock: '0',
        productInfo: '',
        productDescription: '',
        productSize: '',
        productCategory: '',
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // Debug logging when component mounts and unmounts
    useEffect(() => {
        console.log("=== CreateProduct Component Mounted ===");
        console.log("Current path:", location.pathname);
        console.log("Auth state:", {
            isAuthenticated: auth.isAuthenticated,
            isAdmin: auth.isAdmin,
            loading: auth.loading,
            user: auth.user
        });
        console.log("Token in localStorage:", localStorage.getItem('token'));

        // Check API axios config if available
        try {
            fetch('/api/check-auth', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    console.log("Auth check response status:", res.status);
                    return res.json();
                })
                .then(data => console.log("Auth check response:", data))
                .catch(err => console.log("Auth check error:", err));
        } catch (err) {
            console.log("Couldn't perform auth check:", err);
        }

        return () => {
            console.log("=== CreateProduct Component Unmounting ===");
            console.log("Auth state on unmount:", {
                isAuthenticated: auth.isAuthenticated,
                isAdmin: auth.isAdmin
            });
        };
    }, [location.pathname, auth.isAuthenticated, auth.isAdmin, auth.loading, auth.user]);

    // Log auth state changes
    useEffect(() => {
        console.log("Auth state changed:", {
            isAuthenticated: auth.isAuthenticated,
            isAdmin: auth.isAdmin,
            loading: auth.loading
        });
    }, [auth.isAuthenticated, auth.isAdmin, auth.loading]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log("Fetching categories...");
                const fetchedCategories = await getCategories();
                console.log("Categories fetched successfully:", fetchedCategories);
                setCategories(fetchedCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            if (newFiles.length + imageFiles.length > 5) {
                setError('Maximum 5 images allowed');
                return;
            }

            // Create preview URLs
            const newPreviewImages = newFiles.map(file => URL.createObjectURL(file));
            setPreviewImages([...previewImages, ...newPreviewImages]);

            // Add to image files array
            setImageFiles([...imageFiles, ...newFiles]);
            setError('');
        }
    };

    const removeImage = (index: number) => {
        const newPreviewImages = [...previewImages];
        const newImageFiles = [...imageFiles];

        // Release object URL to avoid memory leaks
        URL.revokeObjectURL(previewImages[index]);

        newPreviewImages.splice(index, 1);
        newImageFiles.splice(index, 1);

        setPreviewImages(newPreviewImages);
        setImageFiles(newImageFiles);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Form submission started");

        if (imageFiles.length === 0) {
            setError('At least one product image is required');
            return;
        }

        if (!formData.categoryId) {
            setError('Please select a category');
            return;
        }

        setLoading(true);
        setError('');

        const productFormData = new FormData();

        // Add all form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
            productFormData.append(key, value);
        });

        // Add all images to FormData
        imageFiles.forEach(file => {
            productFormData.append('productImage', file);
        });

        try {
            console.log("Sending product creation request...");
            console.log("Auth state before API call:", {
                isAuthenticated: auth.isAuthenticated,
                isAdmin: auth.isAdmin,
                token: localStorage.getItem('token')
            });

            const newProduct = await createProduct(productFormData);
            console.log("Product created successfully:", newProduct);

            setSuccess(true);
            setTimeout(() => {
                navigate(`/admin/products/${newProduct._id}`);
            }, 2000);
        } catch (err: unknown) {
            console.error('Error creating product:', err);
            const apiError = err as ApiError;

            // Check if error is related to authentication
            if (apiError.response && 'status' in apiError.response && apiError.response.status === 401) {
                console.error('Authentication error - user may be logged out');
                console.log('Current auth token:', localStorage.getItem('token'));
            }

            setError(apiError.response?.data || apiError.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    // If not authenticated, show message
    if (!auth.isAuthenticated && !auth.loading) {
        console.log("Component rendered while not authenticated");
        return (
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 mb-12">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8">
                    <h1 className="text-xl text-red-600">Authentication Required</h1>
                    <p className="mt-4">You need to be logged in to access this page.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-4 py-2 bg-[#BD3A3A] text-white rounded-md"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // If not admin, show unauthorized message
    if (!auth.isAdmin && !auth.loading) {
        console.log("Component rendered while not admin");
        return (
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 mb-12">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8">
                    <h1 className="text-xl text-red-600">Unauthorized</h1>
                    <p className="mt-4">You need administrator privileges to access this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-[#BD3A3A] text-white rounded-md"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 mb-12">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8">
                    <h1 className="manrope-font font-bold text-2xl mb-6">Create New Product</h1>

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Product created successfully! Redirecting to product page...
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name*
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    required
                                    value={formData.productName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                />
                            </div>

                            <div>
                                <label htmlFor="productNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Number/Code
                                </label>
                                <input
                                    type="text"
                                    id="productNumber"
                                    name="productNumber"
                                    value={formData.productNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                />
                            </div>

                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category*
                                </label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price* (₦)
                                </label>
                                <input
                                    type="text"
                                    id="productPrice"
                                    name="productPrice"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.productPrice}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                />
                            </div>

                            <div>
                                <label htmlFor="productStock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    id="productStock"
                                    name="productStock"
                                    min="0"
                                    value={formData.productStock}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                />
                            </div>

                            <div>
                                <label htmlFor="productSize" className="block text-sm font-medium text-gray-700 mb-1">
                                    Size (if applicable)
                                </label>
                                <input
                                    type="text"
                                    id="productSize"
                                    name="productSize"
                                    value={formData.productSize}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                    placeholder="e.g. S, M, L, XL or dimensions"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="productInfo" className="block text-sm font-medium text-gray-700 mb-1">
                                Short Product Info*
                            </label>
                            <input
                                type="text"
                                id="productInfo"
                                name="productInfo"
                                required
                                value={formData.productInfo}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                placeholder="Brief product information (displayed in product cards)"
                            />
                        </div>

                        <div>
                            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                Detailed Description
                            </label>
                            <textarea
                                id="productDescription"
                                name="productDescription"
                                rows={4}
                                value={formData.productDescription}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                placeholder="Detailed product description"
                            />
                        </div>

                        <div>
                            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Category/Tag
                            </label>
                            <input
                                type="text"
                                id="productCategory"
                                name="productCategory"
                                value={formData.productCategory}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                placeholder="e.g. New Arrival, Best Seller, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Images* (Max 5)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Selected: {imageFiles.length} of 5 images
                            </p>

                            {previewImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {previewImages.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="h-24 w-24 object-cover rounded-md border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-[#BD3A3A] text-white rounded-md hover:bg-[#A52F2F] disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateProduct;