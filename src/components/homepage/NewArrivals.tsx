import React from 'react';
import { MenUnderwear, WomenUnderwear, Underwear } from '../../assets/images';
import { ArrivalsView } from '../ui/Buttons';

const products = [
    { id: 1, image: MenUnderwear, title: 'Men Underwears', description: 'Parturient Venenatis Etiam' },
    { id: 2, image: WomenUnderwear, title: 'Women Underwears', description: 'Parturient Venenatis Etiam' },
    { id: 3, image: Underwear, title: 'Unisex Underwears', description: 'Parturient Venenatis Etiam' },
];

const NewArrivals: React.FC = () => (
    <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto">
            <h2 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl jost-font">
                Checkout BYC New Arrivals
            </h2>

            <div className="mt-6 md:mt-10 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map(({ id, image, title, description }) => (
                    <div key={id} className="flex flex-col items-center">
                        <div className="w-full max-w-md">
                            <img src={image} alt={title} className="w-full h-auto" />
                        </div>
                        <div className="jost-font mt-4 text-center">
                            <h3 className="font-semibold text-xl md:text-2xl lg:text-2xl">{title}</h3>
                            <p className="font-normal text-base md:text-lg mt-2">{description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8 md:mt-12 lg:mt-16">
                <ArrivalsView />
            </div>
        </div>
    </section>
);

export default NewArrivals;