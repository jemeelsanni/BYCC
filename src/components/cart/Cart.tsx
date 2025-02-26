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
        <div className="mt-24 mx-24">
            <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-9 mt-[65px] manrope-font'>
                <div>
                    <div className='mb-4 font-bold text-[26px]'>
                        <h3>Cart 1 item(s)</h3>
                    </div>
                    <div className='w-full border-b border-[#F1EEEE] mb-[24px]'></div>
                    <div className='flex gap-7 items-start'>
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
                                        <p className="text-[#BD3A3A] font-semibold text-[16px]">Wishlist</p>
                                    </button>
                                    <button className="flex bg-[#BD3A3A] items-center rounded-md gap-[21px] px-[55px] py-[13px] cursor-pointer">
                                        <img src={Delete} alt="" className=" h-[24px] w-[24px]" />
                                        <p className="text-[#FFF] font-semibold text-[16px]">Remove</p>
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
                </div>
                <div className=" border-[#F1EEEE] border-b-2 w-full mt-[64px]"></div>
                <div className='relative mb-[332px] mt-4'>
                    <div className='absolute right-[52px] manrope-font '>
                        <h3 className='text-[26px] font-bold'>CART TOTALS</h3>
                        <div className='mt-[23px] '>
                            <div className="flex justify-between gap-[293px] mb-2">
                                <span className="text-[20px] font-normal">Subtotal</span>
                                <span className="text-[20px] font-normal">₦20,000.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[20px] font-normal">Total</span>
                                <span className="text-[20px] font-normal">₦20,000.00</span>
                            </div>
                        </div>
                        <div className='flex gap-[28px] manrope-font mt-32'>
                            <Link to="/product">
                                <button className="flex items-center border-2 border-[#BD3A3A] rounded-md gap-[21px] px-[55px] py-[13px] cursor-pointer">
                                    <p className="text-[#BD3A3A] font-semibold text-[16px]">Continue Shopping</p>
                                </button>
                            </Link>
                            <Link to="/checkout">
                                <button className="flex bg-[#BD3A3A] items-center rounded-md gap-[21px] px-[55px] py-[13px] cursor-pointer">
                                    <p className="text-[#FFF] font-semibold text-[16px]">Proceed to Checkout</p>
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