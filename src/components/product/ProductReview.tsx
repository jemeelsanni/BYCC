import React, { useState, useEffect } from 'react';
import { ArrowRightRed } from '../../assets/images';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    getProductReviews,
    addReview,
    Review,
    RatingSummary,
    ReviewInput
} from '../../api/reviews';

interface ApiError {
    message?: string;
    response?: {
        data?: {
            message?: string;
        };
    };
}

const ProductReview: React.FC<{ productId?: string }> = ({ productId }) => {
    const params = useParams<{ id: string }>();
    const id = productId || params.id;
    const { isAuthenticated, isAdmin } = useAuth();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [ratingSummary, setRatingSummary] = useState<RatingSummary>({
        averageRating: 0,
        totalReviews: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStars: 0
    });
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [newReview, setNewReview] = useState<ReviewInput>({
        rating: 5,
        title: '',
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    // Fetch product reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await getProductReviews(id);
                setReviews(response.reviews);
                setRatingSummary(response.summary);
            } catch (err) {
                console.error('Error fetching product reviews:', err);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReview(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (rating: number) => {
        setNewReview(prev => ({
            ...prev,
            rating
        }));
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setError('Product ID is missing');
            return;
        }

        if (!newReview.title.trim()) {
            setError('Please provide a review title');
            return;
        }

        if (!newReview.comment.trim()) {
            setError('Please provide review comments');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await addReview(id, newReview);

            // Add the new review to the list
            setReviews(prev => [response, ...prev]);

            // Update rating summary
            setRatingSummary(prev => {
                const newTotal = prev.totalReviews + 1;
                const newStarCount = { ...prev };

                // Update the appropriate star count
                switch (newReview.rating) {
                    case 5: newStarCount.fiveStars += 1; break;
                    case 4: newStarCount.fourStars += 1; break;
                    case 3: newStarCount.threeStars += 1; break;
                    case 2: newStarCount.twoStars += 1; break;
                    case 1: newStarCount.oneStars += 1; break;
                }

                // Calculate new average
                const newAverage = (
                    (prev.averageRating * prev.totalReviews) + newReview.rating
                ) / newTotal;

                return {
                    ...newStarCount,
                    totalReviews: newTotal,
                    averageRating: newAverage
                };
            });

            // Reset form
            setNewReview({
                rating: 5,
                title: '',
                comment: ''
            });

            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err: unknown) {
            console.error('Error submitting review:', err);

            // Cast the unknown error to our ApiError type
            const apiError = err as ApiError;

            // Get the error message from the appropriate location
            const errorMessage =
                apiError.message ||
                apiError.response?.data?.message ||
                'Failed to submit review. Please try again.';

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate percentage for rating bars
    const calculatePercentage = (count: number) => {
        return ratingSummary.totalReviews > 0
            ? (count / ratingSummary.totalReviews) * 100
            : 0;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options).replace(/\//g, '-');
    };

    // Display limited reviews or all
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    // Render star rating component
    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-${star <= rating ? 'yellow' : 'gray'}-400`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-8 lg:mt-[65px]'>
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#BD3A3A]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-8 lg:mt-[65px]'>
            <div className='mb-8 lg:mb-20 manrope-font'>
                <div className='mb-4 font-bold text-[20px] lg:text-[26px]'>
                    <h3>Customer Reviews</h3>
                </div>
                <div className='w-full border-b border-[#F1EEEE] mb-[25px]'></div>
                <div className='font-normal text-[18px] lg:text-[20px]'>
                    <p>PRODUCT RATINGS ({ratingSummary.totalReviews})</p>
                </div>
                <div className='flex flex-col lg:flex-row mt-5 items-center'>
                    {/* Average Rating Display */}
                    <div className="bg-gray-50 p-6 rounded-md text-center">
                        <div className="text-4xl font-bold text-[#BD3A3A]">
                            {ratingSummary.averageRating ? ratingSummary.averageRating.toFixed(1) : '0.0'}
                        </div>
                        <div className="flex justify-center my-2">
                            {renderStars(Math.round(ratingSummary.averageRating || 0))}
                        </div>
                        <div className="text-sm text-gray-600">Based on {ratingSummary.totalReviews} reviews</div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 ml-0 lg:ml-8">
                        {/* 5 Stars */}
                        <div className="flex items-center mb-2">
                            <span className="w-16 text-sm">5 stars</span>
                            <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full">
                                <div
                                    className="bg-[#BD3A3A] h-2 rounded-full"
                                    style={{ width: `${calculatePercentage(ratingSummary.fiveStars)}%` }}
                                ></div>
                            </div>
                            <span className="w-10 text-sm text-right">{ratingSummary.fiveStars}</span>
                        </div>

                        {/* 4 Stars */}
                        <div className="flex items-center mb-2">
                            <span className="w-16 text-sm">4 stars</span>
                            <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full">
                                <div
                                    className="bg-[#BD3A3A] h-2 rounded-full"
                                    style={{ width: `${calculatePercentage(ratingSummary.fourStars)}%` }}
                                ></div>
                            </div>
                            <span className="w-10 text-sm text-right">{ratingSummary.fourStars}</span>
                        </div>

                        {/* 3 Stars */}
                        <div className="flex items-center mb-2">
                            <span className="w-16 text-sm">3 stars</span>
                            <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full">
                                <div
                                    className="bg-[#BD3A3A] h-2 rounded-full"
                                    style={{ width: `${calculatePercentage(ratingSummary.threeStars)}%` }}
                                ></div>
                            </div>
                            <span className="w-10 text-sm text-right">{ratingSummary.threeStars}</span>
                        </div>

                        {/* 2 Stars */}
                        <div className="flex items-center mb-2">
                            <span className="w-16 text-sm">2 stars</span>
                            <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full">
                                <div
                                    className="bg-[#BD3A3A] h-2 rounded-full"
                                    style={{ width: `${calculatePercentage(ratingSummary.twoStars)}%` }}
                                ></div>
                            </div>
                            <span className="w-10 text-sm text-right">{ratingSummary.twoStars}</span>
                        </div>

                        {/* 1 Star */}
                        <div className="flex items-center">
                            <span className="w-16 text-sm">1 star</span>
                            <div className="flex-1 mx-2 bg-gray-200 h-2 rounded-full">
                                <div
                                    className="bg-[#BD3A3A] h-2 rounded-full"
                                    style={{ width: `${calculatePercentage(ratingSummary.oneStars)}%` }}
                                ></div>
                            </div>
                            <span className="w-10 text-sm text-right">{ratingSummary.oneStars}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Write a Review Section - Only for authenticated users */}
            {isAuthenticated && !isAdmin && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Write a Review</h3>

                    {submitSuccess && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            Thank you! Your review has been submitted successfully.
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Your Rating</label>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className="text-2xl focus:outline-none"
                                    >
                                        <span className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="title" className="block mb-2 font-medium">Review Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newReview.title}
                                onChange={handleInputChange}
                                placeholder="Give your review a title"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="comment" className="block mb-2 font-medium">Your Review</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={newReview.comment}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Share your experience with this product"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#BD3A3A] text-white rounded-md hover:bg-[#A52F2F] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            <div className='manrope-font'>
                <div className='flex justify-between mb-2'>
                    <p className='font-normal text-[18px] lg:text-[20px]'>PRODUCT REVIEWS ({reviews.length})</p>
                    {reviews.length > 3 && (
                        <div className='flex items-center gap-[13px]' onClick={() => setShowAllReviews(!showAllReviews)} style={{ cursor: 'pointer' }}>
                            <p className='jost-font text-[#BD3A3A] font-medium text-[18px]'>{showAllReviews ? 'Show less' : 'See all'}</p>
                            <img src={ArrowRightRed} alt="" className='w-[18px] h-[18px]' />
                        </div>
                    )}
                </div>

                {displayedReviews.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    displayedReviews.map((review) => (
                        <div key={review.id} className='mb-4'>
                            <div className='w-full border-b border-[#F1EEEE]'></div>
                            <div className='mt-8'>
                                <div className='space-y-3'>
                                    <div className="flex items-center gap-3">
                                        <h1 className='font-bold text-[18px]'>{review.review}</h1>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className='font-normal text-[12px]'>{review.comment}</p>
                                </div>
                                <div className='flex gap-[12.51px] items-center mt-2'>
                                    <p className='font-normal text-[12px]'>{formatDate(review.date)} by {review.name}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReview;