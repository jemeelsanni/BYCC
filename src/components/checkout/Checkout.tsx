import React, { useState } from 'react'
import CheckoutForm from './CheckoutForm';
import { BlueBoxers, Flutterwave } from '../../assets/images';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<'bank' | 'online'>('bank');

    return (
        <div className="mt-8 md:mt-24 mx-4 md:mx-24 ">
            <div className='border-[#F1EEEE] border shadow-lg rounded-lg  p-4 md:p-9 pb-[75px] mt-[65px] manrope-font'>
                <div>
                    <div className='mb-4 font-bold text-[20px] md:text-[26px]'>
                        <h3>Order Summary  1 item(s)</h3>
                    </div>
                    <div className='w-full border-b-2 border-[#F1EEEE] mb-[24px]'></div>
                    <div className=' flex flex-col md:flex-row items-start justify-between'>
                        <div className='flex gap-6 md:gap-[60px] items-start '>
                            <div className='w-[207px] h-[182px]'>
                                <img src={BlueBoxers} alt="" />
                            </div>
                            <div className=''>
                                <div className='mb-[34px]'>
                                    <h3 className=' font-bold text-[20px] md:text-[26px] mb-[16px]'>MEN BOXERS <br />
                                        BYC 1166</h3>
                                    <p className=' font-normal text-[18px] md:text-[20px]'>100% Cotton 12 Pieces Of Mens Boxer </p>
                                </div>
                                <div className='mb-[15px]'><p className='font-bold text-[24px] md:text-[30px]'>₦2,800.00</p></div>
                                <div className=' font-normal text-[20px] flex gap-[33px]'>
                                    <p>Quantity:</p>
                                    <p>1</p>
                                </div>
                                <div className='mt-6'>
                                    <Link to="/cart">
                                        <button className="flex bg-[#BD3A3A] items-center rounded-md gap-[21px] px-8 md:px-[55px] py-[13px] cursor-pointer">
                                            <p className="text-[#FFF] font-semibold text-[16px]">Modify Cart</p>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className='flex mt-8 md:mt-0'>
                            <div className=' hidden md:block border-l-2 border-[#F1EEEE] h-[196px] mr-5'></div>
                            <div className=''>
                                <div className="flex justify-between gap-[180px] md:gap-[293px] mb-0 md:mb-2">
                                    <span className="text-[20px] font-normal">Subtotal</span>
                                    <span className="text-[20px] font-normal">₦20,000.00</span>
                                </div>
                                <div className="flex justify-between mt-2 md:mt-[23px] pb-4 md:pb-[38px] border-b-2 border-[#F1EEEE]">
                                    <span className="text-[20px] font-normal">Delivery Fee</span>
                                    <span className="text-[20px] font-normal">₦20,000.00</span>
                                </div>
                                <div className="flex justify-between mt-2 md:mt-[20px]">
                                    <span className="text-[20px] font-bold">Total</span>
                                    <span className="text-[20px] font-bold">₦20,000.00</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='w-full border-b-2 border-[#F1EEEE] mt-[44px]'></div>
                <div className='flex flex-col md:flex-row items-start justify-center mt-6 md:mt-[60px]'>
                    <div className='w-full md:w-[50%]'>
                        <CheckoutForm />
                    </div>
                    <div className='w-full md:w-[50%]'>
                        <div className='mb-4 mt-10 md:mt-0'><h3 className=' manrope-font font-bold text-[27px] ml-[82px]'>CHECKOUT</h3></div>
                        <div className='w-full border-b-2 border-[#F1EEEE] mb-[24px]'></div>
                        <div className='ml-0 md:ml-[82px] bg-[#FFF8F8] px-[24px] pt-[42px] pb-[50px] rounded-[10px]'>

                            <div className='flex items-start cursor-pointer' onClick={() => setSelectedMethod('bank')}>
                                <div
                                    className={
                                        `w-6 h-6 rounded-full border-2 mr-3 mt-1
                                            ${selectedMethod === 'bank'
                                            ? 'border-red-500'
                                            : 'border-red-500'}
                                        `}
                                >
                                    {selectedMethod === 'bank' && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                                <div >
                                    <h3 className="font-semibold text-[16px]">Direct Bank Transfer</h3>
                                    <p className="text-[14px] bg-[#FFFFFF] text-[#9F9F9F] rounded-[10px] py-4 pl-4 pr-16 mt-6 w-[280px] md:w-full">
                                        Make your payment directly into our bank account. <br />
                                        Please use your Order ID as the payment reference. <br />
                                        Your order will not be shipped until the funds have cleared in our account.
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start md:items-center cursor-pointer mt-10' onClick={() => setSelectedMethod('online')}>
                                <div
                                    className={
                                        `w-6 h-6 rounded-full border-2 mr-3 mt-1
                                           n ${selectedMethod === 'online'
                                            ? 'border-red-500'
                                            : 'border-red-500'}
                                        `}
                                >
                                    {selectedMethod === 'online' && (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-9">
                                    <h3 className="font-semibold text-[16px]">Secured Online Payment</h3>
                                    <img src={Flutterwave} alt="" />
                                </div>
                            </div>
                            <div className='ml-10 mt-[40px] md:mt-[135px]'>
                                <p className='font-normal text-[12px]'>Your personal data will be used to process your order, support your experience throughout <br />
                                    this website, and for other purposes described in our privacy policy.</p>
                            </div>

                        </div>
                        <button className='w-full md:w-[674px] text-white bg-[#BD3A3A] rounded-[10px] font-normal text-[16px] mt-[39px] ml-0 md:ml-[82px] p-4'>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Checkout