import React from 'react';
import { DashboardStats as StatsType, formatPrice } from '../../types/dashboard';

interface DashboardStatsProps {
    stats: StatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    const COLORS = ['#BD3A3A', '#8884d8', '#82ca9d', '#ffc658'];

    // Create a more readable display name for each stat
    const getDisplayName = (key: string) => {
        switch (key) {
            case 'totalProducts':
                return 'Products';
            case 'totalOrders':
                return 'Orders';
            case 'totalBlogs':
                return 'Blog Posts';
            case 'totalRevenue':
                return 'Revenue';
            default:
                return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
            {Object.entries(stats).map(([key, value], index) => (
                <div
                    key={key}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 flex flex-col border-t-4 transition-transform hover:scale-102 hover:shadow-lg"
                    style={{ borderColor: COLORS[index % COLORS.length] }}
                >
                    <h3 className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1 truncate">
                        {getDisplayName(key)}
                    </h3>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                        {key === 'totalRevenue' ? formatPrice(value) : value.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;