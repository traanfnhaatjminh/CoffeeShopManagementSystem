import React, { useState, useEffect } from 'react';
import { FaPen, FaPlus } from 'react-icons/fa';
import EditCategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import { toast, ToastContainer } from 'react-toastify';
import { IoSearch } from 'react-icons/io5';
import Paging from '../../components/common/paging';
import APISERVICECASHIER from '../../services/api-cashier';

function WarehouseCategory() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryIndexMap, setCategoryIndexMap] = useState({});
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, newStatus: "" });
  const categoryPerPage = 7;


  const fetchCategories = async () => {
    try {
      const response = await APISERVICECASHIER.ApiCategoryList(searchTerm, currentPage, categoryPerPage, selectedStatus);
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);

      const newIndexMap = {};
      response.data.categories.forEach((category, index) => {
        newIndexMap[category._id] = (currentPage - 1) * categoryPerPage + index + 1;
      });
      setCategoryIndexMap(newIndexMap);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, selectedStatus, currentPage]);

  // Handle Search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(prevStatus => prevStatus === status ? '' : status);
    setCurrentPage(1);
  };


  // Toggle Add Modal
  const handleAddCategory = () => setShowAddModal(true);

  // Handle Edit Category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleUpdateStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "discontinued" : "active";
    setConfirmModal({ isOpen: true, id, newStatus });
  };

  // Update category in state after edit
  const updateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
    );
  };

  const confirmStatusUpdate = async () => {
    const { id, newStatus } = confirmModal;
    try {
      await APISERVICECASHIER.updateCategoryStatus(id, newStatus);
      toast.success("Cập nhật trạng thái danh mục thành công!");
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái danh mục!");
      console.error("Lỗi cập nhật danh mục:", error);
    }
    setConfirmModal({ isOpen: false, id: null, newStatus: "" });
  };

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

          <div className="flex mb-4 items-center space-x-4">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white border rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm w-full"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <IoSearch />
              </span>
            </div>

            <button onClick={handleAddCategory} className="bg-green-300 text-white p-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition">
              <FaPlus className="mr-1" />
              Thêm
            </button>

            <div className="bg-white p-2 shadow-md rounded-lg flex space-x-4 border">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={selectedStatus === ''}
                  onChange={() => handleStatusFilterChange('')}
                  className="mr-1"
                />
                <span className="text-gray-700">Tất cả</span>
              </label>

              {[
                { value: "active", label: "Đang hoạt động" },
                { value: "discontinued", label: "Đã ngừng cung cấp" }
              ].map((status) => (
                <label key={status.value} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={() => handleStatusFilterChange(status.value)}
                    className="mr-1"
                  />
                  <span className="text-gray-700">{status.label}</span>
                </label>
              ))}
            </div>
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
                    {categories.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 font-bold text-lg italic text-gray-400">Không tìm thấy danh mục nào.</td></tr>
                    ) : (
                      categories.map((category) => {
                        const isInactiveCategory = category.status === "discontinued";

                        return (
                          <tr key={category._id} className="border-b hover:bg-gray-100">
                            <td className="px-6 py-4 text-lg font-medium text-gray-900">
                              {categoryIndexMap[category._id]}
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
                                className={`px-3 py-1 rounded-lg text-white ${category.status === "active" ? "bg-red-500" : "bg-green-500"}`}
                                onClick={() => handleUpdateStatus(category._id, category.status)}
                              >
                                {category.status === "active" ? "Ngừng cung cấp" : "Cung cấp"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                </table>
              </div>
              <Paging currentPage={currentPage} totalItems={totalPages * categoryPerPage} itemsPerPage={categoryPerPage} onPageChange={setCurrentPage} />

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
