import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../../api/users';
import { User } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminUserEdit: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    // Form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        city: '',
        state: '',
        isAdmin: false
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const userData = await getUserById(userId);
                setUser(userData);

                // Initialize form data
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    company: userData.company || '',
                    country: userData.country || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    isAdmin: userData.isAdmin || false
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to load user details. Please try again later.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !userId) return;

        try {
            setSaving(true);
            setError(null);

            // Update user
            await updateUser(userId, formData);

            // Show success message
            setSuccess(true);

            // Reset after a short delay
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

            setSaving(false);
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user. Please try again.');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD3A3A]"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error && !user) {
        return (
            <AdminLayout>
                <div className="mx-4 lg:mx-8">
                    <div className="border-[#F1EEEE] border shadow-lg rounded-lg p-8 text-center py-10">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="mb-6">{error || 'User not found'}</p>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            Back to Users
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mx-4 lg:mx-8 mb-12">
                <div className="bg-white border-[#F1EEEE] border shadow-lg rounded-lg p-4 lg:p-8">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(`/admin/users/${userId}`)}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="text-2xl lg:text-3xl font-bold">Edit User</h1>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            User information updated successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* User Edit Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white overflow-hidden border border-gray-200 rounded-lg mb-6">
                            {/* Basic Information */}
                            <div className="px-6 py-5">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                            required
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="px-6 py-5 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Country */}
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>

                                    {/* State/Province */}
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State/Province
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BD3A3A] focus:border-[#BD3A3A]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* User Role */}
                            <div className="px-6 py-5 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">User Role</h3>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isAdmin"
                                        name="isAdmin"
                                        checked={formData.isAdmin}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-[#BD3A3A] focus:ring-[#BD3A3A] border-gray-300 rounded"
                                    />
                                    <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                                        Administrator
                                    </label>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Administrators have full access to manage products, orders, users, and settings.
                                </p>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/admin/users/${userId}`)}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-[#BD3A3A] text-white rounded hover:bg-[#A52F2F] disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserEdit;