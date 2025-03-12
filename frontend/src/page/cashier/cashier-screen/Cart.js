import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { IoCart } from 'react-icons/io5';

const Cart = ({
  isCartExpanded,
  tableList,
  selectedTable,
  handleTableSelect,
  cart,
  handleCreateBill,
  handleQuantityChange,
  handleRemoveFromCart,
  note,
  setNote,
}) => {
  return (
    <section
      className={`bg-white rounded-lg shadow md:ml-4 transition-all duration-300 ${
        isCartExpanded ? 'md:w-1/3 lg:w-1/4' : 'md:w-1/6 md:overflow-hidden'
      }`}
    >
      {isCartExpanded ? (
        <div className="flex flex-col h-full">
          {/* Cart Header - Smaller text and padding */}
          <div className="bg-brown-800 text-white p-2 md:p-3 rounded-t-lg flex justify-between items-center">
            <h2 className="text-sm md:text-lg font-bold flex items-center">
              <IoCart className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> Giỏ hàng
            </h2>
            <div className="text-xs bg-blue-600 px-1 py-0.5 md:px-2 md:py-1 rounded-full">{cart.length} món</div>
          </div>

          {/* Tables Section - Smaller grid with compact display */}
          <div className="p-2 md:p-3 border-b">
            <h2 className="text-sm md:text-base font-semibold mb-1 md:mb-2 flex items-center">
              <FaClipboardList className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Bàn
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 md:gap-2">
              {tableList.map((table) => (
                <div
                  key={table._id}
                  className={`table px-1 py-1 md:px-2 md:py-2 border rounded-lg cursor-pointer text-center text-xs
                        ${selectedTable === table._id ? 'bg-cyan-500 text-white font-bold' : ''}
                        ${
                          table.status
                            ? 'bg-green-400 text-black hover:bg-teal-200'
                            : 'bg-red-400 cursor-not-allowed opacity-60'
                        }`}
                  onClick={() => handleTableSelect(table)}
                >
                  {table.table_name}
                </div>
              ))}
            </div>
          </div>

          {/* Cart Items - Smaller images and text */}
          <div className="flex-1 overflow-y-auto p-2 md:p-3">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <img className="h-8 w-8 md:h-10 md:w-10 rounded object-cover" src={item.image} alt={item.pname} />
                    <div className="ml-2 md:ml-3">
                      <h3 className="font-medium text-xs md:text-sm truncate max-w-[80px] md:max-w-[120px]">
                        {item.pname}
                      </h3>
                      <p className="text-xs text-gray-500">{item.sale_price.toLocaleString()} VND</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="px-1 md:px-2 py-0.5 md:py-1 bg-gray-100 hover:bg-gray-200 text-xs"
                      >
                        -
                      </button>
                      <span className="px-1 md:px-2 py-0.5 md:py-1 bg-white text-xs md:text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="px-1 md:px-2 py-0.5 md:py-1 bg-gray-100 hover:bg-gray-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="ml-1 md:ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 md:h-5 md:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-2 text-center text-xs md:text-sm">Chưa có sản phẩm được thêm vào giỏ hàng!</div>
            )}
          </div>

          {/* Cart Footer - Compact but functional layout */}
          <div className="p-2 md:p-3 border-t">
            <div className="flex flex-col mb-2 md:mb-3">
              <div className="text-xs md:text-sm font-bold mb-1">Chú thích:</div>
              <input
                type="text"
                value={note} // Hiển thị giá trị của note
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white py-1 md:py-2 rounded text-xs md:text-sm disabled:bg-gray-300"
              disabled={cart.length === 0 || selectedTable === null}
              onClick={handleCreateBill}
            >
              Tạo đơn
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 text-center">
          <IoCart className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1" />
          <span className="text-xs">{cart.length} món</span>
        </div>
      )}
    </section>
  );
};
export default Cart;
