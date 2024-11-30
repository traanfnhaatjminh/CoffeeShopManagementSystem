import React, { useState } from 'react';

export default function EditUserModal({ user, closeModal }) {
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    username: user?.username || '',
    role: user?.role || 'Thu ngân',
    status: user?.status || 'Đang hoạt động',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu cập nhật ở đây, ví dụ gọi API
    console.log('Updated User:', formData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Tên đầy đủ</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              disabled
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              disabled
            />
          </div>
          <div>
            <label>Tên người dùng</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              disabled
            />
          </div>
          <div>
            <label>Vai trò</label>
            <select name="role" value={formData.role} onChange={handleChange} className="border rounded-md p-2 w-full">
              <option value="Cashier">Thu ngân</option>
              <option value="Warehouse">Quản lý kho</option>
            </select>
          </div>
          <div>
            <label>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            >
              <option value="1">Đang hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">
              Hủy
            </button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
