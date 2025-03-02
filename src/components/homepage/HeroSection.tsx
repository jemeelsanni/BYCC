import React, { useState, useEffect } from "react";
import { HeroButton } from "../ui/Button";
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
        <div className=" justify-self-center mx-8 md:mx-0 text-center mt-4 md:mt-[96px]">
            <div className="jost-font mb-6 md:mb-12">
                <p className=" text-xl md:text-2xl">Your body deserves comfort</p>
                <h3 className=" font-bold text-3xl md:text-5xl mt-2 md:mt-5">
                    Get the best for {words[index]}
                </h3>
            </div>
            <HeroButton />
            <div className="mt-10 md:mt-16">
                <img src={Head} alt="" />
            </div>

        </div>
    );
};

export default HeroSection;
