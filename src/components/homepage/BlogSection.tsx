import React from 'react'
import { BlogCard } from '../blog';
import { ArrivalsView } from '../ui/Button';

const BlogSection: React.FC = () => {
    return (
        <div className="mt-16 md:mt-[96px] mx-8 md:mx-0">
            <div className="text-center">
                <h3 className="font-bold jost-font text-[28px] md:text-[39px] capitalize">BYC AFRICA Blog News</h3>
            </div>
            <div>
                <BlogCard />
            </div>
            <div className='flex justify-center mt-16'>
                <ArrivalsView />
            </div>
        </div>
    )
}

export default BlogSection