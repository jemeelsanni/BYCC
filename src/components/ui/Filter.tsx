import React from 'react';

interface FilterCategoryProps {
    activeCategory: string;
    activeProductType: string;
    onCategoryChange: (category: string) => void;
    onProductTypeChange: (type: string) => void;
}

export const FilterCategory: React.FC<FilterCategoryProps> = ({
    activeCategory,
    onCategoryChange,

}) => {
    return (
        <div className='flex flex-col items-center jost-font'>
            <div className='flex gap-4 lg:gap-[34px]'>
                <p
                    className={`font-normal text-[20px] lg:text-[25px] cursor-pointer ${activeCategory === 'women' ? '' : 'text-[#828282]'}`}
                    onClick={() => onCategoryChange('women')}
                >
                    For Women
                </p>
                <div>
                    <p
                        className={`font-normal text-[20px] lg:text-[25px] cursor-pointer ${activeCategory === 'men' ? '' : 'text-[#828282]'}`}
                        onClick={() => onCategoryChange('men')}
                    >
                        For Men
                    </p>
                    {activeCategory === 'men' && (
                        <div className='border-b w-20 lg:w-[88px] mt-[1px] bg-[#212121]'></div>
                    )}
                </div>
                <p
                    className={`font-normal text-[20px] lg:text-[25px] cursor-pointer ${activeCategory === 'kids' ? '' : 'text-[#828282]'}`}
                    onClick={() => onCategoryChange('kids')}
                >
                    For Kids
                </p>
            </div>


        </div>
    );
};

// For backward compatibility, provide a default export that 
// uses internal state when no props are provided
export default function DefaultFilterCategory() {
    const [activeCategory, setActiveCategory] = React.useState('men');
    const [activeProductType, setActiveProductType] = React.useState('pants');

    return (
        <FilterCategory
            activeCategory={activeCategory}
            activeProductType={activeProductType}
            onCategoryChange={setActiveCategory}
            onProductTypeChange={setActiveProductType}
        />
    );
}