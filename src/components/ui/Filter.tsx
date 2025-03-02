import React from 'react'

export const FilterCategory: React.FC = () => {
    return (
        <div className=' flex flex-col items-center jost-font'>
            <div className='flex gap-4 md:gap-[34px]  '>
                <p className='font-normal text-[20px] md:text-[25px]'>For Women</p>
                <div>
                    <p className=' font-normal text-[20px] md:text-[25px] text-[#828282]' >For Men</p>
                    <div className='border-b w-20 md:w-[88px] mt-[1px] bg-[#212121]'></div>
                </div>
                <p className='font-normal text-[20px] md:text-[25px]'>For Kids</p>
            </div>

            <div className='flex gap-1 md:gap-2 mt-8'>
                <p className='bg-[#F5F5F5] font-normal text-[18px] md:text-[20px] py-[14px] px-[24px]'>T-Shirt</p>
                <p className='bg-[#F5F5F5] font-normal text-[18px] md:text-[20px] py-[14px] px-[24px]'>Singlet</p>
                <p className='bg-[#D7000F] font-normal text-[18px] md:text-[20px] py-[14px] px-[24px] text-[#F5F5F5]'>Pants</p>
                <p className='bg-[#F5F5F5] font-normal text-[18px] md:text-[20px] py-[14px] px-[24px]'>Boxers</p>
            </div>
        </div>
    )
}
