import React from 'react';
import { IoRestaurant, IoSearch } from 'react-icons/io5';
import { FaUtensils, FaCoffee, FaWineGlassAlt } from 'react-icons/fa';

const MenuSection = ({
  categories,
  selectCategory,
  setSelectCategory,
  search,
  setSearch,
  selectedView,
  setSelectedView,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow p-3  md:p-2 mb-2 overflow-hidden"
      style={{ maxHeight: '700px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-3 sm:space-y-0">
        <h2 className="text-base md:text-lg font-bold px-3 py-1 md:px-4 md:py-2 bg-brown-900 text-white rounded-lg flex items-center">
          <IoRestaurant className="mr-2" /> Menu
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-200 rounded-lg p-1 self-end sm:self-auto">
            <button
              className={`px-2 py-1 rounded-md text-xs md:text-sm ${selectedView === 'grid' ? 'bg-white shadow' : ''}`}
              onClick={() => setSelectedView('grid')}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3z" />
                </svg>
              </span>
            </button>
            <button
              className={`px-2 py-1 rounded-md text-xs md:text-sm ${selectedView === 'list' ? 'bg-white shadow' : ''}`}
              onClick={() => setSelectedView('list')}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-md pl-8 pr-3 py-1 text-left text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto  mb-1 -mx-1 px-1">
        <div className="flex space-x-2 min-w-max ">
          <button
            className={`btn-categories flex items-center px-3 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-xs md:text-sm ${
              selectCategory === ''
                ? 'bg-brown-900 text-white font-medium'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
            onClick={() => setSelectCategory('')}
          >
            <FaUtensils className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            Tất cả
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              className={`btn-categories flex items-center overflow-x-auto px-3 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-xs md:text-sm ${
                selectCategory === category._id
                  ? 'bg-brown-900 text-white font-medium'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              onClick={() => setSelectCategory(category._id)}
            >
              {category.category_name === 'Cà phê' && <FaCoffee className="mr-1 h-3 w-3 md:h-4 md:w-4" />}
              {category.category_name === 'Đồ uống' && <FaWineGlassAlt className="mr-1 h-3 w-3 md:h-4 md:w-4" />}
              {category.category_name !== 'Cà phê' && category.category_name !== 'Đồ uống' && (
                <FaUtensils className="mr-1 h-3 w-3 md:h-4 md:w-4" />
              )}
              {category.category_name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
