import React, { useState } from 'react';

const ViewToggle: React.FC = () => {
    const [activeView, setActiveView] = useState('list');

    return (
        <div className="flex border border-gray-300 rounded-md w-[136px] h-[36px]">
            <button
                onClick={() => setActiveView('list')}
                className={`
           w-[50%] flex justify-around items-center
          ${activeView === 'list'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white text-gray-500 hover:bg-gray-100'}
          border-r border-gray-300
        `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="#000"
                >
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
            </button>
            <button
                onClick={() => setActiveView('grid')}
                className={`
           w-[50%] flex justify-around items-center
          ${activeView === 'grid'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white text-gray-500 hover:bg-gray-100'}
        `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="#CE6B6B"
                >
                    <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
                </svg>
            </button>
        </div>
    );
};

export default ViewToggle;