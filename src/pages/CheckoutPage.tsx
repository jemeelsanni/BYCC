import React from 'react';
import { Navbar, Footer } from '../components/layout';
import Breadcrumb from '../components/ui/BreadCrumb';
import { Checkout } from '../components/checkout';

const CheckoutPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <Checkout />
            <Footer />
        </div>
    )
}

export default CheckoutPage