import React from 'react';
import { ExploreCollectionButton, ArrivalsView } from '../ui/Buttons';
import { MenCollection, WomenCollection, BabyCollection } from '../../assets/images';

const CollectionSection: React.FC = () => {
    return (
        <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* First row - Text and Baby Collection */}
                    <div className="bg-[#F1F1F1] p-8 md:p-10 lg:p-12 flex items-center">
                        <div className="jost-font max-w-lg">
                            <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-[#616161]">
                                BYC Collection 2021
                            </h3>
                            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl mt-2">
                                BYC Collection
                            </h2>
                            <p className="lato-regular text-sm md:text-base text-[#424242] mt-4">
                                The best everyday option in a Super Saver range within a
                                reasonable price. It is our responsibility to keep you
                                100 percent stylish. Be smart & trendy with us.
                            </p>
                            <div className="mt-6 md:mt-8 lg:mt-10">
                                <ExploreCollectionButton />
                            </div>
                        </div>
                    </div>

                    <div className="aspect-square md:aspect-auto">
                        <img
                            src={BabyCollection}
                            alt="Baby Collection"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Second row - Women Collection and Men Collection */}
                    <div className="aspect-square md:aspect-auto">
                        <img
                            src={WomenCollection}
                            alt="Women Collection"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="aspect-square md:aspect-auto">
                        <img
                            src={MenCollection}
                            alt="Men Collection"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-8 md:mt-12 lg:mt-16">
                    <ArrivalsView />
                </div>
            </div>
        </section>
    );
};

export default CollectionSection;