import React from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';

const BillPagination = ({ currentPage, totalPages, setCurrentPage }) => {
  // Show max 5 pages with current page in the middle when possible
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center space-x-1">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-1 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GrFormPrevious className="h-4 w-4" />
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={`relative inline-flex items-center px-3 py-1 text-xs font-medium rounded-md ${
            currentPage === number
              ? 'bg-brown-500 text-white'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-2 py-1 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GrFormNext className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default BillPagination;
