import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../../api/blog';
import { Article } from '../../types';
import { Arrow } from "../../assets/images";
import { User2 } from '../../assets/icons';

const BlogCard: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await getArticles(1, 3);
                setArticles(response.articles);
                setLoading(false);
            } catch (err) {
                setError('Failed to load articles');
                setLoading(false);
                console.error('Error fetching articles:', err);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 md:py-16">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 md:py-16 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-12 md:py-16">
                <p>No articles found. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {articles.map((article) => (
                    <div key={article._id} className="flex flex-col bg-white shadow-lg overflow-hidden">
                        {/* Article Image */}
                        <div className="aspect-video">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Author Info */}
                        <div className="p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-4 bg-[#FCFCFC]">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 overflow-hidden">
                                    <img src={User2} alt="" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex gap-4">
                                    {/* View count */}
                                    <div className="flex items-center jost-font text-sm md:text-base text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>{article.views}</span>
                                    </div>

                                    {/* Like count */}
                                    <div className="flex items-center jost-font text-sm md:text-base text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span>{article.likes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Author Details */}
                            <div className="jost-font flex gap-4 text-xs md:text-sm text-[#424242]">
                                <p className="font-bold">{article.authorName}</p>
                                <p className="font-normal">{article.authorTitle}</p>
                            </div>

                            {/* Article Content */}
                            <div className="mt-4 md:mt-6">
                                <h3 className="jost-font text-xl md:text-2xl font-bold text-[#212121]">
                                    {article.title}
                                </h3>
                                <div className="mt-2 md:mt-4 h-16 md:h-20 overflow-hidden">
                                    <p className="lato-regular text-sm md:text-base text-[#424242]">
                                        {article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                    </p>
                                </div>
                            </div>

                            {/* Read More Button */}
                            <div className="mt-4 md:mt-6">
                                <Link to={`/blog/${article._id}`} className="inline-flex items-center border border-black px-4 py-2 transition-colors hover:bg-black hover:text-white">
                                    <span className="jost-font text-sm font-bold mr-2">Read More</span>
                                    <img src={Arrow} alt="Arrow" className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogCard;