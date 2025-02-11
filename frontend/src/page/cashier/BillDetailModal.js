import React, { useState } from 'react';

export default function BillDetailModal({ show, onClose, bill, tableInfo }) {
  const [isProductDetailsVisible, setProductDetailsVisible] = useState(false); // Trạng thái để kiểm soát việc hiển thị chi tiết sản phẩm

  if (!show) return null;

  const getTableNumber = (tableId) => {
    const tableIndex = tableInfo.findIndex((table) => table._id.toString() === tableId.toString());
    return tableIndex !== -1 ? tableIndex + 1 : 'Not found';
  };

  const toggleProductDetails = () => {
    setProductDetailsVisible((prev) => !prev); // Đảo ngược trạng thái hiển thị chi tiết sản phẩm
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 h-auto max-h-[90%] overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chi tiết hóa đơn</h2>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Thời gian tạo hóa đơn:</span> {new Date(bill.created_time).toLocaleString()}
        </p>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Thời gian thanh toán:</span> {new Date(bill.updated_time).toLocaleString()}
        </p>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Bàn:</span> {getTableNumber(bill.table_id)}
        </p>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Sản phẩm:</span>
          {bill.product_list.map((product) => (
            <span key={product.productId} className="block text-gray-700 cursor-pointer hover:underline">
              {product.nameP}
            </span>
          ))}
        </p>
        <button onClick={toggleProductDetails} className="mt-2 text-sm text-blue-500 hover:underline">
          {isProductDetailsVisible ? 'Ẩn chi tiết sản phẩm' : 'Xem chi tiết sản phẩm'}
        </button>

        {isProductDetailsVisible && (
          <div className="mt-4 border-t border-gray-300 pt-4">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Chi tiết các sản phẩm</h3>
            {bill.product_list.map((product) => (
              <div key={product.productId} className="mb-4 p-2 border rounded-lg bg-gray-50 flex">
                <div className="flex-1">
                  <img src={product.imageP} alt={product.nameP} className="w-36 h-36 mb-2 rounded " />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-gray-700">
                    <span className="font-semibold">Tên sản phẩm:</span> {product.nameP}
                  </p>
                  <p className="mb-1 text-gray-700">
                    <span className="font-semibold">Giá:</span> {product.priceP.toLocaleString('vi-VN')} VND
                  </p>
                  <p className="mb-1 text-gray-700">
                    <span className="font-semibold">Số lượng:</span> {product.quantityP}
                  </p>
                  <p className="mb-1 text-gray-700">
                    <span className="font-semibold">Tổng:</span> {product.total.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Giảm giá:</span> {bill.discount}%
        </p>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Phương thức thanh toán:</span>{' '}
          {bill.payment === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
        </p>
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">Tổng tiền:</span> {bill.total_cost.toLocaleString('vi-VN')} VND
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-brown-500 hover:bg-brown-600 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
