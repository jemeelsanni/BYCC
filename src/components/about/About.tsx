import React from 'react';
import { AboutHero, Award } from '../../assets/images';
import { RecentlyViewed } from '../product';

const About: React.FC = () => {
    const awards = [
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
        <main className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* About Header */}
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="font-bold jost-font text-2xl md:text-3xl lg:text-4xl capitalize">
                        About Us
                    </h1>
                </header>

                {/* About Company Section */}
                <section className="mb-16 md:mb-20 lg:mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                        {/* Company Image */}
                        <div className="overflow-hidden shadow-md">
                            <img
                                src={AboutHero}
                                alt="BYC Africa Headquarters"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Company Description */}
                        <div className="manrope-font">
                            <h2 className="text-[#212121] text-2xl md:text-3xl font-bold mb-4">
                                ABOUT BYC AFRICA
                            </h2>
                            <p className="text-[#212121] text-lg md:text-xl lg:text-2xl font-normal">
                                We are the sole distributor of BYC products in Africa. We import BYC products from Korea and distribute them to African countries through Onamik Holdings Limited.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Awards Section */}
                <section>
                    <header className="text-center mb-10 md:mb-16">
                        <h2 className="font-bold jost-font text-2xl md:text-3xl lg:text-4xl uppercase">
                            What Our Record Says
                        </h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {awards.map((award, index) => (
                            <div
                                key={index}
                                className="bg-[#BD3A3A0A] shadow-md p-6 md:p-8 transition-transform hover:translate-y-[-5px]"
                            >
                                <img
                                    src={award.image}
                                    alt={`Award from year ${award.year}`}
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain mb-6"
                                />
                                <div className="manrope-font">
                                    <p className="text-[#383737] font-normal text-base mb-4">
                                        {award.description}
                                    </p>
                                    <p className="text-[#D7000F] text-xl md:text-2xl font-bold">
                                        Year {award.year}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recently Viewed Section */}
                <section className="mt-16 md:mt-20 lg:mt-24">
                    <RecentlyViewed />
                </section>
            </div>
        </main>
    );
};

export default About;