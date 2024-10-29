import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPencilAlt, FaPlus, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Paging from '../../../components/common/paging';

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

  const filteredUsers = users.filter(user => 
    (filterActive && user.status) || (filterInactive && !user.status) || (!filterActive && !filterInactive)
  );

  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Quản lý nhân viên & Phân quyền</h2>

        {/* Filter checkboxes */}
        <div className="flex gap-4 mb-4">
          <label>
            <input
              type="checkbox"
              checked={filterActive}
              onChange={() => {
                setFilterActive(!filterActive);
                setCurrentPage(1);
              }}
            />
            Active
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterInactive}
              onChange={() => {
                setFilterInactive(!filterInactive);
                setCurrentPage(1);
              }}
            />
            Inactive
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              <FaPlus className="w-4 h-4" />
              Thêm nhân viên
            </button>
          </div>

          {currentUsers.map((user) => (
            <div key={user._id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FaUser className="w-8 h-8 text-gray-500" />
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-500 font-bold">
                      Vai trò: {user.role ? user.role.role_name : 'Chưa phân quyền'}
                    </p>
                    <p className="text-sm font-bold">
                      Trạng thái: 
                      <span className={`font-bold ${user.status ? 'text-green-500 text-lg' : 'text-red-500 text-lg'}`}>
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <FaPencilAlt className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            <div className="mb-4">
              <label className="block mb-1">Trạng thái:</label>
              <select
                value={newStatus ? 'Active' : 'Inactive'}
                onChange={(e) => setNewStatus(e.target.value === 'Active')}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
