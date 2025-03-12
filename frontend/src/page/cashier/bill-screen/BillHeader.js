import React from 'react';
import { IoSearch, IoFilterOutline, IoCloudDownload } from 'react-icons/io5';
import { FaList, FaThLarge } from 'react-icons/fa';

const BillHeader = ({ search, setSearch, viewMode, setViewMode, showFilters, setShowFilters, handleExport }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 gap-3">
      <div>
        <h1 className="text-base sm:text-lg font-bold px-3 py-1 bg-brown-900 text-white rounded-lg">
          Danh sách hóa đơn
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-grow sm:flex-grow-0 max-w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full sm:w-48 md:w-56 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <IoSearch size={16} />
          </span>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-2 py-1 text-xs rounded-lg border ${
            showFilters ? 'bg-brown-100 text-brown-800 border-brown-300' : 'bg-white text-gray-600 border-gray-300'
          } hover:bg-brown-50`}
        >
          <IoFilterOutline size={14} className="inline mr-1" /> Bộ lọc
        </button>

        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('table')}
            className={`px-2 py-1 ${viewMode === 'table' ? 'bg-brown-500 text-white' : 'bg-white text-gray-600'}`}
          >
            <FaList size={14} />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-2 py-1 ${viewMode === 'card' ? 'bg-brown-500 text-white' : 'bg-white text-gray-600'}`}
          >
            <FaThLarge size={14} />
          </button>
        </div>

        <button
          onClick={handleExport}
          className="bg-brown-500 hover:bg-brown-600 text-white px-3 py-1 text-sm rounded-lg transition duration-150 ease-in-out whitespace-nowrap"
        >
          <IoCloudDownload size={14} className="inline mr-1" /> Export
        </button>
      </div>
    </div>
  );
};

export default BillHeader;
