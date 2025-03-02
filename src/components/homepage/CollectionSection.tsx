import React from 'react'
import { ExploreCollectionButton, ArrivalsView } from '../ui/Button'
import { MenCollection, WomenCollection, BabyCollection } from '../../assets/images'

const CollectionSection: React.FC = () => {
    return (
        <div className='grid place-items-center mx-8 md:mx-0 mt-16 md:mt-[96px]'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
                <div className='w-auto md:w-[675.56px] h-auto md:h-[658.12px] bg-[#F1F1F1] pr-10 md:pr-0 pl-10 md:pl-[88px] py-10 md:py-auto flex items-center justify-start'>
                    <div className='jost-font '>
                        <h2 className=' font-bold text-[28px] md:text-[33.52px] text-[#616161]'>BYC Collection 2021</h2>
                        <h4 className=' font-bold text-[40px] md:text-[52.43px]'>BYC Collection</h4>
                        <p className='lato-regular text-[13.75px] text-[#424242]'>The best everyday option in a Super Saver range within a <br /> reasonable price. It is our responsibility to keep you <br />
                            100 percent stylish. Be smart & trendy with us.</p>
                        <div className='mt-8 md:mt-20'><ExploreCollectionButton /></div>
                    </div>
                </div>
                <div className='w-auto md:w-[675.56px] h-auto md:h-[658.12px]'>
                    <img src={BabyCollection} alt="" className='w-full h-full' />
                </div>
                <div className='w-auto md:w-[675.56px] h-auto md:h-[658.12px]'>
                    <img src={WomenCollection} alt="" className='w-full h-full' />
                </div>
                <div className='w-auto md:w-[675.56px] h-auto md:h-[658.12px]'>
                    <img src={MenCollection} alt="" className='w-full h-full' />
                </div>

            </div>
            <div className='flex justify-center mt-16'>
                <ArrivalsView />
            </div>
        </div>
    )
}

export default CollectionSection