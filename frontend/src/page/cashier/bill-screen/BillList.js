import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables } from '../../../store/table-slice/tableSlice';

import BillHeader from './BillHeader';
import BillFilters from './BillFilter';
import BillTable from './BillTable';
import BillCard from './BillCard';
import BillPagination from './BillPagination';
import BillDetailModal from './BillDetailModal';
import ExportBillModal from './ExportBillModal';

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
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

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
          ...(dateRange.from && { from: `${dateRange.from}T00:00:00.000Z` }),
          ...(dateRange.to && { to: `${dateRange.to}T23:59:59.999Z` }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(paymentFilter !== 'all' && { payment: paymentFilter }),
        };

        const response = await axios.get('/bills', { params });
        setBillList(response.data.bills);
        setTotalPages(response.data.totalPages);
        dispatch(fetchTables());
      } catch (error) {
        console.error('Error loading bill data:', error);
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
    console.log('Printing bill:', bill._id);
  };

  const handleSendEmail = (bill) => {
    // Implement email sending functionality
    console.log('Sending bill via email:', bill._id);
  };

  const handleCancelBill = async (bill) => {
    if (window.confirm('Bạn có chắc muốn hủy hóa đơn này không?')) {
      try {
        console.log('Cancelling bill:', bill._id);
        await axios.put(`/bills/delete/${bill._id}`);
        setBillList((prevBills) => prevBills.filter((b) => b._id !== bill._id));
        alert('Hóa đơn đã được hủy thành công.');
      } catch (error) {
        console.error('Lỗi khi hủy hóa đơn:', error);
        alert('Có lỗi xảy ra khi hủy hóa đơn.');
      }
    }
  };

  const resetFilters = () => {
    setDateRange({ from: '', to: '' });
    setStatusFilter('all');
    setPaymentFilter('all');
    setSearch('');
  };

  const billActions = {
    handleClickDetail,
    handlePrint,
    handleSendEmail,
    handleCancelBill,
  };

  return (
    <div className="h-min bg-gray-100 flex flex-col">
      {/* Sử dụng cấu trúc grid để tạo layout cố định */}
      <div className="m-2 sm:m-4 md:m-6 bg-white rounded-lg shadow-lg flex flex-col h-[calc(85vh-50px)]">
        {/* Header Section - Chiều cao cố định */}
        <div className="flex-none">
          <BillHeader
            search={search}
            setSearch={setSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleExport={handleExport}
          />
        </div>

        {/* Filters Section - Chiều cao cố định khi hiển thị */}
        {showFilters && (
          <div className="flex-none">
            <BillFilters
              dateRange={dateRange}
              setDateRange={setDateRange}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              resetFilters={resetFilters}
            />
          </div>
        )}

        {/* Main Container - Phân bổ vùng cho bảng và footer */}
        <div className=" flex-1 overflow-hidden flex flex-col">
          {/* Content Section - Sử dụng flex-1 để lấp đầy không gian còn lại */}
          <div className="flex-1 h-0 overflow-auto">
            {viewMode === 'table' ? (
              <BillTable
                billList={billList}
                currentPage={currentPage}
                billPerPage={billPerPage}
                billActions={billActions}
              />
            ) : (
              <BillCard billList={billList} billActions={billActions} />
            )}
          </div>

          {/* Footer Section - Chiều cao cố định */}
          <div className="flex-col border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 gap-3">
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={billPerPage}
                  onChange={(e) => setBillPerPage(Number(e.target.value))}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
                >
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {billList.length > 0 ? (currentPage - 1) * billPerPage + 1 : 0} -{' '}
                  {Math.min(currentPage * billPerPage, billList.length * totalPages)} / {billList.length * totalPages}
                </span>
              </div>

              <BillPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        </div>
      </div>

      <BillDetailModal show={modalShow} onClose={() => setModalShow(false)} bill={selectedBill} tableInfo={tableList} />

      <ExportBillModal
        show={exportModalShow}
        onClose={() => setExportModalShow(false)}
        data={billList}
        tableInfo={tableList}
      />
    </div>
  );
}
