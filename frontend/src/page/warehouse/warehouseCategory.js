import React, { useState, useEffect } from 'react';
import { FaPen, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import EditCategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import { toast, ToastContainer } from 'react-toastify';
import { IoSearch } from 'react-icons/io5';
import Paging from '../../components/common/paging';

function WarehouseCategory() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, newStatus: "" });
  const categoryPerPage = 7;

  // Fetch categories from the backend
  const fetchCategories = async (search = '') => {
    try {
      const response = await axios.get('/categories/list');
      const filteredCategories = response.data.filter(category =>
        category.category_name.toLowerCase().includes(search.toLowerCase())
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCategories(value);
  };

  // Toggle Add Modal
  const handleAddCategory = () => setShowAddModal(true);

  // Handle Edit Category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  // Update category in state after edit
  const updateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
    );
  };
  // Cập nhật trạng thái danh mục
  const handleUpdateStatus = (id, newStatus) => {
    setConfirmModal({ isOpen: true, id, newStatus });
  };

  const confirmStatusUpdate = async () => {
    const { id, newStatus } = confirmModal;
    try {
      await axios.put(`/categories/inactive/${id}`, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
      console.log("Lỗi khi cập nhật trạng thái:", error);
    }
    setConfirmModal({ isOpen: false, id: null, newStatus: "" });
  };

  //paging
  const currentCategories = categories.slice((currentPage - 1) * categoryPerPage, currentPage * categoryPerPage);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="flex flex-1">
        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
              Danh sách danh mục
            </h1>
          </div>

          <div className="flex mb-4 items-center space-x-2">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                aria-label="Tìm kiếm danh mục"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white border rounded-md pl-3 pr-10 py-2 w-full"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <IoSearch />
              </span>
            </div>
            <button onClick={handleAddCategory} className="bg-green-300 text-white p-2 rounded-lg flex items-center">
              <FaPlus className="mr-1" />
              Thêm
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tên Nhóm</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tên Danh Mục</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCategories.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4 font-bold text-lg italic text-gray-400">Không tìm thấy danh mục nào...</td></tr>
                ) : (
                  currentCategories.map((category, index) => {
                    const isInactiveCategory = category.status === "discontinued";

                    return (
                      <tr key={category._id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-4 text-lg font-medium text-gray-900">
                          {index + 1 + (currentPage - 1) * categoryPerPage}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500">{category.group_name}</td>
                        <td className="px-6 py-4 text-md text-gray-500">
                          {category.category_name}
                          <p className={`text-sm mt-1 italic ${isInactiveCategory ? "text-red-500" : "text-green-500"}`}>
                            Hiện danh mục này đang {isInactiveCategory ? "ngừng cung cấp" : "được cung cấp"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-md font-medium flex">
                          <button
                            className="bg-brown-500 text-white py-1 px-3 rounded-lg mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEditCategory(category)}
                            disabled={isInactiveCategory} // Vô hiệu hóa nếu danh mục không còn hoạt động
                          >
                            <FaPen />
                          </button>
                          <button
                            className={`text-white py-1 px-3 rounded-lg ${isInactiveCategory ? "bg-green-500" : "bg-red-500"}`}
                            onClick={() => handleUpdateStatus(category._id, isInactiveCategory ? "active" : "discontinued")}
                          >
                            {isInactiveCategory ? "Cung cấp" : "Ngừng cung cấp"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>
          <Paging
            currentPage={currentPage}
            totalItems={categories.length}
            itemsPerPage={categoryPerPage}
            onPageChange={setCurrentPage}
          />
          {showAddModal && (
            <AddCategoryModal
              closeModal={() => setShowAddModal(false)}
              refreshCategories={fetchCategories}
            />
          )}

          {showEditModal && (
            <EditCategoryModal
              category={selectedCategory}
              closeModal={() => setShowEditModal(false)}
              updateCategory={updateCategory}
              fetchCategories={fetchCategories} // Pass the fetchCategories function
            />
          )}
          {confirmModal.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-lg font-bold mb-4">Xác nhận</h2>
                <p className="mb-4">Bạn có chắc chắn muốn đổi trạng thái danh mục này không?</p>
                <div className="flex justify-center space-x-4">
                  <button onClick={confirmStatusUpdate} className="bg-red-500 text-white px-4 py-2 rounded-lg">Xác nhận</button>
                  <button onClick={() => setConfirmModal({ isOpen: false })} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WarehouseCategory;
