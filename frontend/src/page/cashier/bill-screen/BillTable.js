import React from 'react';
import BillStatusBadge from './BillStatusBadge';
import BillActions from './BillActions';
import { getPaymentMethod, formatDiscount } from './billUtils';

const BillTable = ({ billList, currentPage, billPerPage, billActions }) => {
  return (
    <div className="h-min overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {[
              'STT',
              'TG tạo',
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
                className="sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {billList.filter((bill) => bill.hidden === 0).length > 0 ? (
            billList
              .filter((bill) => bill.hidden === 0)
              .map((bill, index) => (
                <tr key={bill._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                    {(currentPage - 1) * billPerPage + index + 1}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(bill.created_time).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(bill.updated_time).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">{bill.table_id.table_name}</td>
                  <td className="px-3 py-3 text-xs text-gray-500 max-w-xs truncate">
                    {bill.product_list.map((product) => product.nameP).join(', ')}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">{formatDiscount(bill.discount)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                    {getPaymentMethod(bill.payment)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                    {bill.total_cost.toLocaleString('vi-VN')} VND
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <BillStatusBadge status={bill.status} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs font-medium">
                    <BillActions bill={bill} actions={billActions} />
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={10} className="px-3 py-8 text-center text-gray-500">
                Không có dữ liệu hóa đơn
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default BillTable;
