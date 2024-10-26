import React, { useState, useEffect } from 'react';
import { FaPen, FaTrash, FaPlus, FaFileImport } from 'react-icons/fa';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import axios from 'axios';
import EditCategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoSearch } from 'react-icons/io5';
import { confirmAlert } from 'react-confirm-alert';

function WarehouseCategory() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories from the backend
  const fetchCategories = async (search = '') => {
    setLoading(true);
    try {
      const response = await axios.get('/categories/list');
      const filteredCategories = response.data.filter(category =>
        category.category_name.toLowerCase().includes(search.toLowerCase())
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
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

  const handleDeleteCategory = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa danh mục này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await axios.delete(`/categories/${id}`); // Adjust the URL according to your API
              setCategories((prevCategories) =>
                prevCategories.filter((category) => category._id !== id)
              );
              toast.success('Danh mục đã được xóa thành công!');
            } catch (error) {
              console.error('Error deleting category:', error);
              toast.error('Đã xảy ra lỗi khi xóa danh mục.');
            }
          }
        },
        {
          label: 'Không',
        }
      ]
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="flex flex-1">
        <Sidebar />
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
            <button className="bg-teal-400 text-white p-2 rounded-lg flex items-center">
              <FaFileImport className="mr-1" />
              Import
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
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4 font-bold text-lg italic text-gray-400">Đang tải dữ liệu...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4 font-bold text-lg italic text-gray-400">Không tìm thấy danh mục nào...</td></tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category._id} className="border-b hover:bg-gray-100">
                      <td className="px-6 py-4 text-lg font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-md text-gray-500">{category.group_name}</td>
                      <td className="px-6 py-4 text-md text-gray-500">{category.category_name}</td>
                      <td className="px-6 py-4 text-md font-medium flex">
                        <button
                          className="bg-brown-500 text-white py-1 px-3 rounded-lg mr-2"
                          onClick={() => handleEditCategory(category)} // Add this line
                        >
                          <FaPen />
                        </button>
                        <button
                          className="bg-brown-900 text-white py-1 px-3 rounded-lg"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

        </div>
      </div>
    </div>
  );
}

export default WarehouseCategory;
