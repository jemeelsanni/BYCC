import React, { useState } from 'react';
import { BlueBoxers, Decrease, Increase } from '../../assets/images';
import { Like, Delete } from "../../assets/icons";
import { RecentlyViewed } from '../product';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
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
            <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 md:p-9 mt-[65px] manrope-font'>
                <div>
                    <div className='mb-4 font-bold text-[20px] md:text-[26px]'>
                        <h3>Cart 1 item(s)</h3>
                    </div>
                    <div className='w-full border-b border-[#F1EEEE] mb-[24px]'></div>
                    <div className='hidden md:flex gap-7 items-start '>
                        <div className='flex gap-[60px]'>
                            <div className=' w-[207px] h-[182px]'>
                                <img src={BlueBoxers} alt="" className='h-full w-full' />
                            </div>
                            <div>
                                <div className='manrope-font'>
                                    <h3 className=' font-bold text-[26px] mb-[16px]'>MEN BOXERS <br />
                                        BYC 1166</h3>
                                    <p className=' font-normal text-[20px] mb-[27px]'>100% Cotton 12 Pieces Of Mens Boxer </p>
                                </div>
                                <div className='flex gap-[28px] manrope-font'>
                                    <button className="flex items-center border-2 border-[#BD3A3A] rounded-md gap-[21px] px-[55px] py-[13px] cursor-pointer">
                                        <img src={Like} alt="" className=" h-[24px] w-[24px]" />
                                        <p className="text-[#BD3A3A] font-semibold text-[16px] ">Wishlist</p>
                                    </button>
                                    <button className="flex bg-[#BD3A3A] items-center rounded-md gap-[21px] px-[55px] py-[13px] cursor-pointer">
                                        <img src={Delete} alt="" className=" h-[24px] w-[24px]" />
                                        <p className="text-[#FFF] font-semibold text-[16px] ">Remove</p>
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className='border-l-2 h-[196px] border-[#F1EEEE] mb-[24px]'></div>
                        <div>
                            <p className='text-center manrope-font font-normal text-[20px] mb-5'>Quantity</p>
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
                        </div>
                        <div className=' border-l-2 h-[196px] border-[#F1EEEE] mb-[24px]'></div>
                        <div>
                            <p className='text-center manrope-font font-normal text-[20px] mb-5'>Unit Price</p>
                            <p className='text-center manrope-font font-bold text-[30px] mb-5'>₦2,800.00</p>
                        </div>
                    </div>
                    <div className='block md:hidden '>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-4'>
                                <img src={BlueBoxers} alt="" className='w-[120px] h-[120px]' />
                                <div >
                                    <h3 className=' font-bold text-[20px] md:text-[26px] mb-[16px]'>MEN BOXERS <br />
                                        BYC 1166</h3>
                                    <p className=' font-normal text-[18px] md:text-[20px]'>100% Cotton 12 Pieces Of Mens Boxer </p>
                                    <p className='manrope-font font-bold text-[24px] md:text-[30px] mb-5'>₦2,800.00</p>
                                </div>
                            </div>




                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <button className="flex bg-[#BD3A3A] items-center rounded-md p-3 cursor-pointer">
                                    <img src={Delete} alt="" className=" h-4 w-4" />
                                </button>

                            </div>
                            <div className='flex items-center'>
                                <button onClick={handleDecrease} className='cursor-pointer'>
                                    <img src={Decrease} alt="" className=" h-10 w-10" />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={handleInputChange}
                                    className=' w-10 h-10 text-center outline-none manrope-font font-semibold text-[20px] md:text-[24px]' />
                                <button onClick={handleIncrease} className='cursor-pointer'>
                                    <img src={Increase} alt="" className=" h-10 w-10" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" border-[#F1EEEE] border-b-2 w-full mt-[64px]"></div>
                <div className='relative mb-[332px] mt-4'>
                    <div className='absolute left-0 md:right-[52px] manrope-font '>
                        <h3 className='text-[22px] md:text-[26px] font-bold'>CART TOTALS</h3>
                        <div className='mt-[23px] md:mr-0 mr-[37px]'>
                            <div className="flex justify-between md:gap-[293px] mb-2">
                                <span className="text-[20px] font-normal">Subtotal</span>
                                <span className="text-[20px] font-normal">₦20,000.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[20px] font-normal">Total</span>
                                <span className="text-[20px] font-normal">₦20,000.00</span>
                            </div>
                        </div>
                        <div className='hidden md:flex  gap-[28px] manrope-font mt-32'>
                            <Link to="/product">
                                <button className="flex items-center border-2 border-[#BD3A3A] rounded-md px-[13px] md:px-[55px] py-[13px] cursor-pointer">
                                    <p className="text-[#BD3A3A] font-semibold text-[12px] md:text-[16px]">Continue Shopping</p>
                                </button>
                            </Link>
                            <Link to="/checkout">
                                <button className="flex border-2 border-[#BD3A3A] bg-[#BD3A3A] items-center rounded-md px-[13px] md:px-[55px] py-[13px] cursor-pointer">
                                    <p className="text-[#FFF] font-semibold text-[12px] md:text-[16px]">Proceed to Checkout</p>
                                </button>
                            </Link>
                        </div>
                        <div className='flex md:hidden justify-center  gap-2 manrope-font mt-8 md:mt-32'>
                            <Link to="/product">
                                <button className="flex items-center border-2 border-[#BD3A3A] rounded-md px-[13px] md:px-[55px] py-[13px] cursor-pointer">
                                    <p className="text-[#BD3A3A] font-semibold text-[14px] md:text-[16px]">Continue Shopping</p>
                                </button>
                            </Link>
                            <Link to="/checkout">
                                <button className="flex border-2 border-[#BD3A3A] bg-[#BD3A3A] items-center rounded-md px-[13px] md:px-[55px] py-[13px] cursor-pointer">
                                    <p className="text-[#FFF] font-semibold text-[14px] md:text-[16px]">Proceed to Checkout</p>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>



            </div>
            <div>
                <RecentlyViewed />
            </div>
        </div>
    )
}

export default Cart;