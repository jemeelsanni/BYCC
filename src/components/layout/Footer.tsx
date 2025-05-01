import React from 'react';
import { Link } from 'react-router-dom';
import { MasterCard, PayPal, Visa } from '../../assets/images';
import { Arrow, Mail, Phone, Facebook, Instagram, Twitter, YouTube } from '../../assets/icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#212121] text-white mt-12 md:mt-16 lg:mt-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-10 md:pt-12 lg:pt-16 pb-8">
                {/* Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* Company Info */}
                    <div className="jost-font">
                        <h3 className="font-bold text-base md:text-lg capitalize mb-4">Company Info</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-sm hover:text-gray-300 transition-colors capitalize">About Us</Link></li>
                            <li><Link to="/affiliate" className="text-sm hover:text-gray-300 transition-colors capitalize">Affiliate</Link></li>
                            <li><Link to="/blog" className="text-sm hover:text-gray-300 transition-colors capitalize">Fashion Blogger</Link></li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div className="jost-font">
                        <h3 className="font-bold text-base md:text-lg capitalize mb-4">Help & Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/shipping" className="text-sm hover:text-gray-300 transition-colors">Shipping Info</Link></li>
                            <li><Link to="/refunds" className="text-sm hover:text-gray-300 transition-colors">Refunds</Link></li>
                            <li><Link to="/how-to-order" className="text-sm hover:text-gray-300 transition-colors">How to Order</Link></li>
                            <li><Link to="/tracking" className="text-sm hover:text-gray-300 transition-colors">How to Track</Link></li>
                            <li><Link to="/size-guides" className="text-sm hover:text-gray-300 transition-colors">Size Guides</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="jost-font">
                        <h3 className="font-bold text-base md:text-lg capitalize mb-4">Customer Service</h3>
                        <ul className="space-y-3 mb-4">
                            <li><Link to="/contact" className="text-sm hover:text-gray-300 transition-colors capitalize">Contact Us</Link></li>
                            <li><Link to="/payment" className="text-sm hover:text-gray-300 transition-colors capitalize">Payment Methods</Link></li>
                        </ul>

                        {/* Payment Methods */}
                        <div className="flex items-center space-x-4 mt-2">
                            <img src={PayPal} alt="PayPal" className="h-5 w-auto" />
                            <img src={Visa} alt="Visa" className="h-5 w-auto" />
                            <img src={MasterCard} alt="MasterCard" className="h-5 w-auto" />
                        </div>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="jost-font">
                        <h3 className="font-bold text-base md:text-lg capitalize mb-4">Signup for the latest news</h3>

                        {/* Newsletter Form */}
                        <form className="flex items-center mb-6 border border-white overflow-hidden group focus-within:border-gray-300 transition-colors">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="bg-transparent text-white py-2 px-3 outline-none flex-grow text-sm w-full"
                                aria-label="Email address for newsletter"
                            />
                            <button
                                type="submit"
                                className="bg-transparent p-2 text-white hover:bg-white hover:text-[#212121] transition-colors"
                                aria-label="Subscribe to newsletter"
                            >
                                <img src={Arrow} alt="Subscribe" className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href="mailto:bycafrica@gmail.com" className="flex items-center text-sm hover:text-gray-300 transition-colors">
                                <img src={Mail} alt="Email" className="mr-2 w-4 h-4" />
                                <span>bycafrica@gmail.com</span>
                            </a>
                            <a href="tel:+2348101375376" className="flex items-center text-sm hover:text-gray-300 transition-colors">
                                <img src={Phone} alt="Phone" className="mr-2 w-4 h-4" />
                                <span>+2348101375376; +2349053403403</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center space-x-6 mt-10 md:mt-12">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                        <img src={Facebook} alt="Facebook" className="w-6 h-6" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                        <img src={Instagram} alt="Instagram" className="w-6 h-6" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
                        <img src={Twitter} alt="Twitter" className="w-6 h-6" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
                        <img src={YouTube} alt="YouTube" className="w-6 h-6" />
                    </a>
                </div>

                {/* Divider */}
                <div className="h-px bg-white my-6 md:my-8 opacity-50"></div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="jost-font text-sm">All rights Reserved © copyright bycafrica 2021.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;