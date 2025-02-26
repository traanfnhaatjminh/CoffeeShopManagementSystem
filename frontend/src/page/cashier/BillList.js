
import React, { useEffect, useState } from 'react';
import { IoSearch, IoEyeSharp, IoFilterOutline, IoCloudDownload, IoTrashOutline, IoPrint, IoMailOutline } from 'react-icons/io5';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { FaList, FaThLarge, IoCalendarOutline } from 'react-icons/fa';
import axios from 'axios';
import BillDetailModal from './BillDetailModal';
import { CSVLink } from 'react-csv';
import ExportBillModal from './ExportBillModal';
import { fetchTables } from '../../store/table-slice/tableSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function BillList() {
  // State management
  const [billList, setBillList] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [billPerPage, setBillPerPage] = useState(10);
  const [modalShow, setModalShow] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [exportModalShow, setExportModalShow] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  // const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const { tableList } = useSelector((state) => state.tables);
  const dispatch = useDispatch();

  // Load data effect
  useEffect(() => {
    const loadData = async () => {
      try {
        // Build filter parameters
        const params = { 
          search, 
          page: currentPage, 
          limit: billPerPage,
          ...(dateRange.from && { from: `${dateRange.from}T00:00:00.000Z` }),  // Bắt đầu từ 00:00:00 của ngày đó
          ...(dateRange.to && { to: `${dateRange.to}T23:59:59.999Z` }),  // Kết thúc cuối ngày 23:59:59
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(paymentFilter !== 'all' && { payment: paymentFilter }),
        };
        
        
        const response = await axios.get('/bills', { params });
        setBillList(response.data.bills);
        setTotalPages(response.data.totalPages);
        dispatch(fetchTables());
      } catch (error) {
        console.error("Error loading bill data:", error);
        // Show error notification
      }
    };
    
    loadData();
  }, [search, currentPage, dispatch, billPerPage, dateRange, statusFilter, paymentFilter]);

  // Handle bill actions
  const handleClickDetail = (bill) => {
    setSelectedBill(bill);
    setModalShow(true);
  };
  
  const handleExport = () => {
    setExportModalShow(true);
  };
  
  const handlePrint = (bill) => {
    // Implement print functionality
    console.log("Printing bill:", bill._id);
  };
  
  const handleSendEmail = (bill) => {
    // Implement email sending functionality
    console.log("Sending bill via email:", bill._id);
  };
  
  const handleCancelBill = (bill) => {
    // Implement bill cancellation with confirmation
    if (window.confirm("Bạn có chắc muốn hủy hóa đơn này không?")) {
      console.log("Cancelling bill:", bill._id);
      // API call to cancel bill
    }
  };
  
  const resetFilters = () => {
    setDateRange({ from: '', to: '' });
    setStatusFilter('all');
    setPaymentFilter('all');
  
    setSearch('');
  };

  // Get payment method display name
  const getPaymentMethod = (method) => {
    if (!method) return 'Chưa thanh toán';
    switch(method) {
      case 'cash': return 'Tiền mặt';
      case 'transfer': return 'Chuyển khoản';
      default: return method;
    }
  };

  // Render status badge with color
  const renderStatusBadge = (status) => {
    if (status === 1) {
      return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Đã thanh toán</span>;
    } else {
      return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Chưa thanh toán</span>;
    }
  };

  // Card view rendering
  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {billList.map((bill) => (
          <div key={bill._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Bàn: {bill.table_id.table_name}</h3>
                <p className="text-sm text-gray-500">{new Date(bill.created_time).toLocaleString()}</p>
              </div>
              <div>{renderStatusBadge(bill.status)}</div>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm text-gray-600">Sản phẩm:</p>
                <p className="text-sm font-medium">{bill.product_list.map((product) => product.nameP).join(', ')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Giảm giá:</p>
                  <p className="text-sm font-medium">
                    {bill.discount !== undefined && bill.discount !== null
                      ? bill.discount > 0
                        ? `${bill.discount}%`
                        : 'Không có'
                      : 'Chưa áp mã'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">PT Thanh toán:</p>
                  <p className="text-sm font-medium">{getPaymentMethod(bill.payment)}</p>
                </div>
              </div>
              
              <div className="font-bold text-lg text-right">{bill.total_cost.toLocaleString('vi-VN')} VND</div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
              <button onClick={() => handleClickDetail(bill)} className="text-blue-600 hover:text-blue-800">
                <IoEyeSharp size={18} />
              </button>
              <button onClick={() => handlePrint(bill)} className="text-gray-600 hover:text-gray-800">
                <IoPrint size={18} />
              </button>
              <button onClick={() => handleSendEmail(bill)} className="text-green-600 hover:text-green-800">
                <IoMailOutline size={18} />
              </button>
              {bill.status === 0 && (
                <button onClick={() => handleCancelBill(bill)} className="text-red-600 hover:text-red-800">
                  <IoTrashOutline size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Table view rendering
  const renderTableView = () => {
    return (
      <div className="overflow-auto">
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
                  {new Date(bill.created_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(bill.updated_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.table_id.table_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {bill.product_list.map((product) => product.nameP).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bill.discount !== undefined && bill.discount !== null
                    ? bill.discount > 0
                      ? `${bill.discount}%`
                      : 'Không có mã giảm giá'
                    : 'Chưa áp mã'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getPaymentMethod(bill.payment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bill.total_cost.toLocaleString('vi-VN')} VND
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(bill.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                  <button onClick={() => handleClickDetail(bill)} className="text-blue-600 hover:text-blue-800">
                    <IoEyeSharp size={18} />
                  </button>
                  <button onClick={() => handlePrint(bill)} className="text-gray-600 hover:text-gray-800">
                    <IoPrint size={18} />
                  </button>
                  <button onClick={() => handleSendEmail(bill)} className="text-green-600 hover:text-green-800">
                    <IoMailOutline size={18} />
                  </button>
                  {bill.status === 0 && (
                    <button onClick={() => handleCancelBill(bill)} className="text-red-600 hover:text-red-800">
                      <IoTrashOutline size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render filters section
  const renderFilters = () => {
    return (
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <div className="flex items-center">
              <input
                type="date"
                id="dateFrom"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <div className="flex items-center">
              <input
                type="date"
                id="dateTo"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="1">Đã thanh toán</option>
              <option value="0">Chưa thanh toán</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
            <select
              id="payment"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="cash">Tiền mặt</option>
              <option value="transfer">Chuyển khoản</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      
          
          <div className="flex items-end justify-start space-x-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Đặt lại
            </button>
            {/* <button
            onClick={}
              className="bg-brown-500 hover:bg-brown-600 text-white px-4 py-2 rounded-lg transition duration-150 ease-in-out"
            >
              Áp dụng
            </button> */}
          </div>
        </div>
      </div>
    );
  };

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
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg border ${showFilters ? 'bg-brown-100 text-brown-800 border-brown-300' : 'bg-white text-gray-600 border-gray-300'} hover:bg-brown-50`}
            >
              <IoFilterOutline size={18} className="inline mr-1" /> Bộ lọc
            </button>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-brown-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <FaList size={18} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 ${viewMode === 'card' ? 'bg-brown-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <FaThLarge size={18} />
              </button>
            </div>
            
            <button
              onClick={handleExport}
              className="bg-brown-500 hover:bg-brown-600 text-white px-6 py-2 rounded-lg transition duration-150 ease-in-out"
            >
              <IoCloudDownload size={18} className="inline mr-1" /> Export
            </button>
          </div>
        </div>
        
        {showFilters && renderFilters()}
        
        <div className="flex-1 overflow-auto">
          {viewMode === 'table' ? renderTableView() : renderCardView()}
        </div>
        
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <select
              value={billPerPage}
              onChange={(e) => setBillPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
              <option value={100}>100 / trang</option>
            </select>
            <span className="text-sm text-gray-500">
              Hiển thị {billList.length > 0 ? (currentPage - 1) * billPerPage + 1 : 0} - {Math.min(currentPage * billPerPage, billList.length * totalPages)} / {billList.length * totalPages} hóa đơn
            </span>
          </div>
          
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
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GrFormNext className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
      
      <BillDetailModal 
        show={modalShow} 
        onClose={() => setModalShow(false)} 
        bill={selectedBill} 
        tableInfo={tableList} 
      />
      
      <ExportBillModal
        show={exportModalShow}
        onClose={() => setExportModalShow(false)}
        data={billList}
        tableInfo={tableList}
      />
    </div>
  );
}