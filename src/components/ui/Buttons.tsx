import React from 'react'
import { Link } from 'react-router-dom';

export const HeroButton: React.FC = () => {
    return (
        <div className="jost-font flex justify-center gap-8">
            <Link to="/product">
                <button className=" px-6 lg:px-10 py-4 border-2 border-black text-[14px] lg:text-[18.56px] font-bold bg-black text-white cursor-pointer">
                    Shop Now
                </button>
            </Link>
            <Link to="/about">
                <button className="px-6 lg:px-10 py-4 border-2 border-black text-[14px] lg:text-[18.56px] font-bold bg-white text-black cursor-pointer">
                    Learn more
                </button>
            </Link>

        </div>
    )
};


export const ArrivalsView: React.FC = () => {
    return (
        <div className='jost-font'>
            <Link to="/product">
                <button className="px-6 lg:px-10 py-4 border border-black text-[14px] lg:text-[18.56px] font-bold bg-white text-black cursor-pointer">
                    View All
                </button></Link>
        </div>
    )
}


export const ExploreCollectionButton = () => {
    return (
        <div className='jost-font'>
            <Link to="/product">
                <button className="px-[34.38px] py-4 border border-black text-[17.19px] font-bold bg-[#F1F1F1] text-black">
                    Explore
                </button>
            </Link>
        </div>
    )
}


