import { Input } from 'antd';
import React from 'react';

const CartOrder = ({
  selectedTable,
  handleChange,
  handleDiscountChange,
  handleNoteChange,
  notes,
  handleOpenModal,
  discount,
  paymentMethod,
  cashReal,
  setCashReal,
  totalCost,
  handleUpdateBill,
  handleSplitBill,
  splitBill,
}) => {
  return (
    <section className="w-1/3 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Hóa đơn thanh toán</h2>

      {selectedTable ? (
        <div>
          <div className="mb-4 text-lg font-medium">Bàn: {selectedTable.table_name}</div>

          {selectedTable.bill && selectedTable.bill.length > 0 ? (
            <table className="w-full text-left mb-6">
              <thead>
                <tr>
                  <th className="border-b py-2">Sản phẩm</th>
                  <th className="border-b py-2">Hình ảnh</th>
                  <th className="border-b py-2">Giá</th>
                  <th className="border-b py-2">Số lượng</th>
                  <th className="border-b py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {selectedTable.bill.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2">{item.nameP}</td>
                    <td className="py-2">
                      <img className="w-12 h-12 border-spacing-1" src={item.imageP} alt={item.nameP} />
                    </td>
                    <td className="py-2">{item.priceP ? item.priceP.toLocaleString() : '0'} VND</td>
                    <td className="py-2">{item.quantityP}</td>
                    <td className="py-2">
                      <Input
                        value={notes[item._id] || ''}
                        onChange={(e) => handleNoteChange(item._id, e.target.value)}
                        placeholder="Ghi chú"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center mb-4">Chưa có sản phẩm trong hóa đơn</p>
          )}

          {/* Nút thêm đồ uống */}
          <button
            onClick={() => handleOpenModal(selectedTable._id)}
            className="w-full mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 font-semibold transition duration-200"
          >
            Thêm đồ uống
          </button>

          {/* Input giảm giá */}
          <div className="mb-4">
            <label htmlFor="discount" className="font-semibold">
              Khuyến mãi (%):
            </label>
            <input
              type="text"
              id="discount"
              value={discount === 0 ? '' : discount}
              onChange={handleDiscountChange}
              className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
              placeholder="Nhập khuyến mãi"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Tổng tiền:</span>
            <span className="text-lg font-semibold">
              {(
                selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0) *
                ((100 - discount) / 100)
              ).toLocaleString()}{' '}
              VND
            </span>
          </div>

          {/* Chọn phương thức thanh toán */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Chọn phương thức thanh toán:</h4>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Tiền mặt
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  id="transfer"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Chuyển khoản
              </label>
            </div>
          </div>

          {/* Giao diện phương thức thanh toán */}
          <div className="mt-4">
            {paymentMethod === 'cash' && (
              <div className="p-4 bg-gray-100 rounded-md shadow-md ">
                <input
                  type="number"
                  value={cashReal}
                  id="cashreal"
                  onChange={(e) => setCashReal(e.target.value)}
                  className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
                  placeholder="Tiền mặt khách đưa"
                />
                <h5 className="text-lg font-bold">
                  Số tiền trả lại:{' '}
                  {isNaN(parseFloat(cashReal) - totalCost) ? '0' : (parseFloat(cashReal) - totalCost).toLocaleString()}{' '}
                  VND
                </h5>

                <h4 className="text-lg font-bold text-center">Thanh toán bằng tiền mặt</h4>
                <p className="text-center">Vui lòng thanh toán trực tiếp khi nhận hàng.</p>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
                <h4 className="text-lg font-bold">Quét mã QR để thanh toán</h4>
                <img
                  src={require('../../../assets/images/maqr.jpg')}
                  alt="QR Code"
                  className="mx-auto mt-2 w-40 h-100"
                />
                <p className="mt-2 text-sm text-gray-600">Sử dụng ứng dụng ngân hàng để quét mã.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpdateBill}
            className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-orange-400 font-bold mt-4"
            disabled={!paymentMethod}
          >
            Xác nhận thanh toán & Xuất hóa đơn
          </button>

          {/* Tách hóa đơn */}
          <button
            onClick={handleSplitBill}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 font-bold mt-4"
          >
            {splitBill ? 'Hủy tách hóa đơn' : 'Tách hóa đơn'}
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">Vui lòng chọn bàn để xem hóa đơn</p>
      )}
    </section>
  );
};
export default CartOrder;
