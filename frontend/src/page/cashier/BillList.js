import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import axios from 'axios';
import BillDetailModal from './BillDetailModal';
import { CSVLink } from 'react-csv';
import { IoEyeSharp } from 'react-icons/io5';
import ExportBillModal from './ExportBillModal';

export default function BillList() {
  const [billList, setBillList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [billPerPage] = useState(10);
  const [modalShow, setModalShow] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [exportModalShow, setExportModalShow] = useState(false);

  const loadData = async () => {
    const response = await axios.get('/bills', {
      params: { search, page: currentPage, limit: billPerPage },
    });
    setBillList(response.data.bills);
    setTotalPages(response.data.totalPages);
    const responseTable = await axios.get('/tables/list');
    setTableList(responseTable.data);
  };

  useEffect(() => {
    loadData();
  }, [search, currentPage]);

  const getTableNumber = (tableId) => {
    const tableIndex = tableList.findIndex((table) => table._id.toString() === tableId.toString());
    return tableIndex !== -1 ? tableIndex + 1 : 'Not found';
  };

  const handleClickDetail = (bill) => {
    setSelectedBill(bill);
    setModalShow(true);
  };
  const handleExport = () => {
    setExportModalShow(true);
  };
  console.log();
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg m-6">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold px-4 py-2 bg-brown-900 text-white rounded-lg">Danh sách hóa đơn</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <IoSearch size={20} />
              </span>
            </div>

            <button
              onClick={handleExport}
              className="bg-brown-500 hover:bg-brown-600 text-white px-6 py-2 rounded-lg transition duration-150 ease-in-out"
            >
              Export
            </button>

            <ExportBillModal />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  'STT',
                  'TG tạo hóa đơn',
                  'TG thanh toán',
                  'Bàn',
                  'Sản phẩm',
                  'Giảm giá',
                  'PT Thanh Toán',
                  'Tổng tiền',
                  'Trạng thái',
                  'Action',
                ].map((header) => (
                  <th
                    key={header}
                    className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billList.map((bill, index) => (
                <tr key={bill._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(currentPage - 1) * billPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.created_time).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.updated_time).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTableNumber(bill.table_id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {bill.product_list.map((product) => product.nameP).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.discount}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.payment === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.total_cost.toLocaleString('vi-VN')}VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.status === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium justify-center">
                    <IoEyeSharp
                      className='"text-brown-600 hover:text-brown-900 hover:underline '
                      onClick={() => handleClickDetail(bill)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center py-4 border-t border-gray-200">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GrFormPrevious className="h-5 w-5" />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-brown-500 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(billList.length / billPerPage)}
              className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GrFormNext className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
      <BillDetailModal show={modalShow} onClose={() => setModalShow(false)} bill={selectedBill} tableInfo={tableList} />
      <ExportBillModal
        show={exportModalShow}
        onClose={() => setExportModalShow(false)}
        data={billList}
        tableInfo={tableList}
      />{' '}
      {/* Pass the billList to ExportBillModal */}
    </div>
  );
}
