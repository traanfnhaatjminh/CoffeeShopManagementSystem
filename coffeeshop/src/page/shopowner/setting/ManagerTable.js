import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTable, FaPencilAlt, FaPlus } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const ManagerTable = () => {
  const [tableList, setTableList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTable, setNewTable] = useState({ number_of_chair: '', status: false, location_table: '' });
  const [tableToEdit, setTableToEdit] = useState({ number_of_chair: '', status: false, location_table: '' });
  const [tableToDelete, setTableToDelete] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null); // Thêm trạng thái để theo dõi bàn đã chọn

  const loadData = async () => {
    try {
      const response = await axios.get('/tables/list');
      setTableList(response.data);
      console.log(response.data); 
    } catch (error) {
      console.error('Error loading:', error);
    }
  };

  const handleAddTable = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewTable({ number_of_chair: '', status: false, location_table: '' }); // Reset dữ liệu bàn mới
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setTableToEdit(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTableToDelete(null);
  };

  const handleCreateTable = async () => {
    try {
      const response = await axios.post('/tables/createTable', newTable);
      setTableList((prev) => [...prev, response.data.result]);
      closeAddModal();
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleEditTable = () => {
    if (selectedTable) {
      setTableToEdit(selectedTable);
      setShowEditModal(true);
    }
  };

  const handleDeleteTable = () => {
    if (selectedTable) {
      setTableToDelete(selectedTable);
      setShowDeleteModal(true);
    }
  };
  const handleUpdateTable = async () => {
    if (!tableToEdit || !tableToEdit._id) return; // Kiểm tra thêm điều kiện này
  
    try {
      const response = await axios.put(`/tables/update/${tableToEdit._id}`, {
        ...tableToEdit,
        _id: tableToEdit._id,
      });
      setTableList((prev) => prev.map((table) => (table._id === tableToEdit._id ? response.data.updatedTables : table)));
     loadData();
      closeEditModal();
    } catch (error) {
      console.error('Error updating table:', error.response ? error.response.data : error.message);
    }
  };
  

  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;

    try {
      await axios.delete(`/tables/deleteTable/${tableToDelete._id}`);
      setTableList((prev) => prev.filter((table) => table._id !== tableToDelete._id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const handleSelectTable = (table) => {
    setSelectedTable((prev) => (prev && prev._id === table._id ? null : table)); // Chọn hoặc bỏ chọn bàn
  };

  useEffect(() => {
    loadData();
  }, []);

  const groupedTables = tableList.reduce((acc, table) => {
    if (table && table.location_table) { // Kiểm tra xem bàn có tồn tại và có thuộc tính location_table không
      const location = table.location_table;
  
      if (!acc[location]) {
        acc[location] = [];
      }
  
      acc[location].push(table);
    }
    return acc;
  }, {});
  
  
  let totalTables = 0;
  console.log(tableToEdit,"dbdbsbd");
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Quản lý bàn</h2>
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddTable}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-10"
            >
              <FaPlus className="w-4 h-4" />
              Thêm bàn
            </button>
          </div>

          {/* Lặp qua từng tầng */}
          {Object.keys(groupedTables).map((location) => {
            const tables = groupedTables[location]; // Lấy bàn của từng tầng
            return (
              <div key={location} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FaTable className="w-8 h-8 text-gray-500" />
                    <div>
                      <p className="font-medium">Tầng {location}</p>
                      <p className="text-sm text-gray-500">Tổng số bàn: {tables.length}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  {tables.map((table) => {
                    totalTables++;
                    const isSelected = selectedTable && selectedTable._id === table._id; // Kiểm tra xem bàn có được chọn hay không
                    return (
                      <div
                        key={table._id}
                        onClick={() => handleSelectTable(table)}
                        className={`w-10 h-10 rounded-sm shadow cursor-pointer ${isSelected ? 'bg-blue-300' : table.status ? 'bg-green-200' : 'bg-red-200'}`}
                      >
                        <h4 className="text-center font-bold">{totalTables}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Nút Edit và Delete */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleEditTable}
              className={`flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 ${!selectedTable ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedTable}
            >
              <FaPencilAlt className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleDeleteTable}
              className={`flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4 ${!selectedTable ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedTable}
            >
              <MdDeleteForever className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Modal Thêm Bàn */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Thêm Bàn Mới</h3>
            <div className="mb-4">
              <label className="block mb-1">Số ghế:</label>
              <input
                type="number"
                value={newTable.number_of_chair}
                onChange={(e) => setNewTable({ ...newTable, number_of_chair: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Nhập số ghế"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Vị trí:</label>
              <input
                type="number"
                value={newTable.location_table}
                onChange={(e) => setNewTable({ ...newTable, location_table: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Nhập vị trí"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newTable.status}
                  onChange={(e) => setNewTable({ ...newTable, status: e.target.checked })}
                  className="mr-2"
                />
                Bàn trống
              </label>
            </div>
            <div className="flex justify-end">
              <button onClick={closeAddModal} className="text-gray-500 hover:underline mr-4">
                Hủy
              </button>
              <button onClick={handleCreateTable} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Bàn */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Chỉnh Sửa Bàn</h3>
            <div className="mb-4">
              <label className="block mb-1">Số ghế:</label>
              <input
                type="number"
                value={tableToEdit.number_of_chair}
                onChange={(e) => setTableToEdit({ ...tableToEdit, number_of_chair: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Nhập số ghế"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Vị trí:</label>
              <input
                type="number"
                value={tableToEdit.location_table}
                onChange={(e) => setTableToEdit({ ...tableToEdit, location_table: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Nhập vị trí"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tableToEdit.status}
                  onChange={(e) => setTableToEdit({ ...tableToEdit, status: e.target.checked })}
                  className="mr-2"
                />
                Bàn trống
              </label>
            </div>
            <div className="flex justify-end">
              <button onClick={closeEditModal} className="mr-2 bg-gray-300 px-4 py-2 rounded-md">
                Hủy
              </button>
              <button onClick={handleUpdateTable} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xóa Bàn */}
      {showDeleteModal && tableToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Xóa Bàn</h3>
            <p>Bạn có chắc chắn muốn xóa bàn không?</p>
            <div className="flex justify-end mt-4">
              <button onClick={closeDeleteModal} className="text-gray-500 hover:underline mr-4">
                Hủy
              </button>
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTable;
