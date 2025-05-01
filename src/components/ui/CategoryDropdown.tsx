import React, { useEffect, useState, useRef } from 'react';

interface CategoryDropdownProps {
    onCategoryChange: (category: string) => void;
    initialCategory?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
    onCategoryChange,
    initialCategory = 'All Products'
}) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [isOpen, setIsOpen] = useState(false);
    const initialRenderRef = useRef(true);

    const categoryOptions = [
        'All Products',
        'Men',
        'Women',
        'Children'
    ];

    const handleCategoryChange = (option: string) => {
        setSelectedCategory(option);
        onCategoryChange(option);
        setIsOpen(false);
    };

    // Initialize category only on the first render
    useEffect(() => {
        // Only run on the first render
        if (initialRenderRef.current) {
            initialRenderRef.current = false;

            // Only make the call if we're not already on the initial category
            if (selectedCategory !== initialCategory) {
                setSelectedCategory(initialCategory);
                onCategoryChange(initialCategory);
            }
        }
    }, []); // Empty dependency array means it only runs once

    return (
        <div className="relative inline-block text-left">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
            >
                <span className="mr-2 text-sm text-gray-700">Category</span>
                <span className="font-medium text-sm">{selectedCategory}</span>
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
                        {categoryOptions.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleCategoryChange(option)}
                                className={`
                  block px-4 py-2 text-sm text-gray-700
                  hover:bg-gray-100 cursor-pointer
                  ${selectedCategory === option ? 'bg-gray-100 font-semibold' : ''}
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

export default CategoryDropdown;