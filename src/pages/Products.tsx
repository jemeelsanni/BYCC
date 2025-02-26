import React from 'react'
import { Navbar, Footer } from '../components/layout'
import Breadcrumb from '../components/ui/BreadCrumb'
import { AllProducts } from '../components/product'

const Products: React.FC = () => {
    return (
        <>
            <Navbar />
            <Breadcrumb />
            <AllProducts />
            <Footer />
        </>
    )
}

export default Products