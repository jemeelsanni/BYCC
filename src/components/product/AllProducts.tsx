import React, { useState } from "react";
import { Star } from "../../assets/images";
import { product } from "../../data/ProductData";
import SortDropdown from "../ui/SortDropdown";
import ViewToggle from "../ui/Toggle";
import { Scart, Like } from "../../assets/icons";
import { Pagination } from "../ui/Pagination";
import RecentlyViewed from "./RecentlyViewed";
import { Link } from "react-router-dom";

const AllProducts: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="mt-8 md:mt-24 mx-4 md:mx-24">
            <div className=" border-[#F1EEEE] border shadow-lg rounded-lg p-5 md:p-8 ">
                <div className="flex justify-between items-center mb-4">
                    <p className="manrope-font font-bold text-[20px]">All Products</p>
                    <div>
                        <SortDropdown />
                    </div>
                </div>
                <div className=" border-[#F1EEEE] border-b-2"></div>
                <div className=" my-4 relative">
                    <div className="absolute right-0 ">
                        <ViewToggle />
                    </div>
                </div>
                <div className=" border-[#F1EEEE] border-b-2 mt-18"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mt-8 gap-6">
                    {product.map((product, index) => (
                        <Link to="/product/1ab2" key={index} className="w-full rounded-md shadow-xl relative hover:bg-gray-100 transition duration-300 p-4"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}>

                            <img src={product.image} alt="" className="w-full object-cover rounded-t-md " />
                            <div className="mx-2 mt-4">
                                <div className="jost-font">
                                    <p className="uppercase font-bold text-[16px]">{product.productName}</p>
                                    <p className="font-light text-[16px]"> {product.productCode}</p>
                                </div>
                                <div>
                                    <p className="inter-font text-[12px] font-normal text-[#787885] mt-4">{product.productDescription}</p>
                                    <p className="manrope-font font-semibold text-[14px] mt-3">{product.productPrice}</p>
                                </div>
                                <div>
                                    <img src={Star} alt="" />
                                </div>
                                {hoveredIndex === index && (
                                    <div className="flex gap-3 manrope-font mt-4 mb-8  bg-white p-2 rounded-md shadow-md">
                                        <Link to="/product">
                                            <button className="flex items-center border-2 border-[#BD3A3A] rounded-md gap-3 p-2 cursor-pointer">
                                                <img src={Like} alt="" className=" h-[18px] w-[18px]" />
                                                <p className="text-[#BD3A3A] font-semibold text-[16px]">Wishlist</p>
                                            </button>
                                        </Link>
                                        <Link to="/product">
                                            <button className="flex bg-[#BD3A3A] items-center rounded-md gap-3 p-2 cursor-pointer">
                                                <img src={Scart} alt="" className=" h-[18px] w-[18px]" />
                                                <p className="text-[#FFF] font-semibold text-[16px]">Buy Now</p>
                                            </button>
                                        </Link>

                                    </div>
                                )}

                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center mt-10 md:mt-32 mb-8 md:mb-24">
                    <Pagination />
                </div>
            </div>
            <div><RecentlyViewed /></div>
        </div>
    );
};

export default AllProducts;
