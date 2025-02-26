import React from 'react'
import { ContactUs } from '../components/contact'
import { Navbar, Footer } from '../components/layout'
import Breadcrumb from '../components/ui/BreadCrumb'

const Contact: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <ContactUs />
            <Footer />
        </div>
    )
}

export default Contact