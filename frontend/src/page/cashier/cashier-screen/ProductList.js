import React from 'react';

const ProductList = ({ selectedView, products, handleAddToCart, noResultsMessage }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {selectedView === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
          {products.length > 0 ? (
            products
              .filter(
                (product) =>
                  product.status !== 'inactive' &&
                  product.status !== 'discontinued' &&
                  product.status !== 'out of stock'
              )
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => product.status === 'active' && handleAddToCart(product)}
                >
                  <div className="h-24 md:h-32 overflow-hidden">
                    <img src={product.image} alt={product.pname} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 md:p-3">
                    <h3 className="font-medium text-xs md:text-sm text-gray-800 truncate">{product.pname}</h3>
                    <div className="flex justify-between items-center mt-1 md:mt-2">
                      <p className="text-blue-600 font-bold text-xs md:text-sm">
                        {product.sale_price.toLocaleString()} VND
                      </p>
                      <button
                        className={`${
                          product.status === 'active'
                            ? 'bg-brown-500 text-white p-1 rounded-full hover:bg-brown-600'
                            : 'bg-gray-400 text-white p-1 rounded-full cursor-not-allowed'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.status === 'active') {
                            handleAddToCart(product);
                          }
                        }}
                        disabled={product.status !== 'active'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 md:h-4 md:w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full text-center py-10 text-red-600 text-sm">
              {noResultsMessage || 'Không tìm thấy sản phẩm nào'}
            </div>
          )}

          {/* Inactive products (faded) */}
          {products
            .filter((product) => product.status === 'inactive')
            .map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden opacity-50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAddToCart(product)}
              >
                <div className="h-24 md:h-32 overflow-hidden">
                  <img src={product.image} alt={product.pname} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="font-medium text-xs md:text-sm text-gray-800 truncate">{product.pname}</h3>
                  <div className="flex justify-between items-center mt-1 md:mt-2">
                    <p className="text-blue-600 font-bold text-xs md:text-sm">
                      {product.sale_price.toLocaleString()} VND
                    </p>
                    <button
                      className="bg-brown-500 text-white p-1 rounded-full hover:bg-brown-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Discontinued products */}
          {products
            .filter((product) => product.status === 'discontinued')
            .map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-24 md:h-32 overflow-hidden relative">
                  <img src={product.image} alt={product.pname} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-md">
                    Ngừng sản xuất
                  </div>
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="font-medium text-xs md:text-sm text-gray-800 truncate">{product.pname}</h3>
                  <div className="flex justify-between items-center mt-1 md:mt-2">
                    <p className="text-blue-600 font-bold text-xs md:text-sm">
                      {product.sale_price.toLocaleString()} VND
                    </p>
                    <button disabled className="bg-gray-400 text-white p-1 rounded-full cursor-not-allowed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Out of stock products */}
          {products
            .filter((product) => product.status === 'out of stock')
            .map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-24 md:h-32 overflow-hidden relative">
                  <img src={product.image} alt={product.pname} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-br-md">
                    Hết hàng
                  </div>
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="font-medium text-xs md:text-sm text-gray-800 truncate">{product.pname}</h3>
                  <div className="flex justify-between items-center mt-1 md:mt-2">
                    <p className="text-blue-600 font-bold text-xs md:text-sm">{product.price.toLocaleString()} VND</p>
                    <button disabled className="bg-gray-400 text-white p-1 rounded-full cursor-not-allowed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Products Display - List View - Responsive table with smaller text */}
      {selectedView === 'list' && (
        <div className="bg-white rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-2 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className={`hover:bg-gray-50 ${product.status === 'inactive' ? 'opacity-50' : ''}`}
                  >
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                          <img
                            className="h-8 w-8 md:h-10 md:w-10 rounded-md object-cover"
                            src={product.image}
                            alt={product.pname}
                          />
                        </div>
                        <div className="ml-2 md:ml-4">
                          <div className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-full">
                            {product.pname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-blue-600 font-semibold">
                        {product.sale_price.toLocaleString()} VND
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      {product.status === 'discontinued' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Ngừng sản xuất
                        </span>
                      )}
                      {product.status === 'out of stock' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Hết hàng
                        </span>
                      )}
                      {product.status === 'active' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Còn hàng
                        </span>
                      )}
                      {product.status === 'inactive' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                      {product.status === 'active' ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="text-brown-600 hover:text-brown-900 bg-brown-100 hover:bg-brown-200 px-2 py-1 md:px-3 md:py-1 rounded-md text-xs"
                        >
                          Thêm vào giỏ
                        </button>
                      ) : (
                        <button
                          disabled
                          className="text-gray-400 bg-gray-100 px-2 py-1 md:px-3 md:py-1 rounded-md text-xs cursor-not-allowed"
                        >
                          Không có sẵn
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 md:px-6 py-2 md:py-4 text-center text-red-600 text-xs md:text-sm">
                    {noResultsMessage || 'Không tìm thấy sản phẩm nào'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ProductList;
