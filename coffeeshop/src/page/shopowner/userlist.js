import React from 'react';

function UserList() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <UserManagement />
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar() {
  const menuItems = ['Home', 'Warehouse', 'Categories', 'Table List', 'All Bill', 'Job Board', 'Statistic', 'Setting'];

  return (
    <div className="w-64 bg-gray-200 p-4 space-y-4">
      {menuItems.map((item) => (
        <button key={item} className="w-full p-2 text-left bg-gray-300 hover:bg-gray-400 rounded-lg">
          {item}
        </button>
      ))}
    </div>
  );
}

// User Management Component
function UserManagement() {
  const users = [
    { fullname: 'Minh Nhat', email: 'minh12a2nvc@gmail.com', username: 'minh05', role: 'Shop owner (Admin)', status: 'Active' }
  ];

  return (
    <div>
      <div className=" items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Add User</button>
      </div>

      {/* Filter Section */}
      <div className="mt-4 items-center space-x-4">
        <div>
          <label>Số người dùng trên mỗi trang:</label>
          <select className="border rounded-md ml-2 p-1">
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
        <div>
          <input style={{marginRight:10}} className="border rounded-md p-2 w-64" placeholder="Search users..." />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
        </div>
        <div>
          <select style={{marginRight:10}} className="border rounded-md p-2">
            <option value="">All Roles</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Filter</button>
        </div>
      </div>

      {/* User Table */}
      <table className="min-w-full bg-white border mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Fullname</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.fullname}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">{user.status}</td>
              <td className="border px-4 py-2">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
