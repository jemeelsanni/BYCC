import React, { useState } from 'react';

const SortDropdown: React.FC = () => {
    const [selectedSort, setSelectedSort] = useState('Most Sold');
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        'Most Sold',
        'Price: Low to High',
        'Price: High to Low',
        'Newest Arrivals',
        'Best Rated'
    ];

    const handleSortChange = (option: string) => {
        setSelectedSort(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
            >
                <span className="mr-2 text-sm text-gray-700">Sort by</span>
                <span className="font-medium text-sm">{selectedSort}</span>
                <svg
                    className="ml-2 h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                >
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {sortOptions.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleSortChange(option)}
                                className={`
                  block px-4 py-2 text-sm text-gray-700 
                  hover:bg-gray-100 cursor-pointer
                  ${selectedSort === option ? 'bg-gray-100 font-semibold' : ''}
                `}
                                role="menuitem"
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortDropdown;