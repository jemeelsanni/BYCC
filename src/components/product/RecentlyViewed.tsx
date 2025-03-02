import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightRed, BYC, Star } from "../../assets/images";


const RecentlyViewed: React.FC = () => {
    const recent = [
        {
            image: BYC,
            productName: "men boxers",
            productCode: "BYC-1163",
            productDescription: "Fashionable Men's Underwear Boxer Cotton Underwear 3 In 1",
            productPrice: "₦1,900.00",
        },
        {
            image: BYC,
            productName: "men boxers",
            productCode: "BYC-1163",
            productDescription: "Fashionable Men's Underwear Boxer Cotton Underwear 3 In 1",
            productPrice: "₦1,900.00",
        },
        {
            image: BYC,
            productName: "men boxers",
            productCode: "BYC-1163",
            productDescription: "Fashionable Men's Underwear Boxer Cotton Underwear 3 In 1",
            productPrice: "₦1,900.00",
        },
        {
            image: BYC,
            productName: "men boxers",
            productCode: "BYC-1163",
            productDescription: "Fashionable Men's Underwear Boxer Cotton Underwear 3 In 1",
            productPrice: "₦1,900.00",
        },
        {
            image: BYC,
            productName: "men boxers",
            productCode: "BYC-1163",
            productDescription: "Fashionable Men's Underwear Boxer Cotton Underwear 3 In 1",
            productPrice: "₦1,900.00",
        },
    ];

    return (
        <div className="mt-8 md:mt-[65px] border-[#F1EEEE] border shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-4">
                <p className="manrope-font font-bold text-[20px]">Recently Viewed</p>
                <Link to="/" className="flex gap-2 items-center text-[#D7000F] hover:underline">
                    <p>See all</p>
                    <img src={ArrowRightRed} alt="Arrow Right" />
                </Link>
            </div>
            <div className=" border-[#F1EEEE] border-b-2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 justify-center gap-10 mt-10">
                {recent.map((item, index) => (
                    <div key={index}>
                        <div className="">
                            <img src={item.image} alt="" className="w-full object-cover" />
                            <div className="mx-2 mt-4">
                                <div className="jost-font">
                                    <p className="uppercase font-bold text-[16px]">{item.productName}</p>
                                    <p className="font-light text-[16px]"> {item.productCode}</p>
                                </div>

                                <p className="inter-font text-[12px] font-normal text-[#787885] mt-4">{item.productDescription}</p>
                                <p className="manrope-font font-semibold text-[14px] mt-3">{item.productPrice}</p>
                            </div>
                            <div>
                                <div>
                                    <img src={Star} alt="" />
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
