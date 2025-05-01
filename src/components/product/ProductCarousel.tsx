import React, { useState, useEffect } from 'react';
import { BlueBoxers, RedBoxers, ArrowLeftRed, ArrowRightRed } from '../../assets/images';

interface ProductImageCarouselProps {
    images?: string[]; // Images can be passed from parent component as an array of URLs
    defaultImage?: string; // Fallback image if no images are provided
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
    images = [],
    defaultImage = BlueBoxers
}) => {
    // If no images are provided, use default sample images
    const [carouselImages, setCarouselImages] = useState<string[]>([]);
    const [currentImage, setCurrentImage] = useState(0);

    // Initialize images when component mounts or props change
    useEffect(() => {
        // If images prop has content, use it
        if (images && images.length > 0) {
            setCarouselImages(images);
        } else {
            // Otherwise use sample images
            setCarouselImages([BlueBoxers, RedBoxers, BlueBoxers]);
        }

        // Reset to first image when images change
        setCurrentImage(0);
    }, [images]);

    // Handle navigation
    const handlePrevImage = () => {
        setCurrentImage((prev) =>
            prev === 0 ? carouselImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImage((prev) =>
            prev === carouselImages.length - 1 ? 0 : prev + 1
        );
    };

    // If no images are available, return with default image
    if (carouselImages.length === 0) {
        return (
            <div className="">
                <div className="w-[342px] lg:w-[416px] h-[349px]">
                    <img
                        src={defaultImage}
                        alt="Product image"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="">
            {/* Main Image */}
            <div className="w-[342px] lg:w-[416px] h-[349px]">
                <img
                    src={carouselImages[currentImage]}
                    alt={`Product view ${currentImage + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnail Preview - Only show if there are multiple images */}
            {carouselImages.length > 1 && (
                <div className='flex items-center gap-4'>
                    <div className=''>
                        <button
                            onClick={handlePrevImage}
                            className="bg-white/50 p-4 mt-12 cursor-pointer"
                        >
                            <img src={ArrowLeftRed} alt="Previous" className='w-[18px] h-[18px]' />
                        </button>
                    </div>
                    <div className="flex justify-center mt-12 space-x-4">
                        {carouselImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setCurrentImage(index)}
                                className={`
                  w-[79px] h-[79px] object-cover cursor-pointer
                  ${currentImage === index ? 'border-2 border-[#BD3A3A]' : 'opacity-50'}
                `}
                            />
                        ))}
                    </div>
                    <div className=''>
                        <button
                            onClick={handleNextImage}
                            className="bg-white/50 p-4 mt-12 cursor-pointer"
                        >
                            <img src={ArrowRightRed} alt="Next" className='w-[18px] h-[18px]' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductImageCarousel;