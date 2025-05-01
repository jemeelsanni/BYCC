import React, { useState, useRef, useEffect } from 'react';

// Define types for our category and subcategory structure
type SubCategory = {
    name: string;
    link: string;
};

type Category = {
    name: string;
    link: string;
    subcategories: SubCategory[];
};

const ProductNavigation: React.FC = () => {
    // Track which category's dropdown is currently open
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    // Track which gender dropdown is open (male/female)
    const [openGender, setOpenGender] = useState<string | null>(null);

    // Ref for detecting clicks outside the dropdown
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Main category data
    const categories: Category[] = [
        {
            name: 'CHILDREN',
            link: '/children',
            subcategories: [
                { name: 'Boxers', link: '/children/boxers' },
                { name: 'Pants', link: '/children/pants' },
                { name: 'T-shirts', link: '/children/t-shirts' },
                { name: 'Singlet', link: '/children/singlet' },
                { name: 'Towels', link: '/children/towels' },
            ],
        },
        {
            name: 'MEN',
            link: '/men',
            subcategories: [
                { name: 'Boxers', link: '/men/boxers' },
                { name: 'Pants', link: '/men/pants' },
                { name: 'T-shirts', link: '/men/t-shirts' },
                { name: 'Singlet', link: '/men/singlet' },
                { name: 'Towels', link: '/men/towels' },
            ],
        },
        {
            name: 'WOMEN',
            link: '/women',
            subcategories: [
                { name: 'Boxers', link: '/women/boxers' },
                { name: 'Pants', link: '/women/pants' },
                { name: 'T-shirts', link: '/women/t-shirts' },
                { name: 'Singlet', link: '/women/singlet' },
                { name: 'Towels', link: '/women/towels' },
            ],
        },
    ];

    // Gender categories for the secondary dropdown
    const genderCategories = [
        { name: 'MALE', link: '/male' },
        { name: 'FEMALE', link: '/female' },
    ];

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenCategory(null);
                setOpenGender(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Toggle the dropdown for main categories
    const toggleCategory = (categoryName: string) => {
        if (openCategory === categoryName) {
            setOpenCategory(null);
            setOpenGender(null);
        } else {
            setOpenCategory(categoryName);
            setOpenGender(null);
        }
    };

    // Toggle the dropdown for gender categories
    const toggleGender = (genderName: string) => {
        setOpenGender(genderName === openGender ? null : genderName);
    };

    return (
        <div className="w-full px-20 manrope-font">
            {/* Main Navigation */}
            <div className="bg-[#F5F5F5] p-4">
                <div className="font-bold text-xl">ALL PRODUCTS</div>
            </div>

            {/* Categories Bar */}
            <div className="px-[49px] bg-[#BD3A3A] text-white text-[20px] font-bold">
                <div className="flex">
                    {categories.map((category) => (
                        <div key={category.name} className={`relative ${category.name === 'MEN' ? 'ml-[268.8px]' : ''}`}>
                            <button
                                onClick={() => toggleCategory(category.name)}
                                className="px-4 py-3 flex items-center hover:bg-red-700 focus:outline-none"
                            >
                                {category.name}
                                <svg
                                    className={`ml-1 w-4 h-4 transition-transform ${openCategory === category.name ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dropdown for CHILDREN */}
            {openCategory === 'CHILDREN' && (
                <div ref={dropdownRef} className="bg-[#F5F5F5] shadow-lg ">
                    <div className="flex pl-[49px]">
                        {/* Gender sidebar */}
                        <div className="w-32">
                            {genderCategories.map((gender) => (
                                <div key={gender.name} className="relative">
                                    <button
                                        onClick={() => toggleGender(gender.name)}
                                        className="w-full py-3 px-4 text-left flex items-center justify-between hover:bg-gray-100 text-[20px] font-normal"
                                    >
                                        {gender.name}
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* If a gender is selected, show subcategories */}
                        {openGender && (
                            <div className="flex-1 px-4 text-[20px] font-normal">
                                <div className="flex flex-col gap-4">
                                    {categories
                                        .find(c => c.name === 'CHILDREN')
                                        ?.subcategories.map((subcat) => (
                                            <a
                                                key={subcat.name}
                                                href={subcat.link}
                                                className="block py-2 hover:text-red-600"
                                            >
                                                {subcat.name}
                                            </a>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dropdown for MEN */}
            {openCategory === 'MEN' && (
                <div ref={dropdownRef} className="bg-[#F5F5F5] pl-[470px] shadow-lg ">
                    <div className="px-4 text-[20px] font-normal">
                        <div className="flex flex-col gap-4">
                            {categories
                                .find(c => c.name === 'MEN')
                                ?.subcategories.map((subcat) => (
                                    <a
                                        key={subcat.name}
                                        href={subcat.link}
                                        className="block py-2 hover:text-red-600"
                                    >
                                        {subcat.name}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown for WOMEN */}
            {openCategory === 'WOMEN' && (
                <div ref={dropdownRef} className="bg-[#F5F5F5] pl-[576px] shadow-lg">
                    <div className="px-4 text-[20px] font-normal">
                        <div className="flex flex-col gap-[18px]">
                            {categories
                                .find(c => c.name === 'WOMEN')
                                ?.subcategories.map((subcat) => (
                                    <a
                                        key={subcat.name}
                                        href={subcat.link}
                                        className="block py-2 hover:text-red-600"
                                    >
                                        {subcat.name}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductNavigation;