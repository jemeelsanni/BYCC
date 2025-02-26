import React from 'react'
import { Map, ContactForm } from './index';
import { ContactAddress, ContactPhone, ContactMail } from '../../assets/images';
import { RecentlyViewed } from '../product';

const ContactUs: React.FC = () => {
    return (
        <div className='mx-24'>
            <div className="text-center">
                <h3 className="font-bold jost-font text-[48px] capitalize">Contact Us</h3>
            </div>
            <div>
                <Map />
                <div className='flex justify-between items-center p-12 mt-20'>
                    <div className='flex gap-6 items-center'>
                        <div>
                            <img src={ContactAddress} alt="" />
                        </div>
                        <div className='manrope-font '>
                            <h3 className='font-bold text-[26px] uppercase'>address</h3>
                            <p className=' font-normal text-[18px]'>(Head Office)</p>
                            <p className=' font-normal text-[18px]'>175 Cameroun Road Aba, Abia State.</p>
                        </div>
                    </div>
                    <div className='flex gap-6 items-center'>
                        <div>
                            <img src={ContactPhone} alt="" />
                        </div>
                        <div className='manrope-font '>
                            <h3 className='font-bold text-[26px] uppercase'>phone</h3>
                            <p className=' font-normal text-[18px]'>08101375376 09053403403</p>
                        </div>
                    </div>
                    <div className='flex gap-6 items-center'>
                        <div>
                            <img src={ContactMail} alt="" />
                        </div>
                        <div className='manrope-font '>
                            <h3 className='font-bold text-[26px] uppercase'>email address</h3>
                            <p className=' font-normal text-[18px]'>BYCAFRICA@gmail.com</p>
                        </div>
                    </div>
                </div>
                <ContactForm />
                <RecentlyViewed />
            </div>
        </div>
    )
}

export default ContactUs