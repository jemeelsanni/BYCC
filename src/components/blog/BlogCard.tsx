import React from 'react';
import { BlogI, BlogII, BlogIII, AuthorViews, Arrow } from "../../assets/images";

const BlogCard: React.FC = () => {
    return (
        <div>
            <div className='flex justify-center items-center gap-3 mt-[92px]'>
                <div className=' w-[446.13px] shadow-lg pb-[96px]'>
                    <img src={BlogI} alt="" className=' object-cover' />
                    <div>
                        <div className=' flex items-center justify-center mt-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='mx-14'>
                            <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                                <p className=' font-bold'>Wade Warren</p>
                                <p className=' font-normal'>Fashion Designer</p>
                            </div>
                            <div>
                                <h2 className='jost-font text-[#212121] text-[26.55px] font-bold mt-12'>How important are clothes in your style?</h2>
                                <p className=' lato-regular text-[13.7px] text-[#424242] mt-8'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            </div>
                            <div>
                                <button className='border border-black flex gap-[13.7px] items-center p-4 mt-12'>
                                    <p className='jost-font text-[13.7px] font-bold'>Read More</p>
                                    <img src={Arrow} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' w-[446.13px] shadow-lg pb-[96px]'>
                    <img src={BlogII} alt="" />
                    <div>
                        <div className=' flex items-center justify-center mt-8'>
                            <img src={AuthorViews} alt="" className=' object-cover' />
                        </div>
                        <div className='mx-14'>
                            <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                                <p className=' font-bold'>Wade Warren</p>
                                <p className=' font-normal'>Fashion Designer</p>
                            </div>
                            <div>
                                <h2 className='jost-font text-[#212121] text-[26.55px] font-bold mt-12'>How important are clothes in your style?</h2>
                                <p className=' lato-regular text-[13.7px] text-[#424242] mt-8'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            </div>
                            <div>
                                <button className='border border-black flex gap-[13.7px] items-center p-4 mt-12'>
                                    <p className='jost-font text-[13.7px] font-bold'>Read More</p>
                                    <img src={Arrow} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' w-[446.13px] shadow-lg pb-[96px]'>
                    <img src={BlogIII} alt="" className=' object-cover' />
                    <div>
                        <div className=' flex items-center justify-center mt-8'>
                            <img src={AuthorViews} alt="" />
                        </div>
                        <div className='mx-14'>
                            <div className='jost-font flex gap-6 mt-4 text-[13.7px] text-[#424242]'>
                                <p className=' font-bold'>Wade Warren</p>
                                <p className=' font-normal'>Fashion Designer</p>
                            </div>
                            <div>
                                <h2 className='jost-font text-[#212121] text-[26.55px] font-bold mt-12'>How important are clothes in your style?</h2>
                                <p className=' lato-regular text-[13.7px] text-[#424242] mt-8'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            </div>
                            <div>
                                <button className='border border-black flex gap-[13.7px] items-center p-4 mt-12'>
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