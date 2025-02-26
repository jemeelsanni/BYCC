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
        <div className="mt-24 mx-72">
            {/* About Section */}
            <div className="text-center">
                <h3 className="font-bold jost-font text-[48px] capitalize">About Us</h3>
            </div>
            <div className="flex justify-center items-center gap-12 mt-20">
                <div className="w-[670px]">
                    <img src={AboutHero} alt="" />
                </div>
                <div className="w-[670px] manrope-font">
                    <h4 className="text-[#212121] text-[36px] font-bold">ABOUT BYC AFRICA</h4>
                    <p className="text-[#212121] text-[32px] font-normal mt-6">
                        We are the sole distributor of BYC products in Africa. We import BYC products from Korea and distribute them to African countries through Onamik Holdings Limited.
                    </p>
                </div>
            </div>

            {/* Records Section */}
            <div className="text-center mt-24">
                <h3 className="font-bold jost-font text-[48px] uppercase">What Our Record Says</h3>
            </div>
            <div className="flex items-center justify-center mt-24">
                <div className="grid grid-cols-3 gap-[30px]">
                    {about.map((item, index) => (
                        <div key={index} className="w-[430px] bg-[#BD3A3A0A] shadow-lg manrope-font pl-6 py-[60px]">
                            <div className="w-[305px]">
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
