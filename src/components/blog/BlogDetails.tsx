import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticle, deleteArticle, recordArticleView } from '../../api/blog';
import { Article } from '../../types';
import LikeButton from './LikeButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import { Footer, Navbar } from '../layout';

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);



    // You might get the userId from your auth context or state management
    // For this example, we'll use a mock user ID
    const userId = 'user123'; // Replace with actual user ID from your auth system

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const articleData = await getArticle(id);
                setArticle(articleData);

                // Record a view
                await recordArticleView(id);

                setLoading(false);
            } catch (err) {
                setError('Failed to load article');
                setLoading(false);
                console.error('Error fetching article:', err);
            }
        };

        fetchArticle();

        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        try {
            setDeleteLoading(true);
            await deleteArticle(id);
            setDeleteLoading(false);
            setShowDeleteModal(false);
            navigate('/blog');
        } catch (err) {
            setError('Failed to delete article');
            setDeleteLoading(false);
            console.error('Error deleting article:', err);
        }
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
                        onClick={() => navigate('/blog')}
                    >
                        Return to Blog
                    </button>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="text-center py-12 max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Article Not Found</h2>
                        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
                        <Link
                            to="/blog"
                            className="inline-block px-6 py-3 bg-[#BD3A3A] text-white font-medium rounded-lg hover:bg-[#a93434] transition-colors"
                        >
                            Return to Blog
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
                    <article className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-8">
                            <Link
                                to="/blog"
                                className="inline-flex items-center text-gray-600 hover:text-[#BD3A3A] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Blog
                            </Link>
                        </div>

                        {/* Article Header */}
                        <header className="mb-10">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 lato-bold">
                                {article.title}
                            </h1>

                            {/* Article Meta */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-gray-600 border-b border-gray-200 pb-6">
                                <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                                    <span className="font-medium">{article.authorName}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{article.authorTitle}</span>
                                    <span className="hidden md:inline">•</span>
                                    <time dateTime={article.createdAt}>
                                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>{article.views} views</span>
                                    </div>
                                    <LikeButton
                                        articleId={article._id}
                                        initialLikes={article.likes}
                                        userId={userId}
                                    />
                                </div>
                            </div>
                        </header>

                        {/* Article Featured Image */}


                        {/* Article Content */}
                        <div
                            className="prose prose-lg max-w-none mb-12 lato-regular"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Article Footer */}
                        <footer className="mt-12 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date(article.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <LikeButton
                                    articleId={article._id}
                                    initialLikes={article.likes}
                                    userId={userId}
                                />
                            </div>
                        </footer>


                    </article>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete Article"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div className="p-6">
                        <p className="mb-6">
                            Are you sure you want to delete this article? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            <Footer />
        </>
    );
};

export default BlogDetail;