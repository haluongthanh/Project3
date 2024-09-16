import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const range = 2; 

        let startPage = Math.max(1, currentPage - range);
        let endPage = Math.min(totalPages, currentPage + range);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination pagination-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>
                        &lt;
                    </button>
                </li>
                {generatePageNumbers().map((page, index) => (
                    <li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        {page === '...' ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button className="page-link" onClick={() => handlePageClick(page)}>
                                {page}
                            </button>
                        )}
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
                    &gt;

                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
