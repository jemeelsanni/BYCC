import React from "react";
import { Link } from "react-router-dom";
import { FilterCategory } from "../ui/Filter";
import {
    ArrowLeft,
    ArrowRight,
    WhitePant,
    WhiteBoxers,
    BlackPant,
} from "../../assets/images";
import { ArrivalsView } from '../ui/button';


const CategorySection: React.FC = () => {
    return (
        <div className="mt-[96px]">
            <div className="jost-font text-center">
                <h3 className="font-bold text-[39px] capitalize">Shop by Category</h3>
            </div>

            <div className="mt-6">
                <FilterCategory />
            </div>

            <div className="flex flex-row items-center justify-center gap-28 mt-6">
                <button className="swiper-button-prev">
                    <img src={ArrowLeft} alt="previous" />
                </button>

                <div className=" gap-[30px] flex ">

                    <div>
                        <Link to="/" className="block">
                            <div>
                                <img src={BlackPant} alt="White Pant" className="w-full" />
                                <div className="ml-4">
                                    <p className=" manrope-font font-bold text-[16px] text-[#19191D]">WOWEN PANTS <span className=" font-normal">BYC-501LMS</span></p>
                                    <p className=" josefin-sans-font font-bold text-[16px] text-[#19191D]">₦2,800.00</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div>
                        <Link to="/" className="block w-full">
                            <div>
                                <img src={WhiteBoxers} alt="White Pant" className="w-full" />
                                <div className="ml-4">
                                    <p className=" manrope-font font-bold text-[16px] text-[#19191D]">WOWEN PANTS <span className=" font-normal">BYC-501LMS</span></p>
                                    <p className=" josefin-sans-font font-bold text-[16px] text-[#19191D]">₦2,800.00</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div>
                        <Link to="/" className="block">
                            <div >
                                <img src={WhitePant} alt="White Pant" className="w-full" />
                                <div className="ml-4">
                                    <p className=" manrope-font font-bold text-[16px] text-[#19191D]">WOWEN PANTS <span className=" font-normal">BYC-501LMS</span></p>
                                    <p className=" josefin-sans-font font-bold text-[16px] text-[#19191D]">₦2,800.00</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                </div>

                <button className="swiper-button-next">
                    <img src={ArrowRight} alt="next" />
                </button>
            </div>
            <div className='flex justify-center mt-16'>
                <ArrivalsView />
            </div>
        </div>
    );
};

export default CategorySection;
