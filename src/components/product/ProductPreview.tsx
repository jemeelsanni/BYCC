import React, { useState } from 'react'
import { ProductCarousel, ProductReview, ProductDescription } from '../product/index';
import { RecentlyViewed } from '.';

import { Starp, Decrease, Increase } from '../../assets/images';
import { Wishlist, AddCart } from '../../assets/icons';

const ProductPreview: React.FC = () => {
    const [quantity, setQuantity] = useState(1);

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

    return (
        <div className="mt-8 md:mt-24 mx-4 md:mx-24">
            <div className='flex flex-col md:flex-row gap-8 md:gap-[123px] border-[#F1EEEE] border shadow-lg rounded-lg p-4 md:p-8 '>
                <div>
                    <ProductCarousel />
                </div>
                <div className='manrope-font'>
                    <div>
                        <h3 className='font-bold text-[20px] md:text-[26px] text-[#000]'>MEN BOXERS <br className='hidden md:block' />
                            BYC 1166</h3>
                        <p className='text-[18px] md:text-[20px] font-normal mt-2 md:mt-[18px]'>100% Cotton 12 Pieces Of Mens Boxer </p>
                    </div>
                    <div className='mt-2 md:mt-[18px]'>
                        <img src={Starp} alt="" />
                    </div>
                    <div className=" border-[#F1EEEE] border-b-2 w-full md:w-[657px] mt-[10px]"></div>
                    <div className='mt-[24px]'>
                        <h3 className='font-bold text-[26px] md:text-[30px] text-[#000]'>₦2,800.00</h3>
                    </div>
                    <div className='flex flex-col md:flex-row gap-8 mt-5 md:mt-[33px]'>
                        <div>
                            <div>
                                <h1 className=' font-semibold text-[20px]'>Available Sizes</h1>
                            </div>
                            <div className='flex gap-2 mt-[18px]'>
                                <button className='w-[53px] h-[44px] py-[9px] px-[20px] cursor-pointer'>
                                    <p className='jost-font text-[18px] font-medium'>S</p>
                                </button>
                                <button className='w-[53px] h-[44px] py-[9px] px-[20px] cursor-pointer'>
                                    <p className='jost-font text-[18px] font-medium'>M</p>
                                </button>
                                <button className='w-[53px] h-[44px] py-[9px] px-[20px] cursor-pointer border border-[#BD3A3A]'>
                                    <p className='jost-font text-[18px] font-medium'>L</p>
                                </button>
                                <button className='w-[53px] h-[44px] py-[9px] px-[20px] cursor-pointer'>
                                    <p className='jost-font text-[18px] font-medium'>XL</p>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h1 className=' font-semibold text-[20px]'>Available Colors</h1>
                            </div>
                            <div className='flex gap-[6px] mt-[18px]'>
                                <button className=' rounded-full bg-[#3870C4] h-[40px] w-[40px] cursor-pointer'></button>
                                <button className=' rounded-full bg-[#FF05E6] h-[40px] w-[40px] cursor-pointer'></button>
                                <button className=' rounded-full bg-[#FB8200] h-[40px] w-[40px] cursor-pointer'></button>
                                <button className=' rounded-full bg-[#000000] h-[40px] w-[40px] cursor-pointer'></button>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-8 items-start md:items-center mt-[34px]'>
                        <div className='flex items-center'>
                            <button onClick={handleDecrease} className='cursor-pointer'>
                                <img src={Decrease} alt="" />
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                onChange={handleInputChange}
                                className=' w-[61px] h-[51px] text-center outline-none manrope-font font-semibold text-[24px]' />
                            <button onClick={handleIncrease} className='cursor-pointer'>
                                <img src={Increase} alt="" />
                            </button>
                        </div>
                        <button className='border border-[#BD3A3A] rounded-[10px] px-[55px] py-[13px] flex items-center gap-5 cursor-pointer'>
                            <img src={Wishlist} alt="" />
                            <p className='manrope-font font-normal text-[16px] text-[#BD3A3A]'>Wishlist</p>
                        </button>
                    </div>
                    <div className='mt-[24px]'>
                        <button className='bg-[#BD3A3A] rounded-[10px] flex items-center gap-5 pl-[55px] py-[10px] w-full md:w-[452px] cursor-pointer'>
                            <img src={AddCart} alt="" />
                            <p className='manrope-font font-normal text-[16px] text-[#ffffff]'>Add to Cart</p>
                        </button>
                    </div>

                </div>
            </div>
            <div>
                <ProductDescription />
            </div>
            <div>
                <ProductReview />
            </div>
            <div>
                <RecentlyViewed />
            </div>
        </div>
    )
}

export default ProductPreview;