import React from 'react';
import { RatingBar, RatingCol, RatingFrame, RatingNum, ArrowRightRed, ReviewStar } from '../../assets/images';

const ProductReview: React.FC = () => {
    const productReviewData = [
        {
            review: "Good product",
            comment: "The product lasts, the design is perfect I love it",
            name: "JAMES JOHN"
        },
        {
            review: "Good product",
            comment: "The product lasts, the design is perfect I love it",
            name: "JAMES JOHN"
        },
        {
            review: "Good product",
            comment: "The product lasts, the design is perfect I love it",
            name: "JAMES JOHN"
        },
    ]
    return (
        <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 md:p-9 mt-8 md:mt-[65px]'>
            <div className='mb-8 md:mb-20 manrope-font'>
                <div className='mb-4 font-bold text-[20px] md:text-[26px]'>
                    <h3>Customer Reviews</h3>
                </div>
                <div className='w-full border-b border-[#F1EEEE] mb-[25px]'></div>
                <div className='font-normal text-[18px] md:text-[20px]'>
                    <p>PRODUCT RATINGS (1129)</p>
                </div>
                <div className='flex flex-col md:flex-row mt-5 items-center'>
                    <div>
                        <img src={RatingFrame} alt="" />
                    </div>
                    <div className='flex items-center'>
                        <div className='ml-0 md:ml-[56px]'>
                            <img src={RatingCol} alt="" />
                        </div>
                        <div className='ml-[24.32px]'>
                            <img src={RatingNum} alt="" />
                        </div>
                        <div className='ml-[45.32px]'>
                            <img src={RatingBar} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='manrope-font'>
                <div className='flex justify-between mb-2'>
                    <p className=' font-normal text-[18px] md:text-[20px]'>PRODUCT REVIEWS (438)</p>
                    <div className='flex items-center gap-[13px]'>
                        <p className='jost-font text-[#BD3A3A] font-medium text-[18px]'>See all</p>
                        <img src={ArrowRightRed} alt="" className='w-[18px] h-[18px]' />
                    </div>
                </div>

                {productReviewData.map((review, index) => (
                    <div key={index} className='mb-4'>
                        <div className='w-full border-b border-[#F1EEEE]'></div>
                        <div className='mt-8'>
                            <div className=' space-y-3'>
                                <h1 className='font-bold text-[18px]'>{review.review}</h1>
                                <p className='font-normal text-[12px]'>{review.comment}</p>
                            </div>
                            <div className='flex gap-[12.51px] items-center'>
                                <img src={ReviewStar} alt="" />
                                <p className='font-normal text-[12px]'>12-08-2021 by {review.name}</p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default ProductReview