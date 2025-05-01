import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Decrease, Increase } from '../../assets/images';
import { Wishlist, AddCart } from '../../assets/icons';
import ProductImageCarousel from './ProductCarousel';
import ProductReview from './ProductReview';
import RecentlyViewed from './RecentlyViewed';
import { deleteProduct, getProduct } from '../../api/products'; // Import the API function
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { Archive, Edit } from 'lucide-react';

// Define the Product interface with rating fields
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
}

const ProductPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('L');
    const [selectedColor, setSelectedColor] = useState('#3870C4');
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

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

    // Load wishlist from localStorage
    useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                const wishlistItems = JSON.parse(savedWishlist);
                setWishlist(wishlistItems.map((item: { _id: string }) => item._id));
            }
        } catch (e) {
            console.error("Error loading wishlist from localStorage", e);
        }

        // Listen for wishlist updates
        const handleWishlistUpdate = () => {
            try {
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    const wishlistItems = JSON.parse(savedWishlist);
                    setWishlist(wishlistItems.map((item: { _id: string }) => item._id));
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

    // Create dummy data for sizes and colors until you add them to your backend
    const availableSizes = ['S', 'M', 'L', 'XL'];
    const availableColors = [
        { name: 'Blue', code: '#3870C4' },
        { name: 'Red', code: '#BD3A3A' },
        { name: 'Black', code: '#000000' }
    ];

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        }
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };

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

    const addToCart = () => {
        if (!product) return;

        // Get current cart from localStorage
        let currentCart = [];
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            if (savedCart) {
                currentCart = JSON.parse(savedCart);
            }
        } catch (e) {
            console.error("Error loading cart from localStorage", e);
        }

        // Check if this product is already in the cart
        interface CartItem {
            id: string;
            name: string;
            info: string;
            image: string;
            price: string;
            code: string;
            quantity: number;
            size: string;
            color: string;
        }

        const existingItemIndex = currentCart.findIndex((item: CartItem) => item.id === product._id);

        if (existingItemIndex >= 0) {
            // If product exists, update quantity and options
            currentCart[existingItemIndex].quantity += quantity;
            currentCart[existingItemIndex].size = selectedSize;
            currentCart[existingItemIndex].color = selectedColor;
        } else {
            // If product doesn't exist, add it to cart
            const cartItem = {
                id: product._id,
                name: product.productName,
                info: product.productInfo,
                image: product.productImage[0],
                price: product.productPrice,
                code: product.productNumber,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor
            };
            currentCart.push(cartItem);
        }

        // Save updated cart to localStorage
        localStorage.setItem('shopping-cart', JSON.stringify(currentCart));
        console.log("Product added to cart:", currentCart);

        // Trigger events to update other components
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cart-updated'));

        // Show the add to cart message
        setShowCartMessage(true);

        // Hide message after 2 seconds
        setTimeout(() => {
            setShowCartMessage(false);
        }, 2000);
    };

    // Function to handle wishlist
    const addToWishlist = () => {
        if (!product) return;

        try {
            let currentWishlist: Product[] = [];
            const savedWishlist = localStorage.getItem('wishlist');

            if (savedWishlist) {
                currentWishlist = JSON.parse(savedWishlist);
            }

            // Check if product is already in wishlist
            const isInWishlist = currentWishlist.some(item => item._id === product._id);

            if (!isInWishlist) {
                // Add to wishlist
                currentWishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

                setShowWishlistMessage(true);
                setTimeout(() => {
                    setShowWishlistMessage(false);
                }, 2000);
            } else {
                // Remove from wishlist
                const updatedWishlist = currentWishlist.filter(item => item._id !== product._id);
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            }

            // Update wishlist state
            setWishlist(currentWishlist.map(item => item._id));

            // Dispatch event for components that listen to wishlist changes
            window.dispatchEvent(new CustomEvent('wishlist-updated'));
        } catch (e) {
            console.error("Error updating wishlist", e);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.includes(productId);
    };

    // Function to navigate to cart
    const goToCart = () => {
        navigate('/cart');
    };

    // Navigate to wishlist
    const goToWishlist = () => {
        navigate('/wishlist');
    };

    // Format price to Nigerian Naira
    const formatPrice = (price: string | number): string => {
        // Convert price to a number if it's a string
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

        // Check if it's a valid number
        if (isNaN(numericPrice)) {
            return '₦0.00';
        }

        // Convert to string with commas for thousands
        const formattedPrice = (numericPrice * 1000).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return '₦' + formattedPrice;
    };

    // Render star ratings
    const renderStarRating = (rating?: number) => {
        if (!rating) rating = 0;
        const roundedRating = Math.round(rating);

        return (
            <div className="flex items-center mt-2">
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

    if (loading) return <div className="text-center py-10">Loading product details...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-10">Product not found</div>;

    return (
        <div className="mt-8 lg:mt-24 mx-4 lg:mx-24">
            {/* Added to cart message */}
            {showCartMessage && (
                <div className="fixed top-10 right-10 bg-[#BD3A3A] text-white p-4 rounded-lg shadow-lg z-50 transition-opacity">
                    <div className="flex items-center justify-between">
                        <p className="mr-8">{product.productName} added to cart!</p>
                        <button
                            onClick={goToCart}
                            className="bg-white text-[#BD3A3A] px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100"
                        >
                            View Cart
                        </button>
                    </div>
                </div>
            )}

            {/* Added to wishlist message */}
            {showWishlistMessage && (
                <div className="fixed top-10 right-10 bg-[#BD3A3A] text-white p-4 rounded-lg shadow-lg z-50 transition-opacity">
                    <div className="flex items-center justify-between">
                        <p className="mr-8">{product.productName} added to wishlist!</p>
                        <button
                            onClick={goToWishlist}
                            className="bg-white text-[#BD3A3A] px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100"
                        >
                            View Wishlist
                        </button>
                    </div>
                </div>
            )}

            <div className='flex flex-col lg:flex-row gap-8 lg:gap-[123px] border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-8 '>
                <div>
                    <ProductImageCarousel images={product.productImage} defaultImage={product.productImage[0]} />
                </div>
                <div className='manrope-font'>
                    <div>
                        <h3 className='font-bold text-[20px] lg:text-[26px] text-[#000]'>{product.productName} <br className='hidden lg:block' />
                            {product.productNumber}</h3>
                        <p className='text-[18px] lg:text-[20px] font-normal mt-2 lg:mt-[18px]'>{product.productInfo}</p>
                    </div>
                    <div className='mt-2 lg:mt-[18px]'>
                        {/* Replace static rating with dynamic star rating */}
                        {renderStarRating(product.averageRating)}
                    </div>
                    <div className=" border-[#F1EEEE] border-b-2 w-full lg:w-[657px] mt-[10px]"></div>
                    <div className='mt-[24px]'>
                        <h3 className='font-bold text-[26px] lg:text-[30px] text-[#000]'> {formatPrice(product.productPrice)}</h3>
                    </div>
                    <div className='flex flex-col lg:flex-row gap-8 mt-5 lg:mt-[33px]'>
                        <div>
                            <div>
                                <h1 className='font-semibold text-[20px]'>Available Sizes</h1>
                            </div>
                            <div className='flex gap-2 mt-[18px]'>
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`w-[53px] h-[44px] py-[9px] px-[20px] cursor-pointer ${selectedSize === size ? 'border border-[#BD3A3A]' : ''}`}
                                        onClick={() => handleSizeSelect(size)}
                                    >
                                        <p className='jost-font text-[18px] font-medium'>{size}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div>
                                <h1 className='font-semibold text-[20px]'>Available Colors</h1>
                            </div>
                            <div className='flex gap-[6px] mt-[18px]'>
                                {availableColors.map((color) => (
                                    <button
                                        key={color.code}
                                        className={`rounded-full h-[40px] w-[40px] cursor-pointer ${selectedColor === color.code ? 'ring-2 ring-[#BD3A3A] ring-offset-2' : ''}`}
                                        style={{ backgroundColor: color.code }}
                                        onClick={() => handleColorSelect(color.code)}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        {isAdmin ? (
                            <Link
                                to={`/product/${product._id}/edit`}
                                className="bg-gray-300 rounded-[10px] flex items-center gap-5 pl-[55px] py-[10px] w-full lg:w-[452px] cursor-pointer mt-[34px]"
                            >
                                <Edit />
                                <span>
                                    Edit Product
                                </span>
                            </Link>
                        ) : (
                            <div className='flex flex-col lg:flex-row gap-8 items-start lg:items-center mt-[34px]'>
                                <div className='flex items-center'>
                                    <button onClick={handleDecrease} className='cursor-pointer'>
                                        <img src={Decrease} alt="" />
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={handleInputChange}
                                        className='w-[61px] h-[51px] text-center outline-none manrope-font font-semibold text-[24px]' />
                                    <button onClick={handleIncrease} className='cursor-pointer'>
                                        <img src={Increase} alt="" />
                                    </button>
                                </div>
                                <button
                                    onClick={addToWishlist}
                                    className={`${isInWishlist(product._id) ? 'bg-[#BD3A3A] text-white' : 'border border-[#BD3A3A] text-[#BD3A3A]'
                                        } rounded-[10px] px-[55px] py-[13px] flex items-center gap-5 cursor-pointer`}
                                >
                                    <img src={Wishlist} alt="" />
                                    <p className='manrope-font font-normal text-[16px]'>
                                        {isInWishlist(product._id) ? 'In Wishlist' : 'Wishlist'}
                                    </p>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='mt-[24px]'>
                        {isAdmin ? (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-[#BD3A3A] rounded-[10px] flex items-center gap-5 pl-[55px] py-[10px] w-full lg:w-[452px] cursor-pointer text-white"
                            >
                                <Archive />
                                <span>Delete</span>
                            </button>
                        ) : (
                            <button
                                onClick={addToCart}
                                className='bg-[#BD3A3A] rounded-[10px] flex items-center gap-5 pl-[55px] py-[10px] w-full lg:w-[452px] cursor-pointer'
                            >
                                <img src={AddCart} alt="" />
                                <p className='manrope-font font-normal text-[16px] text-[#ffffff]'>Add to Cart</p>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-8 lg:mt-[65px] manrope-font'>
                    <div className='mb-4 font-bold text-[20px] lg:text-[26px]'>
                        <h3>Product Description</h3>
                    </div>
                    <div className='w-full border-b border-[#F1EEEE] mb-[24px]'></div>
                    <div className='font-normal text-[16px]'>
                        <p>
                            {product.productDescription}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                {/* Pass the product ID to the ProductReview component */}
                <ProductReview productId={product._id} />
            </div>
            {!isAdmin && (
                <div>
                    <RecentlyViewed />
                </div>
            )}

            {showDeleteModal && (
                <Modal
                    title="Delete Product"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div className="p-6">
                        <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductPreview;