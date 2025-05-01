import React, { useState, useEffect } from "react";
import { HeroButton } from "../ui/Buttons";
import { Head } from "../../assets/images";

const HeroSection: React.FC = () => {
    const words = ["Men", "Women", "Kids"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <section className="py-4 md:py-8 lg:py-24">
            <div className="container mx-auto text-center">
                <div className="jost-font mb-6 md:mb-8 lg:mb-12">
                    <p className="text-lg md:text-xl lg:text-2xl">
                        Your body deserves comfort
                    </p>
                    <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-3 lg:mt-5">
                        Get the best for {words[index]}
                    </h1>
                </div>
                <HeroButton />
                <div className="mt-8 md:mt-12 lg:mt-16 max-w-5xl mx-auto">
                    <img src={Head} alt="Hero image" className="w-full h-auto" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;