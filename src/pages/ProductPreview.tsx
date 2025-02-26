import React from 'react';
import { Navbar, Footer } from '../components/layout';
import Breadcrumb from '../components/ui/BreadCrumb';
import { ProductPreview as CartProductPreview } from '../components/product';

const ProductPreview: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <CartProductPreview />
            <Footer />
        </div>
    )
}

export default ProductPreview;