import React, { useState } from 'react';
import { FaFilter, FaSearch, FaPlus, FaFileImport, FaEdit } from 'react-icons/fa';

export default function UserManagement({ showModal, setShowModal, setShowEditModal, setCurrentUser }) {
  const users = [
    {
      fullname: 'Minh Nhat',
      email: 'minh12a2nvc@gmail.com',
      username: 'minh05',
      role: 'Thu ngân',
      status: 1,
    },
    {
      fullname: 'Thành Nam',
      email: 'nam@gmail.com',
      username: 'namcanthanh',
      role: 'Quản lý kho',
      status: 0,
    },
  ];

  const roles = [
    { id: 1, name: 'Thu ngân' },
    { id: 2, name: 'Quản lý kho' },
  ];

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="flex-1 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
          Quản lý nhân viên
        </h1>
      </div>

      <div className="flex mb-4 items-center space-x-2">
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          className="border border-gray-300 p-2 rounded-lg w-1/3 sm:w-auto"
        />
        <button className="bg-brown-900 text-white p-2 rounded-lg">
          <FaSearch />
        </button>
        <div>
          <select className="border rounded-md p-2">
            <option key={0} value={'all'}>
              Tất cả
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            <FaFilter />
          </button>
        </div>
        <button className="bg-green-300 p-2 rounded-lg flex items-center" onClick={() => setShowModal(true)}>
          <FaPlus className="mr-1" />
          Tạo người dùng mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Tên đầy đủ
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Tên người dùng
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Chỉnh sửa
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4 text-lg font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-md text-gray-500">{user.fullname}</td>
                <td className="px-6 py-4 text-md text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-md text-gray-500">{user.username}</td>
                <td className="px-6 py-4 text-md text-gray-500">{user.role}</td>
                <td className="px-6 py-4 text-md text-gray-500" style={{ color: user.status === 1 ? 'green' : 'red' }}>
                  {user.status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
                </td>
                <td className="px-6 py-4 text-md text-gray-500">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg" onClick={() => handleEdit(user)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
