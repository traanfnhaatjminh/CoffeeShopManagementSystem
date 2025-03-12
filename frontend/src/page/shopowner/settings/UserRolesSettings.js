import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPencilAlt, FaPlus, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Paging from '../../../components/common/paging';
import AddUserModal from '../AddUserModal';

const UserRolesSettings = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const userPerPage = 5;
  const [filterActive, setFilterActive] = useState(false);
  const [filterInactive, setFilterInactive] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const openAddUserModal = () => setShowAddUserModal(true);
  const closeAddUserModal = () => setShowAddUserModal(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/listall');
        const filteredUsers = response.data.filter(user => user.role && user.role.role_name !== 'admin');
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('/roles/listallrole');
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role ? user.role.role_name : '');
    setNewStatus(user.status);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setNewRole('');
    setNewStatus(false);
  };

  const handleRoleChange = async () => {
    try {
      await axios.put(`/users/updateRole/${selectedUser._id}`, { newRole, status: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role: roles.find((r) => r.role_name === newRole), status: newStatus } : user
        )
      );
      toast.success("Cập nhật thành công!");
      closeEditModal();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Cập nhật không thành công!");
    }
  };
  //cập nhật trạng thái
  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "banned" : "active"; // Đảo trạng thái

      await axios.put(`/users/banUser/${id}`, { status: newStatus });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );

      toast.success(`Trạng thái đã được cập nhật: ${newStatus}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };


  const filteredUsers = users.filter(user => {
    if (filterActive && filterInactive) return true; // Nếu cả hai đều chọn, hiển thị tất cả
    if (filterActive) return user.status === "active"; // Chỉ hiển thị user Active
    if (filterInactive) return user.status === "banned"; // Chỉ hiển thị user Banned
    return true; // Nếu không chọn gì, hiển thị tất cả
  });

  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Quản lý nhân viên & Phân quyền</h2>

        {/* Bộ lọc trạng thái */}
        {/* Thanh công cụ chứa Bộ Lọc & Nút "Thêm Nhân Viên" */}
        <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg">
          {/* Bộ lọc trạng thái */}
          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-500"
                checked={filterActive}
                onChange={() => {
                  setFilterActive(!filterActive);
                  setCurrentPage(1);
                }}
              />
              <span className="text-lg text-gray-700">Hoạt động</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-red-500"
                checked={filterInactive}
                onChange={() => {
                  setFilterInactive(!filterInactive);
                  setCurrentPage(1);
                }}
              />
              <span className="text-lg text-gray-700">Bị ban</span>
            </label>
          </div>

          {/* Nút Thêm Nhân Viên */}
          <button
            onClick={openAddUserModal}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <FaPlus className="w-4 h-4" />
            Thêm nhân viên
          </button>
        </div>

          {/* Bảng danh sách nhân viên */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left">Họ & Tên</th>
                  <th className="py-3 px-4 border-b text-left">Email</th>
                  <th className="py-3 px-4 border-b text-left">Số điện thoại</th>
                  <th className="py-3 px-4 border-b text-left">Địa chỉ</th>
                  <th className="py-3 px-4 border-b text-left">Vai trò</th>
                  <th className="py-3 px-4 border-b text-left">Trạng thái</th>
                  <th className="py-3 px-4 border-b text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3 px-4">
                      <p className="font-semibold">{user.fullName}</p>
                      {user.status === "banned" && (
                        <p className="text-xs text-red-500 mt-1">Người dùng này đã bị ban</p>
                      )}
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">{user.address}</td>
                    <td className="py-3 px-4">
                      {user.role ? {
                        "cashier": "Thu ngân",
                        "warehouse manager": "Quản lý kho",
                        "admin": "Quản trị viên",
                        "manager": "Quản lý"
                      }[user.role.role_name.toLowerCase()] || user.role.role_name
                        : "Chưa phân quyền"}
                    </td>

                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`${user.status === "active" ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {user.status === "active" ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <FaPencilAlt className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Kiểm tra trạng thái để hiển thị đúng nút */}
                        {user.status === "active" ? (
                          <button
                            onClick={() => handleUpdateStatus(user._id, "active")}
                            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            Ban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(user._id, "banned")}
                            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          >
                            Bỏ ban
                          </button>
                        )}

                      </td>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Chỉnh Sửa Vai Trò</h3>
            <div className="mb-4">
              <label className="block mb-1">Vai Trò:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Chọn vai trò</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>
          
            <div className="flex justify-end">
              <button onClick={closeEditModal} className="mr-2 bg-gray-300 px-4 py-2 rounded-md">
                Hủy
              </button>
              <button onClick={handleRoleChange} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <AddUserModal closeModal={closeAddUserModal} updateUsers={setUsers} />
      )}

      <Paging
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        itemsPerPage={userPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserRolesSettings;
