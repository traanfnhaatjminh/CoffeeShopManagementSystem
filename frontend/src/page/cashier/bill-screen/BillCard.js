import React from 'react';
import BillStatusBadge from './BillStatusBadge';
import BillActions from './BillActions';
import { getPaymentMethod, formatDiscount } from './billUtils';

const BillCard = ({ billList, billActions }) => {
  return (
    <div className="h-full overflow-auto p-4">
      {billList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {billList.map((bill) => (
            <div key={bill._id} className="flex flex-col border rounded-lg shadow-sm overflow-hidden bg-white">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="overflow-hidden">
                  <h3 className="text-lg font-semibold truncate">Bàn: {bill.table_id.table_name}</h3>
                  <p className="text-xs text-gray-500">{new Date(bill.created_time).toLocaleString()}</p>
                </div>
                <div>
                  <BillStatusBadge status={bill.status} />
                </div>
              </div>

              <div className="p-4 flex-grow">
                <div className="mb-3">
                  <p className="text-xs text-gray-600">Sản phẩm:</p>
                  <p className="text-xs font-medium line-clamp-2">
                    {bill.product_list.map((product) => product.nameP).join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Giảm giá:</p>
                    <p className="text-xs font-medium">{formatDiscount(bill.discount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">PT Thanh toán:</p>
                    <p className="text-xs font-medium">{getPaymentMethod(bill.payment)}</p>
                  </div>
                </div>

                <div className="font-bold text-base text-right">{bill.total_cost.toLocaleString('vi-VN')} VND</div>
              </div>

              <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
                <BillActions bill={bill} actions={billActions} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Không có dữ liệu hóa đơn</p>
        </div>
      )}
    </div>
  );
};

export default BillCard;

// Thay đổi ở BillList.jsx - Phần chính chứa nội dung
