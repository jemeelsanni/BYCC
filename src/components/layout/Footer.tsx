import React from 'react'
import { MasterCard, PayPal, Visa } from '../../assets/images'
import { Arrow, Mail, Phone, Facebook, Instagram, Twitter, YouTube } from '../../assets/icons'

const Footer: React.FC = () => {
    return (
        <div className='w-full bg-[#212121] px-8 md:px-[156px] pt-10 md:pt-[80px] pb-[40px] text-white mt-12 md:mt-[96px]'>
            <div className='flex flex-col md:flex-row justify-between mr-9'>
                <div className='flex flex-col md:flex-row gap-10 md:gap-[92px]'>
                    <div className='jost-font flex flex-col gap-4'>
                        <h3 className=' capitalize font-bold text-[16px] '>company info</h3>
                        <div className=' capitalize font-normal text-[12px] flex flex-col gap-4'>
                            <p>about us</p>
                            <p>affiliate</p>
                            <p>fashion blogger</p>
                        </div>
                    </div>
                    <div className='jost-font flex flex-col gap-4'>
                        <h3 className=' capitalize font-bold text-[16px] '>help & support</h3>
                        <div className=' font-normal text-[12px] flex flex-col gap-4'>
                            <p>Shipping Info</p>
                            <p>Refunds</p>
                            <p>How to Order</p>
                            <p>How to Track</p>
                            <p>Size Guides</p>
                        </div>
                    </div>
                    <div className='jost-font flex flex-col gap-4'>
                        <h3 className=' capitalize font-bold text-[16px] '>company info</h3>
                        <div className=' capitalize font-normal text-[12px] flex flex-col gap-4'>
                            <p>contact us</p>
                            <p>payment methods</p>
                        </div>
                        <div className='flex gap-6'>
                            <img src={PayPal} alt="" className='w-[53.33px] h-[20px]' />
                            <img src={Visa} alt="" className='w-[43.33px] h-[20px]' />
                            <img src={MasterCard} alt="" className='w-[30px] h-[20px]' />
                        </div>
                    </div>
                </div>
                <div className=' flex flex-col gap-[36.54px]'>
                    <div className='jost-font flex flex-col gap-4'>
                        <h3 className='capitalize font-bold mt-4 md:mt-0 text-[16px]'>signup for the latest news</h3>
                        <form action="" className='border border-white w-[272.67px] flex justify-between items-center p-2 font-normal text-[12px]'>
                            <input type="email" placeholder='antonie@gmail.com' className='outline-none bg-transparent w-full mr-4 ' />
                            <button>
                                <img src={Arrow} alt="" />
                            </button>
                        </form>
                    </div>
                    <div className='jost-font flex flex-col gap-3 font-normal text-[12px]'>
                        <a href='/' className='flex gap-1 items-center'>
                            <img src={Mail} alt="" />
                            <p>bycafrica@gmail.com</p>
                        </a>
                        <a href='/' className='flex gap-1 items-center'>
                            <img src={Phone} alt="" />
                            <p>+2348101375376; +2349053403403 </p>
                        </a>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center gap-2 md:gap-6 mt-10'>
                <a href="/">
                    <img src={Facebook} alt="" />
                </a>
                <a href="/">
                    <img src={Instagram} alt="" />
                </a>
                <a href="/">
                    <img src={Twitter} alt="" />
                </a>
                <a href="/">
                    <img src={YouTube} alt="" />
                </a>
            </div>
            <div className=' border-2 border-white my-4'></div>
            <div className=' text-center'>
                <p className='jost-font font-normal text-[12px]'>All rights Reserved  copyright bycafrica 2021.</p>
            </div>

        </div >
    )
}

export default Footer