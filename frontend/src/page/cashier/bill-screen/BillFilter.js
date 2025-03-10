import React from 'react';

const BillFilters = ({
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  resetFilters,
}) => {
  return (
    <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-700 mb-1">
            Từ ngày
          </label>
          <div className="flex items-center">
            <input
              type="date"
              id="dateFrom"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dateTo" className="block text-xs font-medium text-gray-700 mb-1">
            Đến ngày
          </label>
          <div className="flex items-center">
            <input
              type="date"
              id="dateTo"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="1">Đã thanh toán</option>
            <option value="0">Chưa thanh toán</option>
          </select>
        </div>

        <div>
          <label htmlFor="payment" className="block text-xs font-medium text-gray-700 mb-1">
            Phương thức thanh toán
          </label>
          <select
            id="payment"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="cash">Tiền mặt</option>
            <option value="transfer">Chuyển khoản</option>
          </select>
        </div>
      </div>

      <div className="flex justify-start mt-3">
        <button
          onClick={resetFilters}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default BillFilters;
