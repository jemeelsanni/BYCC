import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/users';
import { User } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminUserDetail: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const userData = await getUserById(userId);
                setUser(userData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to load user details. Please try again later.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    // Format date
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';

        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (error || !user) {
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
                    {/* Header & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <h1 className="text-2xl lg:text-3xl font-bold">User Details</h1>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate(`/admin/users/${userId}/edit`)}
                                className="px-4 py-2 bg-[#BD3A3A] text-white rounded hover:bg-[#A52F2F]"
                            >
                                Edit User
                            </button>
                            {!user.isAdmin && (
                                <button
                                    onClick={() => navigate(`/admin/users/${userId}/orders`)}
                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                >
                                    View Orders
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Profile Card */}
                    <div className="bg-white overflow-hidden border border-gray-200 rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center">
                                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">
                                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                                    {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                                </div>
                                <div className="ml-6">
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.isAdmin ? 'Administrator' : 'Regular User'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-5">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">First Name</p>
                                    <p className="mt-1 text-sm text-gray-900">{user.firstName || 'Not provided'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                                    <p className="mt-1 text-sm text-gray-900">{user.lastName || 'Not provided'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                    <p className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                                    <p className="mt-1 text-sm text-gray-900">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
                                </div>

                                {user.company && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Company</p>
                                        <p className="mt-1 text-sm text-gray-900">{user.company}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address Information */}
                        {(user.country || user.city || user.state) && (
                            <div className="px-6 py-5 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.country && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Country</p>
                                            <p className="mt-1 text-sm text-gray-900">{user.country}</p>
                                        </div>
                                    )}

                                    {user.city && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">City</p>
                                            <p className="mt-1 text-sm text-gray-900">{user.city}</p>
                                        </div>
                                    )}

                                    {user.state && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">State/Province</p>
                                            <p className="mt-1 text-sm text-gray-900">{user.state}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Account Status */}
                        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Current status of the user's account
                                    </p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                        >
                            Back to Users
                        </button>
                        <button
                            onClick={() => navigate(`/admin/users/${userId}/edit`)}
                            className="px-4 py-2 bg-[#BD3A3A] text-white rounded hover:bg-[#A52F2F]"
                        >
                            Edit User
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserDetail;