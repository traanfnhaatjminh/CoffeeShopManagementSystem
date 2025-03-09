import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTable, FaPencilAlt, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { MdDeleteForever, MdGridView, MdViewList } from 'react-icons/md';

const EnhancedTableManager = () => {
  const [tableList, setTableList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTable, setNewTable] = useState({ table_name: '', number_of_chair: '', status: true, location_table: '' });
  const [tableToEdit, setTableToEdit] = useState(null);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'occupied'
  const [selectedFloor, setSelectedFloor] = useState('all');

  // Load table data
  const loadData = async () => {
    try {
      const response = await axios.get('/tables/list');
      setTableList(response.data);
      console.log('Tables loaded:', response.data);

      // Get unique floors for filter
      const floors = [...new Set(response.data.map((table) => table.location_table))].sort((a, b) => a - b);
      console.log('Available floors:', floors);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast.error('Không thể tải danh sách bàn');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Modal handlers
  const handleAddTable = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewTable({ table_name: '', number_of_chair: '', status: true, location_table: '' });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setTableToEdit(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTableToDelete(null);
  };

  // Create new table
  const handleCreateTable = async () => {
    try {
      if (!newTable.table_name || !newTable.number_of_chair || !newTable.location_table) {
        toast.warning('Vui lòng nhập đầy đủ thông tin bàn');
        return;
      }

      const response = await axios.post('/tables/createTable', newTable);
      setTableList((prev) => [...prev, response.data.result]);
      toast.success('Thêm bàn mới thành công');
      closeAddModal();
    } catch (error) {
      console.error('Error creating table:', error);
      toast.error('Không thể tạo bàn mới');
    }
  };

  // Select table for editing/deleting
  const handleSelectTable = (table) => {
    setSelectedTable((prev) => (prev && prev._id === table._id ? null : table));
  };

  // Edit table
  const handleEditTable = () => {
    if (selectedTable) {
      setTableToEdit({ ...selectedTable });
      setShowEditModal(true);
    } else {
      toast.warning('Vui lòng chọn bàn để chỉnh sửa');
    }
  };

  // Update table
  const handleUpdateTable = async () => {
    if (!tableToEdit || !tableToEdit._id) return;

    try {
      const response = await axios.put(`/tables/update/${tableToEdit._id}`, {
        ...tableToEdit,
      });

      setTableList((prev) =>
        prev.map((table) => (table._id === tableToEdit._id ? response.data.updatedTables : table))
      );

      toast.success('Cập nhật bàn thành công');
      loadData();
      closeEditModal();
    } catch (error) {
      console.error('Error updating table:', error);
      toast.error('Không thể cập nhật bàn');
    }
  };

  // Delete table
  const handleDeleteTable = () => {
    if (selectedTable) {
      setTableToDelete(selectedTable);
      setShowDeleteModal(true);
    } else {
      toast.warning('Vui lòng chọn bàn để xóa');
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;

    try {
      await axios.delete(`/tables/deleteTable/${tableToDelete._id}`);
      setTableList((prev) => prev.filter((table) => table._id !== tableToDelete._id));
      setSelectedTable(null);
      toast.success('Xóa bàn thành công');
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error('Không thể xóa bàn');
    }
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Get unique floors from table list
  const floors = [...new Set(tableList.map((table) => table.location_table))].sort((a, b) => a - b);

  // Filter tables based on search, status, and floor
  const filteredTables = tableList.filter((table) => {
    const matchesSearch = table.table_name && table.table_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ? true : filterStatus === 'available' ? table.status === true : table.status === false;
    const matchesFloor = selectedFloor === 'all' ? true : table.location_table === selectedFloor;

    return matchesSearch && matchesStatus && matchesFloor;
  });

  // Group tables by floor
  const groupedTables = filteredTables.reduce((acc, table) => {
    if (table && table.location_table) {
      const location = table.location_table;
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(table);
    }
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Quản lý bàn</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleViewMode}
              className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300"
              title={viewMode === 'grid' ? 'Chuyển sang chế độ danh sách' : 'Chuyển sang chế độ lưới'}
            >
              {viewMode === 'grid' ? <MdViewList size={20} /> : <MdGridView size={20} />}
            </button>

            <button
              onClick={handleAddTable}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <FaPlus className="w-4 h-4" />
              Thêm bàn
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Tìm kiếm bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Đang trống</option>
              <option value="occupied">Đang có khách</option>
            </select>
          </div>

          <div className="flex items-center">
            <FaTable className="text-gray-400 mr-2" />
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value === 'all' ? 'all' : e.target.value)}
            >
              <option value="all">Tất cả các tầng</option>
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  Tầng {floor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table displays */}
        {viewMode === 'grid' ? (
          // Grid view
          <div className="space-y-6">
            {Object.keys(groupedTables).length > 0 ? (
              Object.keys(groupedTables)
                .sort()
                .map((location) => {
                  const tables = groupedTables[location];
                  return (
                    <div key={location} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <FaTable className="w-8 h-8 text-gray-500" />
                          <div>
                            <p className="font-medium">Tầng {location}</p>
                            <p className="text-sm text-gray-500">Tổng số bàn: {tables.length}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
                        {tables.map((table) => {
                          const isSelected = selectedTable && selectedTable._id === table._id;
                          return (
                            <div
                              key={table._id}
                              onClick={() => handleSelectTable(table)}
                              className={`
                              border rounded-lg p-3 cursor-pointer transition-all
                              ${isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'}
                              ${table.status ? 'bg-green-100' : 'bg-red-100'}
                            `}
                            >
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${table.status ? 'bg-green-200' : 'bg-red-200'}`}
                                >
                                  <span className="font-bold">{table.table_name}</span>
                                </div>
                                <span className="text-sm font-medium">{table.number_of_chair} ghế</span>
                                <span
                                  className={`text-xs mt-1 px-2 py-0.5 rounded-full ${table.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                >
                                  {table.status ? 'Trống' : 'Bận'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8 text-gray-500">Không có bàn nào phù hợp với tìm kiếm</div>
            )}
          </div>
        ) : (
          // List view
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên bàn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số ghế
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tầng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTables.length > 0 ? (
                  filteredTables.map((table) => {
                    const isSelected = selectedTable && selectedTable._id === table._id;
                    return (
                      <tr
                        key={table._id}
                        onClick={() => handleSelectTable(table)}
                        className={`cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{table.table_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{table.number_of_chair}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Tầng {table.location_table}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${table.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {table.status ? 'Đang trống' : 'Đang có khách'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không có bàn nào phù hợp với tìm kiếm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleEditTable}
            className={`flex items-center gap-2 px-4 py-2 rounded-md
              ${
                selectedTable
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            disabled={!selectedTable}
          >
            <FaPencilAlt className="w-4 h-4" />
            Chỉnh sửa
          </button>
          <button
            onClick={handleDeleteTable}
            className={`flex items-center gap-2 px-4 py-2 rounded-md
              ${
                selectedTable
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            disabled={!selectedTable}
          >
            <MdDeleteForever className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Thêm Bàn Mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Tên bàn:</label>
                <input
                  type="text"
                  value={newTable.table_name}
                  onChange={(e) => setNewTable({ ...newTable, table_name: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Nhập tên bàn (VD: Bàn 1)"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Số ghế:</label>
                <input
                  type="number"
                  value={newTable.number_of_chair}
                  onChange={(e) => setNewTable({ ...newTable, number_of_chair: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Nhập số ghế"
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Vị trí (Tầng):</label>
                <input
                  type="number"
                  value={newTable.location_table}
                  onChange={(e) => setNewTable({ ...newTable, location_table: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Nhập số tầng"
                  min="1"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTable.status}
                    onChange={(e) => setNewTable({ ...newTable, status: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm">Trạng thái trống</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={closeAddModal} className="text-gray-500 hover:text-gray-700 mr-4">
                Hủy
              </button>
              <button
                onClick={handleCreateTable}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && tableToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Chỉnh Sửa Bàn</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Tên bàn:</label>
                <input
                  type="text"
                  value={tableToEdit.table_name || ''}
                  onChange={(e) => setTableToEdit({ ...tableToEdit, table_name: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Nhập tên bàn"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Số ghế:</label>
                <input
                  type="number"
                  value={tableToEdit.number_of_chair || ''}
                  onChange={(e) => setTableToEdit({ ...tableToEdit, number_of_chair: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Nhập số ghế"
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Vị trí (Tầng):</label>
                <input
                  type="number"
                  value={tableToEdit.location_table || ''}
                  onChange={(e) => setTableToEdit({ ...tableToEdit, location_table: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  placeholder="Nhập số tầng"
                  min="1"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tableToEdit.status}
                    onChange={(e) => setTableToEdit({ ...tableToEdit, status: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-sm">Trạng thái trống</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700 mr-4">
                Hủy
              </button>
              <button
                onClick={handleUpdateTable}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tableToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa bàn</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa bàn {tableToDelete.table_name || ''}? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex justify-end">
              <button onClick={closeDeleteModal} className="text-gray-500 hover:text-gray-700 mr-4">
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTableManager;
