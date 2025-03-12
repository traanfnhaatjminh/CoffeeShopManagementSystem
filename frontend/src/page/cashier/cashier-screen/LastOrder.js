import React from 'react';
import { IoTime } from 'react-icons/io5';

const LastOrder = ({ recentOrders }) => {
  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-2 min-h-min">
      <h3 className="text-sm md:text-md font-semibold mb-2 md:mb-3 text-gray-700 flex items-center">
        <IoTime className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Đơn hàng gần đây
      </h3>
      <div className="overflow-x-auto -mx-1 px-1 max-h-94 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bàn
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentOrders.filter((order) => order.hidden === 0 && order.status === 1).length === 0 ? (
              <tr>
                <td colSpan={10} className=" text-center px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  Không có dữ liệu hóa đơn
                </td>
              </tr>
            ) : (
              recentOrders
                .filter((order) => order.hidden === 0 && order.status === 1)
                .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-medium text-blue-600">{order._id}</div>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">{order.table_id?.table_name}</div>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {order.product_list.map((product) => product.nameP).join(', ')}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-500">{order.updated_time.toLocaleString()}</div>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-right">
                      <div className="text-xs md:text-sm font-semibold text-gray-900">
                        {order.total_cost.toLocaleString()} VND
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LastOrder;
