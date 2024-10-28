// StoreInfo.js
import React from 'react';

function StoreInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Thông tin Quán</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Tên quán</label>
          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Địa chỉ</label>
          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Số điện thoại</label>
          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Giờ mở cửa</label>
          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
      </div>
    </div>
  );
}

export default StoreInfo;
