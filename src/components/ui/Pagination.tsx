import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    // Generate array of page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Show at most 5 page numbers

        if (totalPages <= maxPagesToShow) {
            // If there are 5 or fewer pages, show all of them
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first and last page
            pages.push(1);

            // Calculate start and end of page range around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if the range is too small
            if (end - start < 2) {
                if (start === 2) {
                    end = Math.min(totalPages - 1, end + (2 - (end - start)));
                } else if (end === totalPages - 1) {
                    start = Math.max(2, start - (2 - (end - start)));
                }
            }

            // Add ellipsis before middle pages if needed
            if (start > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis after middle pages if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Add last page if it's not already included
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center items-center space-x-2">
            {/* Previous button */}
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#F1EEEE] text-[#BD3A3A] hover:bg-[#e5e2e2]'
                    }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Page numbers */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-3 py-1">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={`page-${page}`}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        className={`px-3 py-1 rounded-md ${currentPage === page
                                ? 'bg-[#BD3A3A] text-white'
                                : 'bg-[#F1EEEE] text-gray-700 hover:bg-[#e5e2e2]'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next button */}
            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#F1EEEE] text-[#BD3A3A] hover:bg-[#e5e2e2]'
                    }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Pagination;