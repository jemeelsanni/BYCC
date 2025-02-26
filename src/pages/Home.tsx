import React from 'react';
import { Navbar, Footer } from '../components/layout';
import { HeroSection, NewArrivals, CollectionSection, CategorySection, BlogSection } from '../components/homepage';

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <NewArrivals />
            <CollectionSection />
            <CategorySection />
            <BlogSection />
            <Footer />
        </div>
    )
}

export default Home