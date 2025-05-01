import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import { getArticle, createArticle, updateArticle } from '../../api/blog';
import { ArticleInput } from '../../types';
import RichTextEditor from './RichTextEditor';
import LoadingSpinner from '../ui/LoadingSpinner';

const ArticleEditor: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<ArticleInput & { imagePreview?: string }>({
        title: '',
        content: '',
        authorName: '',
        authorTitle: '',
    });

    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (isEditMode && id) {
            const fetchArticle = async () => {
                try {
                    const article = await getArticle(id);
                    setFormData({
                        title: article.title,
                        content: article.content,
                        authorName: article.authorName,
                        authorTitle: article.authorTitle,
                        imagePreview: article.imageUrl
                    });
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load article data');
                    setLoading(false);
                    console.error('Error fetching article:', err);
                }
            };

            fetchArticle();
        }
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.authorName || !formData.authorTitle) {
            setError('All fields are required');
            return;
        }

        if (!isEditMode && !formData.image) {
            setError('Please upload an image for the article');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            if (isEditMode && id) {
                await updateArticle(id, formData);
            } else {
                await createArticle(formData);
            }

            setSubmitting(false);
            navigate('/admin/blog');
        } catch (err: unknown) {
            setSubmitting(false);

            if (typeof err === 'object' && err !== null && 'response' in err) {
                const errorResponse = err as { response: { data?: { message?: string } } };
                setError(errorResponse.response.data?.message || 'Failed to save article');
            } else {
                setError('Failed to save article');
            }

            console.error('Error saving article:', err);
        }

    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {isEditMode ? 'Edit Article' : 'Create New Article'}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="Article Title"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Content
                        </label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="authorName">
                                Author Name
                            </label>
                            <input
                                type="text"
                                id="authorName"
                                name="authorName"
                                value={formData.authorName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Author Name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="authorTitle">
                                Author Title
                            </label>
                            <input
                                type="text"
                                id="authorTitle"
                                name="authorTitle"
                                value={formData.authorTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="e.g. Fashion Designer"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                            {isEditMode ? 'Featured Image (upload to change)' : 'Featured Image'}
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            accept="image/*"
                        />
                        {formData.imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                                <img
                                    src={formData.imagePreview}
                                    alt="Preview"
                                    className="h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/blog')}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            disabled={submitting}
                        >
                            {submitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Article' : 'Publish Article')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleEditor;