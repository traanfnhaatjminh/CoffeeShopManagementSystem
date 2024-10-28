import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import { IoSearch } from 'react-icons/io5';
import data from '../../data/database.json';
import axios from 'axios';
import { toast } from 'react-toastify';
export default function TableList() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tableList, setTableList] = useState([]);
  const [billList, setBillList] = useState([]);
  const [selectBill, setSelectBill] = useState('');

  const loadData = async () => {
    try {
      const response = await axios.get('/tables/list');
      setTableList(response.data);
      const responseBill = await axios.get('/bills');
      setBillList(responseBill.data);
    } catch (error) {
      console.error('Error loading:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTableClick = async (table) => {
    try {
      if (!table.status) {
        const response = await axios.get(`/bills/table/${table._id}`);
        console.log(`${table._id}`);

        setSelectBill(response.data);
        setSelectedTable({
          ...table,
          bill: response.data ? response.data.product_list : [],
        });

        setPaymentMethod('');
      } else {
        setSelectedTable(null);
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  };

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleUpdateBill = async () => {
    try {
      if (selectedTable && paymentMethod) {
        const billUpdateData = {
          payment: paymentMethod,
          status: 1,
          table_id: selectedTable._id,
        };
        await axios.put(`/bills/update/${selectBill._id}`, billUpdateData);
        await loadData();

        toast.success('Thanh toán thành công!');
        setSelectedTable(null);
        setPaymentMethod('');
      } else {
        alert('Vui lòng chọn phương thức thanh toán!');
      }
    } catch (error) {
      console.error('Error updating bill:', error);
      alert('Có lỗi xảy ra khi thanh toán!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* Main content */}
      <main className="flex flex-1">
        <Sidebar />

        {/* Menu and Cart */}
        <div className="flex space-x-6 p-4 w-full">
          {/* Menu Section */}
          <section className="flex-1">
            <div className="flex">
              <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
                Danh sách bàn
              </h1>
              <div className="relative flex flex-1 justify-end">
                <input
                  type="text"
                  placeholder="Tìm bàn..."
                  className="relative w-2/3 bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <IoSearch />
                </span>
              </div>
            </div>

            {/* Table List */}

            <div className="grid grid-cols-5 gap-4 p-4">
              {tableList.map((table, index) => (
                <div
                  key={table._id}
                  onClick={() => handleTableClick(table)} // Add click event for table selection
                  className={`bg-white rounded-lg shadow p-4 h-40 w-32 flex flex-col items-center justify-center cursor-pointer ${table.status === true ? 'bg-green-200' : 'bg-red-200'
                    }`}
                >
                  <h3 className="text-center font-bold text-xl"> Bàn {index + 1} </h3>
                  <p className="text-sm">Số ghế: {table.number_of_chair}</p>
                  <p className={`text-xs font-semibold ${table.status === true ? 'text-green-500' : 'text-red-500'}`}>
                    {table.status === true ? 'Đang trống' : 'Đang có khách'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cart Section */}
          <section className="w-1/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Hóa đơn thanh toán</h2>

            {selectedTable ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Hóa đơn bàn {selectedTable._id}</h3>
                <table className="w-full text-left mb-6">
                  <thead>
                    <tr>
                      <th className="border-b py-2">Sản phẩm</th>
                      <th className="border-b py-2">Hình ảnh</th>
                      <th className="border-b py-2">Giá</th>
                      <th className="border-b py-2">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTable.bill.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2">{item.nameP}</td>
                        <td className="py-2">
                          {' '}
                          <img className="w-12 h-12 border-spacing-1" src={item.imageP} alt={item.namP} />
                        </td>
                        <td className="py-2">{item.priceP ? item.priceP.toLocaleString() : '0'} VND</td>

                        <td className="py-2">{item.quantityP}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Tổng tiền:</span>
                  <span className="text-lg font-semibold">
                    {selectedTable.bill
                      .reduce((total, item) => total + item.priceP * item.quantityP, 0)
                      .toLocaleString()}{' '}
                    VND
                  </span>
                </div>

                {/* Chọn phương thức thanh toán */}
                <div className="mb-4 ">
                  <h4 className="font-semibold mb-2 ">Chọn phương thức thanh toán:</h4>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="flex-1  py-2 px-1  rounded"
                    />
                    Tiền mặt
                    <input
                      type="radio"
                      id="transfer"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={handleChange}
                      className="flex-1  py-2 px-4  rounded "
                    />
                    Chuyển khoản
                  </div>
                </div>

                {/* Thông báo phương thức thanh toán đã chọn */}
                {paymentMethod && (
                  <div className="mb-4">
                    <p className="text-center font-semibold">
                      Bạn đã chọn phương thức thanh toán:{' '}
                      <span className="text-blue-600">{paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={handleUpdateBill}
                  className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-orange-400 font-bold"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            ) : (
              <p className="text-center">Chưa có bàn thanh toán</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
