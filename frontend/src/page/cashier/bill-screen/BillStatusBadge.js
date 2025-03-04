import React from 'react';

const BillStatusBadge = ({ status }) => {
  if (status === 1) {
    return (
      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Đã thanh toán</span>
    );
  } else {
    return (
      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Chưa thanh toán</span>
    );
  }
};

export default BillStatusBadge;
