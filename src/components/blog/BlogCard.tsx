import React from 'react';
import { BlogI, BlogII, BlogIII, AuthorViews, Arrow } from "../../assets/images";

const BlogCard: React.FC = () => {
    return (
        <div>
            <div className='flex flex-col md:flex-row mx-2 md:mx-24 items-center gap-6 md:gap-3 mt-8 md:mt-[87.31px]'>
                <div className=' w-full px-0 lg:px-0 shadow-lg pb-8 md:pb-[96px]'>
                    <img src={BlogI} alt="" className=' object-cover w-full h-[446.13px}' />
                    <div>
                        <div className=' flex items-center mt-8 mx-3 md:mx-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='mx-3 md:mx-8'>
                            <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                                <p className=' font-bold'>Wade Warren</p>
                                <p className=' font-normal'>Fashion Designer</p>
                            </div>
                            <div className='mt-[47.95px]'>
                                <h2 className='jost-font text-[#212121] text-[26.55px] font-bold '>How important are clothes in your style?</h2>
                                <p className=' lato-regular text-[13.7px] text-[#424242] mt-[27.4px]'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            </div>
                            <div className='mt-[47.93px]'>
                                <button className='border border-black flex gap-[13.7px] items-center p-4 '>
                                    <p className='jost-font text-[13.7px] font-bold'>Read More</p>
                                    <img src={Arrow} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' w-full px-0 lg:px-0 shadow-lg pb-8 md:pb-[96px]'>
                    <img src={BlogII} alt="" className=' object-cover w-full h-[446.13px}' />
                    <div>
                        <div className=' flex items-center mt-8 mx-3 md:mx-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='mx-3 md:mx-8'>
                            <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                                <p className=' font-bold'>Wade Warren</p>
                                <p className=' font-normal'>Fashion Designer</p>
                            </div>
                            <div className='mt-[47.95px]'>
                                <h2 className='jost-font text-[#212121] text-[26.55px] font-bold '>How important are clothes in your style?</h2>
                                <p className=' lato-regular text-[13.7px] text-[#424242] mt-[27.4px]'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            </div>
                            <div className='mt-[47.93px]'>
                                <button className='border border-black flex gap-[13.7px] items-center p-4 '>
                                    <p className='jost-font text-[13.7px] font-bold'>Read More</p>
                                    <img src={Arrow} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' w-full px-0 lg:px-0 shadow-lg pb-8 md:pb-[96px]'>
                    <img src={BlogIII} alt="" className=' object-cover w-full h-[446.13px}' />
                    <div>
                        <div className=' flex items-center mt-8 mx-3 md:mx-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='mx-3 md:mx-8'>
                            <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                                <p className=' font-bold'>Wade Warren</p>
                                <p className=' font-normal'>Fashion Designer</p>
                            </div>
                            <div className='mt-[47.95px]'>
                                <h2 className='jost-font text-[#212121] text-[26.55px] font-bold '>How important are clothes in your style?</h2>
                                <p className=' lato-regular text-[13.7px] text-[#424242] mt-[27.4px]'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            </div>
                            <div className='mt-[47.93px]'>
                                <button className='border border-black flex gap-[13.7px] items-center p-4 '>
                                    <p className='jost-font text-[13.7px] font-bold'>Read More</p>
                                    <img src={Arrow} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BlogCard