import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    // If not authenticated or not admin, redirect to login
    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
        }
    }, [user, isAdmin, navigate]);

    // Handle responsive design
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Auto-open sidebar on desktop only on initial load
            if (!mobile && !sidebarOpen && window.innerWidth > 768) {
                setSidebarOpen(true);
            }
        };

        // Set initial state
        handleResize();

        // Listen for window resize
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {/* Mobile backdrop - only visible on mobile when sidebar is open */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar component with mobile-specific props */}
            <DashboardSidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            {/* Main content */}
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen && !isMobile ? 'md:ml-64' : ''
                    }`}
            >
                {/* Top Navigation */}
                <div className="bg-white shadow-sm z-10 sticky top-0">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <button
                                    onClick={toggleSidebar}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#BD3A3A]"
                                    aria-expanded={sidebarOpen}
                                >
                                    <span className="sr-only">
                                        {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                                    </span>
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                                <div className="ml-4">
                                    <h1 className="text-lg font-semibold truncate">Admin Dashboard</h1>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {/* Mobile-friendly user menu */}
                                <div className="ml-4 flex items-center">
                                    <div className="relative">
                                        <button
                                            className="flex items-center max-w-xs text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD3A3A]"
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <div className="p-1 rounded-full bg-gray-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-2 sm:ml-3 px-2 sm:px-3 py-1 border border-transparent text-sm font-medium rounded-md text-[#BD3A3A] hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;