import React from 'react';

interface ViewToggleProps {
    activeView: string;
    onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onViewChange }) => {
    return (
        <div className="flex p-1 border border-gray-300 rounded-lg w-[136px] h-[36px]">
            <button
                onClick={() => onViewChange('list')}
                className={`
          w-[50%] flex justify-around items-center
          ${activeView === 'list'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white text-gray-500 rounded-l-md hover:bg-gray-100'}
          border-r border-gray-300 rounded-l-md
        `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill={activeView === 'list' ? '#CE6B6B' : '#000'}
                >
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
            </button>
            <button
                onClick={() => onViewChange('grid')}
                className={`
          w-[50%] flex justify-around items-center
          ${activeView === 'grid'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white text-gray-500 rounded-r-md hover:bg-gray-100'}
                        rounded-r-md
        `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill={activeView === 'grid' ? '#CE6B6B' : '#000'}
                >
                    <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
                </svg>
            </button>
        </div>
    );
};

export default ViewToggle;