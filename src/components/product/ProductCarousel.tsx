import React, { useState } from 'react';
import { BlueBoxers, RedBoxers, ArrowLeftRed, ArrowRightRed } from '../../assets/images';


const productImages = [
    BlueBoxers,
    RedBoxers,
    BlueBoxers,
    RedBoxers
];

const ProductImageCarousel: React.FC = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const handlePrevImage = () => {
        setCurrentImage((prev) =>
            prev === 0 ? productImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImage((prev) =>
            prev === productImages.length - 1 ? 0 : prev + 1
        );
    };
    return (
        <div className="">
            {/* Main Image */}
            <div className="w-[416px] h-[349px]">
                <img
                    src={productImages[currentImage]}
                    alt={`Product view ${currentImage + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnail Preview */}
            <div className='flex items-center gap-4 '>
                <div className=''>
                    <button
                        onClick={handlePrevImage}
                        className=" bg-white/50 p-4 mt-12 cursor-pointer"
                    >
                        <img src={ArrowLeftRed} alt="" className='w-[18px] h-[18px]' />
                    </button>
                </div>
                <div className="flex justify-center mt-12 space-x-4">
                    {productImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => setCurrentImage(index)}
                            className={`
                w-[79px] h-[79px] object-cover cursor-pointer
                ${currentImage === index ? 'border-2 border-blue-500' : 'opacity-50'}
              `}
                        />
                    ))}
                </div>
                <div className=''>
                    <button
                        onClick={handleNextImage}
                        className=" bg-white/50 p-4 mt-12 cursor-pointer"
                    >
                        <img src={ArrowRightRed} alt="" className='w-[18px] h-[18px] ' />
                    </button>
                </div>
            </div>






        </div>
    )
}

export default ProductImageCarousel;