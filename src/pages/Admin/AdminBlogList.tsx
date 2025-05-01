import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, deleteArticle } from '../../api/blog';
import { Article } from '../../types';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminLayout from '../../components/layout/AdminLayout';
import { Eye, ThumbsUp, Edit, Trash2, Plus, Calendar, User } from 'lucide-react';
import Modal from '../../components/ui/Modal';

const AdminBlogList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalArticles, setTotalArticles] = useState<number>(0);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await getArticles(currentPage);
                setArticles(response.articles);
                setFilteredArticles(response.articles);
                setTotalPages(response.totalPages);
                setTotalArticles(response.totalArticles || response.articles.length);
                setLoading(false);
            } catch (err) {
                setError('Failed to load articles');
                setLoading(false);
                console.error('Error fetching articles:', err);
            }
        };

        fetchArticles();
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredArticles(articles);
        } else {
            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredArticles(filtered);
        }
    }, [searchTerm, articles]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleDeleteClick = (article: Article) => {
        setSelectedArticle(article);
        setShowDeleteModal(true);
    };

    const handleDeleteArticle = async () => {
        if (!selectedArticle) return;

        try {
            setDeleteLoading(true);
            await deleteArticle(selectedArticle._id);

            // Remove from local state
            setArticles(articles.filter(a => a._id !== selectedArticle._id));
            setFilteredArticles(filteredArticles.filter(a => a._id !== selectedArticle._id));

            setDeleteLoading(false);
            setShowDeleteModal(false);
            setSelectedArticle(null);
        } catch (err) {
            console.error('Error deleting article:', err);
            setError('Failed to delete article');
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        const plainText = text.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
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
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (articles.length === 0) {
        return (
            <AdminLayout>
                <div className="text-center py-16 bg-white rounded-lg shadow-sm mx-4">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12a2 2 0 01-2-2v-3m-9-5a2 2 0 012-2h1m-1 4a2 2 0 102 2v3m0-3h3m-3 0h-3m9 0a2 2 0 01-2-2v-1m2 1a2 2 0 102 2v3m0-3h3m-3 0h-3" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Articles Found</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by creating your first blog article to engage with your audience.</p>
                    <Link
                        to="/blog/create"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#BD3A3A] text-white font-medium rounded hover:bg-[#A52F2F] transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        Create Your First Article
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header and actions */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Blog Articles</h1>
                            <p className="text-gray-600 mt-1">Manage your blog content</p>
                        </div>
                        <Link
                            to="/blog/create"
                            className="mt-4 sm:mt-0 px-5 py-2.5 bg-[#BD3A3A] text-white font-medium rounded hover:bg-[#A52F2F] transition-colors inline-flex items-center"
                        >
                            <Plus size={18} className="mr-2" />
                            Create Article
                        </Link>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-[#BD3A3A] focus:border-[#BD3A3A] block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                                aria-label="Grid view"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                                aria-label="List view"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Articles count */}
                <p className="text-sm text-gray-600 mb-6">
                    Showing {filteredArticles.length} of {totalArticles} articles
                </p>

                {/* Articles in grid view */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {filteredArticles.map((article) => (
                            <div key={article._id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#BD3A3A]">
                                        <Link to={`/admin/blog/${article._id}`}>
                                            {article.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                                        {truncateText(article.content, 150)}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500 mt-auto mb-3">
                                        <User size={16} className="mr-1" />
                                        <span className="font-medium">{article.authorName}</span>
                                        {article.authorTitle && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span>{article.authorTitle}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <Calendar size={16} className="mr-1" />
                                        <span>{formatDate(article.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex space-x-4">
                                            <div className="flex items-center text-gray-500">
                                                <Eye size={16} className="mr-1" />
                                                <span>{article.views || 0}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <ThumbsUp size={16} className="mr-1" />
                                                <span>{article.likes || 0}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/blog/${article._id}/edit`}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(article)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Articles in list view */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-10">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Article
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Author
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Views
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredArticles.map((article) => (
                                    <tr key={article._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                                                    <img src={article.imageUrl} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="ml-4">
                                                    <Link to={`/admin/blog/${article._id}`} className="text-sm font-medium text-gray-900 hover:text-[#BD3A3A]">
                                                        {article.title}
                                                    </Link>
                                                    <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                                        {truncateText(article.content, 60)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <div className="text-sm font-medium text-gray-900">{article.authorName}</div>
                                            <div className="text-sm text-gray-500">{article.authorTitle}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            {formatDate(article.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                            <div className="flex items-center">
                                                <Eye size={16} className="mr-1" />
                                                <span>{article.views || 0}</span>
                                                <ThumbsUp size={16} className="ml-3 mr-1" />
                                                <span>{article.likes || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    to={`/admin/blog/${article._id}`}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/blog/${article._id}/edit`}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(article)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedArticle && (
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
                            You are about to delete "{selectedArticle.title}". This action cannot be undone.
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
                                onClick={handleDeleteArticle}
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

export default AdminBlogList;