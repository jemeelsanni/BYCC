import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarItem } from '../../types';

interface DashboardSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    isOpen,
    toggleSidebar,
    isMobile
}) => {
    const location = useLocation();
    const { user } = useAuth();

    const sidebarItems: SidebarItem[] = [
        {
            name: 'Dashboard',
            path: '/',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            ),
        },
        {
            name: 'Products',
            path: '/admin/products',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            name: 'Orders',
            path: '/admin/orders',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            name: 'Blog',
            path: '/admin/blog',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
            ),
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            ),
        },
        {
            name: 'Settings',
            path: '/admin/settings',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            ),
        },
    ];

    // Position based on mobile or desktop state
    const sidebarClasses = `fixed inset-y-0 left-0 ${isMobile ? 'z-50' : 'z-40'} 
        md:transition-transform md:duration-300 md:ease-in-out 
        ${isMobile && !isOpen ? '-translate-x-full' : ''} 
        ${!isMobile && !isOpen ? 'md:-translate-x-full' : ''} 
        ${!isMobile && isOpen ? 'md:translate-x-0' : ''}
        ${isMobile && isOpen ? 'translate-x-0' : ''}
        w-64 bg-white border-r border-gray-200 overflow-y-auto`;

    return (
        <div className={sidebarClasses}>
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                    <span className="text-xl font-bold text-[#BD3A3A]">BYC Admin</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Toggle sidebar"
                >
                    {isMobile ? (
                        <svg
                            className="h-6 w-6 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* User Profile */}
            <div className="py-4">
                <div className="px-4 py-3">
                    <div className="flex items-center">
                        <div className="rounded-full bg-gray-200 p-2 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{user?.firstName || 'Admin'} {user?.lastName || ''}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="mt-6">
                    <ul>
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/' && location.pathname.startsWith(item.path));

                            return (
                                <li key={item.name} className="mb-2 px-2">
                                    <Link
                                        to={item.path}
                                        className={`flex items-center py-3 px-4 rounded-lg ${isActive
                                            ? 'bg-[#BD3A3A] bg-opacity-10 text-white border-r-4 border-[#BD3A3A]'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        onClick={() => isMobile && toggleSidebar()}
                                    >
                                        <span className={`${isActive ? 'text-gray-500' : 'text-gray-500'}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 w-full border-t border-gray-200">
                <Link
                    to="/"
                    className="flex items-center py-4 px-4 text-gray-600 hover:bg-gray-100"
                    onClick={() => isMobile && toggleSidebar()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 002 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Exit Admin</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardSidebar;