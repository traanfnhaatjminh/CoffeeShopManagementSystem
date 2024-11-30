import React, { useState } from 'react';

export default function AddStaffModal({ closeModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Thêm nhân viên mới</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Tên nhân viên</label>
            <input type="text" className="border rounded-md p-2 w-full" required />
          </div>
          <div>
            <label>Ca làm</label>
            <input type="number" className="border rounded-md p-2 w-full" required />
          </div>
          <div>
            <label>Vai trò</label>
            <input type="text" className="border rounded-md p-2 w-full" required />
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">
              Hủy
            </button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Tạo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
