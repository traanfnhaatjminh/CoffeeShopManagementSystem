import React, { useState, useEffect } from 'react';
import { FaPen, FaTrash, FaPlus, FaFileImport } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';
import Paging from '../../components/common/paging';
import axios from 'axios'; // Import axios
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { IoSearch } from 'react-icons/io5';
import Paging from '../../components/common/paging'


function WarehouseProduct() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 5;

  const fetchProducts = async (search = '') => {
    try {
      const response = await axios.get('/products/listall');
      //status 1 -> 0
      const activeProducts = response.data.filter((product) => product.status !== 0);
      //filer
      const filteredProducts = activeProducts.filter((product) =>
        product.pname.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  const handleAddProduct = () => {
    setShowAddModal(true);
  };
  const deleteProduct = async (productId) => {
    try {
      const response = await axios.put(`/products/deleteProduct/${productId}`);
      if (response.status === 200) {
        toast.success('Xóa sản phẩm thành công!');
        fetchProducts(searchTerm);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi xóa sản phẩm:', error);
    }
  };
  const confirmDeleteProduct = (productId) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      buttons: [
        {
          label: 'Có',
          onClick: () => deleteProduct(productId),
        },
        {
          label: 'Không',
          onClick: () => toast.info('Hãy suy nghĩ thật kĩ nhé!'),
        },
      ],
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(value);
  };
  const currentProducts = products.slice((currentPage - 1) * productPerPage, currentPage * productPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
              Danh sách sản phẩm
            </h1>
          </div>

          <div className="flex mb-4 items-center space-x-2">
            <div className="relative w-1/3">
              <input
                className="bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm w-full"
                type="text"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm sản phẩm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button type="button" className="bg-transparent border-none cursor-pointer" aria-label="Tìm kiếm">
                  <IoSearch />
                </button>
              </span>
            </div>
            <button className="bg-green-300 text-white p-2 rounded-lg flex items-center" onClick={handleAddProduct}>
              <FaPlus className="mr-1" />
              Thêm
            </button>
            <label
              htmlFor="fileUpload"
              className="bg-teal-400 text-white p-2 rounded-lg flex items-center cursor-pointer"
            >
              <FaFileImport className="mr-1" />
              Import
            </label>
            <input id="fileUpload" type="file" hidden onChange={handleFileChange} />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Tên Sản Phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 font-bold text-lg font-lauren italic text-gray-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 font-bold text-lg font-lauren italic text-gray-400">Không tìm thấy sản phẩm nào, hãy nhập chính xác và thử lại...</td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => (
                    <tr key={product._id} className="border-b hover:bg-gray-100 transition-colors duration-300">
                      <td className="px-6 py-4 text-lg font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-md text-gray-500">{product.pname}</td>
                      <td className="px-6 py-4 text-md text-gray-500">{product.quantity}</td>
                      <td className="px-6 py-4 text-md text-gray-500">{product.price}</td>
                      <td className="px-6 py-4 text-md text-gray-500">
                        <img src={product.image} alt={product.pname} className="w-16 h-16 object-cover rounded-lg" />
                      </td>
                      <td className="px-6 py-4 text-md font-medium flex">
                        <button
                          className="bg-brown-500 text-white py-1 px-3 rounded-lg mr-2"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FaPen className="inline-block" />
                        </button>
                        <button
                          className="bg-brown-900 text-white py-1 px-3 rounded-lg"
                          onClick={() => confirmDeleteProduct(product._id)}
                        >
                          <FaTrash className="inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Paging
              currentPage={currentPage}
              totalItems={products.length}
              itemsPerPage={productPerPage}
              onPageChange={setCurrentPage}
            />
            {showEditModal && (
              <EditProductModal
                product={selectedProduct}
                closeModal={() => setShowEditModal(false)}
                refreshProducts={fetchProducts}
              />
            )}
            {showAddModal && (
              <AddProductModal closeModal={() => setShowAddModal(false)} refreshProducts={fetchProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseProduct;

