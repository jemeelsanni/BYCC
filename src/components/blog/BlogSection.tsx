import React from 'react';
import { BlogI, BlogII, BlogIII, AuthorViews, Arrow } from "../../assets/images"
import { Pagination } from '../ui/Pagination';
import { Link } from 'react-router-dom';

const BlogSection: React.FC = () => {
    return (
        <div className='mt-[96px]'>
            <div className="text-center">
                <h3 className="font-bold jost-font text-[39px] capitalize">BYC AFRICA Blog News</h3>
            </div>
            <div className='flex flex-col gap-[96px] mt-[96px]'>
                <div className=' flex items-center gap-16 justify-center'>
                    <div className='w-[610px]'>
                        <img src={BlogI} alt="" className='w-full h-[487px]' />
                    </div>
                    <div className='w-[645px]'>
                        <div className=' manrope-font'>
                            <h2 className=' font-bold text-[26px] text-[#212121]'>Fashion trend forecast for  Summer 2021</h2>
                            <p className=' font-normal text-[20px] text-[#424242] mt-10'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud ametAmet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet..</p>
                        </div>
                        <div>
                            <button className='border border-black flex gap-[13.7px] items-center p-4 mt-12'>
                                <Link to="/blogdetails" className='jost-font text-[13.7px] font-bold'>Read More</Link>
                                <img src={Arrow} alt="" />
                            </button>
                        </div>
                        <div className=' flex items-center mt-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                            <p className=' font-bold'>Wade Warren</p>
                            <p className=' font-normal'>Fashion Designer</p>
                        </div>
                    </div>
                </div>
                <div className=' flex items-center gap-16 justify-center'>
                    <div className='w-[645px]'>
                        <div className=' manrope-font'>
                            <h2 className=' font-bold text-[26px] text-[#212121]'>Fashion trend forecast for  Summer 2021</h2>
                            <p className=' font-normal text-[20px] text-[#424242] mt-10'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud ametAmet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet..</p>
                        </div>
                        <div>
                            <button className='border border-black flex gap-[13.7px] items-center p-4 mt-12'>
                                <Link to="/blogdetails" className='jost-font text-[13.7px] font-bold'>Read More</Link>
                                <img src={Arrow} alt="" />
                            </button>
                        </div>
                        <div className=' flex items-center mt-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                            <p className=' font-bold'>Wade Warren</p>
                            <p className=' font-normal'>Fashion Designer</p>
                        </div>
                    </div>
                    <div className='w-[610px]'>
                        <img src={BlogII} alt="" className='w-full h-[487px]' />
                    </div>
                </div>
                <div className=' flex items-center gap-16 justify-center'>
                    <div className='w-[610px]'>
                        <img src={BlogIII} alt="" className='w-full h-[487px]' />
                    </div>
                    <div className='w-[645px]'>
                        <div className=' manrope-font'>
                            <h2 className=' font-bold text-[26px] text-[#212121]'>Fashion trend forecast for  Summer 2021</h2>
                            <p className=' font-normal text-[20px] text-[#424242] mt-10'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud ametAmet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet..</p>
                        </div>
                        <div>
                            <button className='border border-black flex gap-[13.7px] items-center p-4 mt-12'>
                                <Link to="/blogdetails" className='jost-font text-[13.7px] font-bold'>Read More</Link>
                                <img src={Arrow} alt="" />
                            </button>
                        </div>
                        <div className=' flex items-center mt-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                            <p className=' font-bold'>Wade Warren</p>
                            <p className=' font-normal'>Fashion Designer</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-center mt-24'>
                <Pagination />
            </div>

        </div>
    )
}

export default BlogSection;