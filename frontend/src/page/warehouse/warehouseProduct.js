import React, { useState, useEffect } from 'react';
import { FaPen, FaPlus } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';
import Paging from '../../components/common/paging';
import axios from 'axios'; // Import axios
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ShowIngredientInProduct from './ShowIngredientInProduct';
import APISERVICECASHIER from '../../services/api-cashier';

function WarehouseProduct() {
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [productIndexMap, setProductIndexMap] = useState({});
  const productPerPage = 6;

  const handleShowIngredientInProduct = (product) => {
    setSelectedProduct(product);
    setShowIngredientModal(true);
  };

  const fetchProducts = async () => {
    try {
      const response = await APISERVICECASHIER.ApiProductInWareHouse(
        search,
        currentPage,
        productPerPage,
        selectedStatus
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      const newIndexMap = {};
      response.data.products.forEach((product, index) => {
        newIndexMap[product._id] = (currentPage - 1) * productPerPage + index + 1;
      });
      setProductIndexMap(newIndexMap);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedStatus, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (currentPage !== 1) setCurrentPage(1); // Chỉ reset khi cần
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(prevStatus => prevStatus === status ? '' : status);
    if (currentPage !== 1) setCurrentPage(1);
  };


  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleUpdateStatus = async (productId, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "active") {
      newStatus = "inactive";
    } else if (currentStatus === "inactive") {
      newStatus = "active";
    } else if (currentStatus === "discontinued") {
      toast.error("Sản phẩm đã ngừng bán hẳn, không thể thay đổi!");
      return;
    } else if (currentStatus === "out of stock") {
      toast.error("Sản phẩm đã hết hàng, cần nhập thêm để kích hoạt lại!");
      return;
    }

    try {
      await APISERVICECASHIER.updateProductStatus(productId, newStatus);
      toast.success("Cập nhật trạng thái thành công!");
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái sản phẩm");
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
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
        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
              Danh sách hàng hóa
            </h1>
          </div>

          <div className="flex mb-4 items-center space-x-4">
            <div className="relative w-72">
              <input
                className="bg-white border rounded-md pl-3 pr-10 py-2 cursor-default w-full"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={handleSearchChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <IoSearch />
              </span>
            </div>

            {/* Nút Thêm */}
            <button className="bg-green-300 text-white p-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition" onClick={handleAddProduct}>
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
                { value: "active", label: "Đang bán" },
                { value: "inactive", label: "Tạm ngừng bán" },
                { value: "discontinued", label: "Nghỉ bán" },
                { value: "out of stock", label: "Tạm hết hàng" }
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
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Tên đồ uống
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Giá vốn
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Giá bán
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 font-bold text-lg italic text-gray-400">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => {
                    const isInactiveCategory = product.category_id?.status === "discontinued";
                    const isOutOfStock = product.status === "out of stock";
                    const isDiscontinued = product.status === "discontinued";
                    const isInactive = product.status === "inactive";

                    return (
                      <tr
                        key={product._id}
                        className={`border-b hover:bg-gray-100 transition-colors duration-300 ${isInactiveCategory ? "opacity-50" : ""
                          }`}
                      >
                        <td className="px-6 py-4 text-lg font-medium text-gray-900">{productIndexMap[product._id]}</td>

                        <td className="px-6 py-4 text-md text-gray-500" onClick={() => handleShowIngredientInProduct(product)}>
                          {product.pname}

                          {isInactive && !isInactiveCategory && (
                            <p className="text-orange-500 text-sm mt-1 italic">
                              Sản phẩm này tạm ngừng bán.
                            </p>
                          )}
                          {isOutOfStock && (
                            <p className="text-blue-500 text-sm mt-1 italic">
                              Sản phẩm này đã hết hàng.
                            </p>
                          )}
                          {isDiscontinued && (
                            <p className="text-red-600 text-sm mt-1 italic">
                              Sản phẩm này đã ngừng bán do danh mục đã ngừng cung cấp.
                            </p>
                          )}
                        </td>

                        {/* Giá vốn */}
                        <td className="px-6 py-4 text-md text-gray-500">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.cost_price)}
                        </td>

                        {/* Giá bán */}
                        <td className="px-6 py-4 text-md text-gray-500">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.sale_price)}
                        </td>

                        {/* Ảnh sản phẩm */}
                        <td className="px-6 py-4 text-md text-gray-500">
                          <img src={product.image} alt={product.pname} className="w-16 h-16 object-cover rounded-lg" />
                        </td>

                        {/* Hành động */}
                        <td className="px-6 py-4 text-md font-medium flex space-x-2">
                          <button
                            className="bg-brown-500 text-white py-1 px-3 rounded-lg mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEditProduct(product)}
                            disabled={isInactiveCategory || isDiscontinued}
                          >
                            <FaPen className="inline-block" />
                          </button>

                          <button
                            className={`py-1 px-3 rounded-lg text-white ${isInactiveCategory || isDiscontinued
                              ? "bg-gray-400 cursor-not-allowed"
                              : isOutOfStock
                                ? "bg-blue-500"
                                : isInactive
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}
                            onClick={() => handleUpdateStatus(product._id, product.status)}
                            disabled={isInactiveCategory || isDiscontinued || isOutOfStock}
                          >
                            {isInactiveCategory || isDiscontinued
                              ? "Ngừng bán"
                              : isOutOfStock
                                ? "Hết hàng"
                                : isInactive
                                  ? "Bán lại"
                                  : "Đang bán"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
            <Paging currentPage={currentPage} totalItems={totalPages * productPerPage} itemsPerPage={productPerPage} onPageChange={setCurrentPage} />
            {showEditModal && (
              <EditProductModal
                product={selectedProduct}
                closeModal={() => setShowEditModal(false)}
                refreshProducts={fetchProducts}
              />
            )}
            {showIngredientModal && (
              <ShowIngredientInProduct
                product={selectedProduct}
                closeModal={() => setShowIngredientModal(false)}
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