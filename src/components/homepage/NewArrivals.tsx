import React from 'react';
import { MenUnderwear, WomenUnderwear, Underwear } from '../../assets/images';
import { ArrivalsView } from '../ui/button';

const products = [
    { id: 1, image: MenUnderwear, title: 'Men Underwears', description: 'Parturient Venenatis Etiam' },
    { id: 2, image: WomenUnderwear, title: 'Women Underwears', description: 'Parturient Venenatis Etiam' },
    { id: 3, image: Underwear, title: 'Unisex Underwears', description: 'Parturient Venenatis Etiam' },
];

const NewArrivals: React.FC = () => (
    <div className='mx-auto mt-[96px]'>
        <h3 className='text-center font-bold text-[33.27px] jost-font'>Checkout BYC New Arrivals</h3>
        <div className="flex justify-center gap-3.5 mt-16">
            {products.map(({ id, image, title, description }) => (
                <div key={id}>
                    <div className="w-[444.03px]">
                        <img src={image} alt={title} />
                    </div>
                    <div className='jost-font'>
                        <h1 className=' font-semibold text-[26px]'>{title}</h1>
                        <p className=' font-normal text-[17.06px]'>{description}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className='flex justify-center mt-16'>
            <ArrivalsView />
        </div>
    </div>
);

export default NewArrivals;
