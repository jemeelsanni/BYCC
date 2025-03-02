import React from 'react';
import { AboutHero } from '../../assets/images';
import { Award } from '../../assets/images';
import { RecentlyViewed } from '../product';

const About: React.FC = () => {
    const about = [
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 1990 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 1993 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 1997 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 1997 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 1999 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 2001 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 2006 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 2006 },
        { image: Award, description: "Gold Prize for the Best Listed Firm awarded by Daesin Economy Research Institute.", year: 2011 },
    ];

    return (
        <div className="mt-8 md:mt-24 mx-8 md:mx-24">
            {/* About Section */}
            <div className="text-center">
                <h3 className="font-bold jost-font text-[36px] md:text-[48px] capitalize">About Us</h3>
            </div>
            <div className="flex flex-col md:flex-row items-center w-full gap-[48px] mt-8 md:mt-20">
                <div className="w-full md:w-[50%]">
                    <img src={AboutHero} alt="" />
                </div>
                <div className="w-full md:w-[50%] manrope-font">
                    <h4 className="text-[#212121] text-[32px] md:text-[36px] font-bold">ABOUT BYC AFRICA</h4>
                    <p className="text-[#212121] text-[24px] md:text-[32px] font-normal mt-2 md:mt-6">
                        We are the sole distributor of BYC products in Africa. We import BYC products from Korea and distribute them to African countries through Onamik Holdings Limited.
                    </p>
                </div>
            </div>

            {/* Records Section */}
            <div className="text-center mt-8 md:mt-24">
                <h3 className="font-bold jost-font text-[36px] md:text-[48px] uppercase">What Our Record Says</h3>
            </div>
            <div className="flex items-center  mt-8 lg:mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
                    {about.map((item, index) => (
                        <div key={index} className="w-full bg-[#BD3A3A0A] shadow-lg manrope-font pl-6 py-[60px]">
                            <div className="w-full">
                                <img src={item.image} alt="" />
                                <p className="mt-[27px] text-[#383737] font-normal text-[16px]">{item.description}</p>
                                <p className="mt-[27px] text-[#D7000F] text-[26px] font-bold">Year {item.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recently Viewed Section */}

            <RecentlyViewed />

        </div>
    );
};

export default About;
