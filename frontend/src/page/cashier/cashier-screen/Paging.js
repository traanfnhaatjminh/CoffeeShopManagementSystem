import React from 'react';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

const Paging = ({ setCurrentPage, currentPage, totalPages }) => {
  return (
    <div className="flex justify-center mt-4 md:mt-6">
      <nav className="flex items-center space-x-1 md:space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GrFormPrevious className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
          // Show only 3 pages on small screens
          let pageNum;
          if (totalPages <= 3) {
            pageNum = i + 1;
          } else {
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, currentPage + 1);
            if (end - start < 2) {
              if (currentPage < totalPages / 2) {
                end = start + 2;
              } else {
                start = end - 2;
              }
            }
            pageNum = start + i;
            if (pageNum > totalPages) return null;
          }

          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md ${
                currentPage === pageNum
                  ? 'bg-brown-500 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GrFormNext className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </nav>
    </div>
  );
};
export default Paging;
