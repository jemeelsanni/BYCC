import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { Category } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';

interface ApiError {
    response?: {
        data?: string;
    };
    message?: string;
}

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [keepExistingImages, setKeepExistingImages] = useState(true);

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

    useEffect(() => {
        const fetchProductAndCategories = async () => {
            try {
                setLoading(true);

                // Fetch product details
                if (id) {
                    const productData = await getProduct(id);

                    setFormData({
                        productName: productData.productName || '',
                        productNumber: productData.productNumber || '',
                        categoryId: productData.category?._id || '',
                        productPrice: productData.productPrice || '',
                        productStock: productData.productStock?.toString() || '0',
                        productInfo: productData.productInfo || '',
                        productDescription: productData.productDescription || '',
                        productSize: productData.productSize || '',
                        productCategory: productData.productCategory || '',
                    });

                    // Set existing images
                    if (productData.productImage && Array.isArray(productData.productImage)) {
                        setExistingImages(productData.productImage);
                    }
                }

                // Fetch categories
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load product or categories');
                setLoading(false);
            }
        };

        fetchProductAndCategories();
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const remainingSlots = 5 - (keepExistingImages ? existingImages.length : 0) - imageFiles.length;

            if (newFiles.length > remainingSlots) {
                setError(`You can only add ${remainingSlots} more images`);
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

    const removeNewImage = (index: number) => {
        const newPreviewImages = [...previewImages];
        const newImageFiles = [...imageFiles];

        // Release object URL to avoid memory leaks
        URL.revokeObjectURL(previewImages[index]);

        newPreviewImages.splice(index, 1);
        newImageFiles.splice(index, 1);

        setPreviewImages(newPreviewImages);
        setImageFiles(newImageFiles);
    };

    const toggleExistingImage = (index: number) => {
        if (!keepExistingImages) return; // If we're not keeping existing images, don't toggle individual ones

        const newExistingImages = [...existingImages];
        newExistingImages.splice(index, 1);
        setExistingImages(newExistingImages);
    };

    const handleKeepExistingImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeepExistingImages(e.target.checked);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate that we'll have at least one image
        const willHaveImages = (keepExistingImages && existingImages.length > 0) || imageFiles.length > 0;
        if (!willHaveImages) {
            setError('At least one product image is required');
            return;
        }

        if (!formData.categoryId) {
            setError('Please select a category');
            return;
        }

        setSubmitting(true);
        setError('');

        const productFormData = new FormData();

        // Add all form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
            productFormData.append(key, value);
        });

        // Add flag for keeping existing images

        try {
            if (id) {
                // Add all new images to FormData
                imageFiles.forEach(file => {
                    productFormData.append('productImage', file);
                });

                await updateProduct(id, productFormData);
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/admin/products/${id}`);
                }, 2000);
            }
        } catch (err: unknown) {
            console.error('Error updating product:', err);
            const apiError = err as ApiError;
            setError(apiError.response?.data || apiError.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    if (loading) {
        return (
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 mb-12">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8 flex justify-center items-center h-64">
                    <p className="text-xl">Loading product information...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="mt-8 lg:mt-24 mx-4 lg:mx-24 mb-12">
                <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-5 lg:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="manrope-font font-bold text-2xl">Edit Product</h1>
                        <button
                            onClick={() => navigate(`/admin/products/${id}`)}
                            className="text-[#BD3A3A] hover:underline"
                        >
                            Back to Product
                        </button>
                    </div>

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Product updated successfully! Redirecting to product page...
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
                                    type="tect"
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
                            <div className="flex items-center mb-4">
                                <input
                                    id="keepExistingImages"
                                    name="keepExistingImages"
                                    type="checkbox"
                                    checked={keepExistingImages}
                                    onChange={handleKeepExistingImagesChange}
                                    className="h-4 w-4 text-[#BD3A3A] border-gray-300 rounded focus:ring-[#BD3A3A]"
                                />
                                <label htmlFor="keepExistingImages" className="ml-2 block text-sm text-gray-700">
                                    Keep existing images
                                </label>
                            </div>

                            {existingImages.length > 0 && keepExistingImages && (
                                <div className="mb-4">
                                    <p className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Images ({existingImages.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image}
                                                    alt={`Product ${index + 1}`}
                                                    className="h-24 w-24 object-cover rounded-md border border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleExistingImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Add New Images
                                    {keepExistingImages
                                        ? ` (${5 - existingImages.length} remaining slots)`
                                        : ' (Max 5)'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                />

                                {previewImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`New Image ${index + 1}`}
                                                    className="h-24 w-24 object-cover rounded-md border border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/admin/products/${id}`)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-[#BD3A3A] text-white rounded-md hover:bg-[#A52F2F] disabled:opacity-50"
                            >
                                {submitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditProduct;