import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../../api/blog';
import { Article } from '../../types';
import { Arrow } from "../../assets/images";
import { User2 } from "../../assets/icons";
import Pagination from '../ui/Pagination';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Footer, Navbar } from '../layout';

const BlogList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await getArticles(currentPage);
                setArticles(response.articles);
                setTotalPages(response.totalPages);
                setLoading(false);
            } catch (err) {
                setError('Failed to load articles');
                setLoading(false);
                console.error('Error fetching articles:', err);
            }
        };

        fetchArticles();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
                    <p className="text-lg font-medium mb-4">{error}</p>
                    <button
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="text-center py-12 max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">No Articles Found</h2>
                        <p className="text-gray-600 mb-6">Be the first to share your thoughts with the BYC community.</p>
                        <Link
                            to="/blog/create"
                            className="inline-block px-6 py-3 bg-[#BD3A3A] text-white font-medium rounded-lg hover:bg-[#a93434] transition-colors"
                        >
                            Create Your First Article
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="py-12 md:py-16 lg:py-24">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 md:mb-16 lg:mb-20 text-center">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold jost-font">
                            BYC AFRICA Blog News
                        </h1>
                    </div>

                    {/* Articles Grid */}
                    <div className="space-y-12 md:space-y-16 lg:space-y-20">
                        {articles.map((article, index) => (
                            <article
                                key={article._id}
                                className={`bg-white  shadow-md overflow-hidden`}
                            >
                                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0 lg:gap-8`}>
                                    {/* Article Image */}
                                    <div className="w-full lg:w-1/2">
                                        <Link to={`/blog/${article._id}`} className="block h-64 md:h-80 lg:h-96">
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                    </div>

                                    {/* Article Content */}
                                    <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                                        <div>
                                            <Link to={`/blog/${article._id}`} className="block mb-4">
                                                <h2 className="text-xl md:text-2xl font-bold hover:text-[#BD3A3A] transition-colors lato-bold line-clamp-2">
                                                    {article.title}
                                                </h2>
                                            </Link>

                                            <p className="text-gray-700 mb-6 lato-regular line-clamp-4 md:line-clamp-6">
                                                {article.content.replace(/<[^>]*>/g, '').substring(0, 400)}...
                                            </p>
                                        </div>

                                        <div className="mt-auto">
                                            {/* Read More Button */}
                                            <div className="flex justify-between items-center mb-6">
                                                <Link
                                                    to={`/blog/${article._id}`}
                                                    className="inline-flex items-center border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                                                >
                                                    <span className='jost-font text-sm font-bold mr-2'>Read More</span>
                                                    <img src={Arrow} alt="Arrow" className='h-4 w-4' />
                                                </Link>
                                            </div>

                                            {/* Author Info & Stats */}
                                            <div className="flex items-center gap-4 pt-4 ">
                                                <div className='bg-gray-200 w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
                                                    <img src={User2} alt={article.authorName} className='w-full h-full object-cover' />
                                                </div>

                                                <div className='flex flex-col'>
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <span className="font-bold jost-font">{article.authorName}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="font-normal jost-font">{article.authorTitle}</span>
                                                    </div>

                                                    <div className='flex gap-4 mt-1'>
                                                        {/* View count */}
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>{article.views}</span>
                                                        </div>

                                                        {/* Like count */}
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                            <span>{article.likes}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 md:mt-16">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BlogList;