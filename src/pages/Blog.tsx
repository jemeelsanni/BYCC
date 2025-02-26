import { BlogPage } from "../components/blog";
import { Navbar, Footer } from "../components/layout";
import React from "react";


const Blog: React.FC = () => {
    return (
        <div>
            <Navbar />
            <BlogPage />
            <Footer />
        </div>
    )
}

export default Blog

