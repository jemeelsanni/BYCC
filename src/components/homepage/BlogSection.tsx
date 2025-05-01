import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../blog/BlogCard';

const BlogSection: React.FC = () => {
    return (
        <section className="py-12 md:py-16 lg:py-24">
            <div className="container mx-auto">
                <div className="text-center">
                    <h2 className="font-bold jost-font text-2xl md:text-3xl lg:text-4xl capitalize">
                        BYC AFRICA Blog News
                    </h2>
                </div>

                <div className="mt-6 md:mt-8 lg:mt-10">
                    <BlogCard />
                </div>

                <div className="flex justify-center mt-8 md:mt-12 lg:mt-16">
                    <Link to="/blog" className="jost-font">
                        <button className="px-6 md:px-8 lg:px-10 py-3 md:py-4 border border-black text-sm md:text-base lg:text-lg font-bold bg-white text-black transition-all hover:bg-black hover:text-white">
                            View All
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;