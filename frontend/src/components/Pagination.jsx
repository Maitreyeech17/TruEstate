// Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "./Pagination.css"; // ← import the CSS

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <div className="pagination-container">

        {/* Previous */}
        <button
          className="arrow-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="ellipsis">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="arrow-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
