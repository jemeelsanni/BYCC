import React from 'react';
import { Navbar, Footer } from '../components/layout';
import RecentlyViewed from '../components/product/RecentlyViewed';
import Wishlist from '../components/product/Wishlist';


const WishlistPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <Wishlist />
            <RecentlyViewed />
            <Footer />
        </>


    );
};

export default WishlistPage;