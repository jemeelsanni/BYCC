import React from 'react'
import { About } from '../components/about';
import Breadcrumb from '../components/ui/BreadCrumb';
import { Navbar, Footer } from '../components/layout';

const AboutPage: React.FC = () => {
    return (
        <div className=''>
            <Navbar />
            <Breadcrumb />
            <About />
            <Footer />
        </div>
    )
}

export default AboutPage;