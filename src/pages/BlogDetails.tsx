import React from 'react'
import { Navbar, Footer } from "../components/layout";
import { BlogDetails } from '../components/blog';
import Breadcrumb from '../components/ui/BreadCrumb';


const BlogDetailsPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <BlogDetails />
            <Footer />
        </div>
    )
}

export default BlogDetailsPage