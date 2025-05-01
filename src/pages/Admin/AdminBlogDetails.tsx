import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticle, deleteArticle, recordArticleView } from '../../api/blog';
import { Article } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import AdminLayout from '../../components/layout/AdminLayout';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    Eye,
    ThumbsUp,
    Trash2,
    User,
    Share2
} from 'lucide-react';

const AdminBlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);

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
            navigate('/admin/blog');
        } catch (err) {
            setError('Failed to delete article');
            setDeleteLoading(false);
            console.error('Error deleting article:', err);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const shareArticle = () => {
        // Create the public URL for the article
        const publicUrl = `${window.location.origin}/blog/${id}`;

        // Copy to clipboard
        navigator.clipboard.writeText(publicUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="max-w-4xl mx-auto my-8 px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Error Loading Article</h3>
                        <p>{error}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => navigate('/admin/blog')}
                        >
                            Return to Blog List
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!article) {
        return (
            <AdminLayout>
                <div className="max-w-4xl mx-auto my-8 px-4">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Article Not Found</h3>
                        <p>The article you're looking for could not be found.</p>
                        <Link
                            to="/admin/blog"
                            className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                        >
                            Return to Blog List
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Breadcrumb & Actions */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/admin/blog')}
                            className="p-1 rounded-full hover:bg-gray-100 mr-2"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center">
                                <Link to="/admin/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="font-medium text-gray-800">Article Details</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to={`/blog/edit/${article._id}`}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                        >
                            <Edit size={18} />
                            <span>Edit</span>
                        </Link>
                        <Link
                            to={`/blog/${article._id}`}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Eye size={18} />
                            <span>View Live</span>
                        </Link>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2"
                        >
                            <Trash2 size={18} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {/* Article Header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                    {/* Featured Image */}
                    <div className="h-64 md:h-80 w-full relative">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{article.title}</h1>

                            <div className="flex items-center text-sm">
                                <div className="flex items-center mr-4">
                                    <User size={16} className="mr-1" />
                                    <span>{article.authorName}</span>
                                    {article.authorTitle && (
                                        <span className="opacity-80 ml-1">({article.authorTitle})</span>
                                    )}
                                </div>
                                <div className="flex items-center mr-4">
                                    <Calendar size={16} className="mr-1" />
                                    <span>{formatDate(article.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center text-gray-600">
                                <Eye size={18} className="mr-2" />
                                <span>{article.views || 0} views</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <ThumbsUp size={18} className="mr-2" />
                                <span>{article.likes || 0} likes</span>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={shareArticle}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <Share2 size={18} className="mr-2" />
                                <span>{isCopied ? 'Link Copied!' : 'Share Article'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 md:p-8">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Updated Info */}
                        <div className="flex items-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
                            <Clock size={16} className="mr-2" />
                            <span>Last updated on {formatDate(article.updatedAt)} at {formatTime(article.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Article Analytics */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Article Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-blue-700">Total Views</h3>
                                    <p className="text-2xl font-bold text-blue-900">{article.views || 0}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Eye size={20} className="text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-green-700">Total Likes</h3>
                                    <p className="text-2xl font-bold text-green-900">{article.likes || 0}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <ThumbsUp size={20} className="text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-purple-700">Engagement Rate</h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {article.views ? Math.round((article.likes || 0) / article.views * 100) : 0}%
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Link
                        to="/admin/blog"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-center"
                    >
                        Back to Blog List
                    </Link>
                    <Link
                        to={`/blog/edit/${article._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-center"
                    >
                        Edit Article
                    </Link>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete Article"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-6 text-red-500">
                            <Trash2 size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-center mb-2">Are you sure?</h3>
                        <p className="text-gray-500 text-center mb-6">
                            You are about to delete "{article.title}". This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center"
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
                                ) : 'Delete Article'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
};

export default AdminBlogDetail;