import React from 'react';
import { Navbar, Footer } from '../components/layout';
import Breadcrumb from '../components/ui/BreadCrumb';
import { Cart as CartComponent } from '../components/cart/index';

const Cart: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <CartComponent />
            <Footer />
        </div>
    )
}

export default Cart;