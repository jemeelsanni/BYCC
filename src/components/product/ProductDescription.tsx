import React from 'react';

interface ProductDescriptionProps {
    productDetails?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = () => {

    // Find product details if not provided as prop


    // Default details if not found
    const defaultDetails = "This set of boxers will make you feel comfortable. The hem doesn't ravel. It is made from cotton which allows aeration around your body. It suitable for both adults and teenagers. These pair of boxers give good fit and sits appropriately, they ensure there is no unsightly bulge and they also give support to an important part of your body, which overall improves your confidence. It has a comfortable cotton material. It comes in different beautiful colors and patterns.  It has cool and comfortable fit with flexible hem that doesn't ravel and comes tag -free for maximum comfort. Soft breathable fabric for air movement and forms to your body for best Fit. It is made of 100% premium cotton and is perfect for crotch, so you don't have to worry about ugly bumps. For pure organic softness and premium lingerie support, pair this four-in-one suit with yourself or the special man in your life.";

    return (
        <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-9 mt-8 lg:mt-[65px] manrope-font'>
            <div className='mb-4 font-bold text-[20px] lg:text-[26px]'>
                <h3>Product Description</h3>
            </div>
            <div className='w-full border-b border-[#F1EEEE] mb-[24px]'></div>
            <div className='font-normal text-[16px]'>
                <p>
                    {defaultDetails}
                </p>
            </div>
        </div>
    );
};

export default ProductDescription;