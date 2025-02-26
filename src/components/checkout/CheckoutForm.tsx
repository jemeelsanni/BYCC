import React from 'react'

const CheckoutForm: React.FC = () => {
    return (
        <div>
            <div className='mb-4'><h3 className=' manrope-font font-bold text-[27px] mr-[82px]'>SHIPPING ADDRESS</h3></div>
            <div className='w-full border-b-2 border-[#F1EEEE] mb-[24px]'></div>
            <form action="" className='manrope-font mr-[82px]'>
                <div className='font-normal text-[16px]'>
                    <label htmlFor="">Full Name</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">Company Name (optional)</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">Country / Region</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">Town / City</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">State</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">Province</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">Phone</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <div className='font-normal text-[16px] mt-2.5'>
                    <label htmlFor="">Email Address</label>
                    <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-4 rounded-[10px]' />
                </div>
                <button className='w-full text-white bg-[#BD3A3A] rounded-[10px] font-normal text-[16px] mt-[39px] p-4'>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default CheckoutForm