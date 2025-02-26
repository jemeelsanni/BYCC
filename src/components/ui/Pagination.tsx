import React from 'react'
import { ArrowLeft, ArrowRight } from '../../assets/images';

export const Pagination: React.FC = () => {
    return (
        <div className='jost-font font-medium flex items-center gap-2'>
            <button className='shadow-lg p-4 w-[53px] h-[44px]'>
                <img src={ArrowLeft} alt="" className='w-[18px] h-[18px]' />
            </button>
            <button className='shadow-lg p-4 w-[53px] h-[44px]'>
                <p>1</p>
            </button>
            <button className='shadow-lg p-4 w-[53px] h-[44px]'>
                <p>2</p>
            </button>
            <button className='shadow-lg p-4 w-[53px] h-[44px]'>
                <p>3</p>
            </button>
            <button className='shadow-lg p-4 w-[53px] h-[44px]'>
                <img src={ArrowRight} alt="" className='w-[18px] h-[18px]' />
            </button>
        </div>
    )
};
