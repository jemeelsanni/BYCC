import React from 'react'

export const HeroButton: React.FC = () => {
    return (
        <div className="jost-font flex justify-center gap-8">
            <button className=" px-6 md:px-10 py-4 border-2 border-black text-[14px] md:text-[18.56px] font-bold bg-black text-white">
                Shop Now
            </button>
            <button className="px-6 md:px-10 py-4 border-2 border-black text-[14px] md:text-[18.56px] font-bold bg-white text-black">
                Learn more
            </button>
        </div>
    )
};


export const ArrivalsView: React.FC = () => {
    return (
        <div className='jost-font'>
            <button className="px-6 md:px-10 py-4 border border-black text-[14px] md:text-[18.56px] font-bold bg-white text-black">
                View All
            </button>
        </div>
    )
}


export const ExploreCollectionButton = () => {
    return (
        <div className='jost-font'>
            <button className="px-[34.38px] py-4 border border-black text-[17.19px] font-bold bg-[#F1F1F1] text-black">
                Explore
            </button>
        </div>
    )
}


