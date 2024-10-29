import React from 'react'
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';

const Paging = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  return (
    <div className="flex justify-center py-4 border-t border-gray-200">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GrFormPrevious className="h-5 w-5" />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${currentPage === index + 1
              ? 'bg-brown-500 text-white'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GrFormNext className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Paging;
