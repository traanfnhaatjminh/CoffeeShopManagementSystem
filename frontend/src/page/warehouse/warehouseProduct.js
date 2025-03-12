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

function WarehouseProduct() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 6;


  const fetchProducts = async () => {
    try {
      let query = "/products/listall";
      if (selectedStatus.length > 0) {
        query += `?status=${selectedStatus.join(",")}`;
      }

      const response = await axios.get(query);
      let allProducts = response.data;

      // Lọc theo từ khóa tìm kiếm
      let filteredProducts = allProducts.filter((product) =>
        product.pname.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sắp xếp theo thứ tự ưu tiên: Active > Inactive > Out of Stock > Discontinued
      filteredProducts.sort((a, b) => {
        const statusOrder = ["active", "inactive", "out of stock", "discontinued"];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedStatus, searchTerm]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleShowIngredientInProduct = (product) => {
    setSelectedProduct(product);
    setShowIngredientModal(true);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleUpdateStatus = async (productId, currentStatus) => {
    let newStatus = "";

    if (currentStatus === "active") {
      newStatus = "inactive";  // Tạm ngừng bán
    } else if (currentStatus === "inactive") {
      newStatus = "active";  // Bán lại
    } else if (currentStatus === "discontinued") {
      toast.error("Sản phẩm đã ngừng bán hẳn, không thể thay đổi!");
      return;
    }

    try {
      await axios.put(`/products/updateStatus/${productId}`, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái sản phẩm");
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };



  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(value);
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus((prevStatus) => {
      if (prevStatus.includes(status)) {
        return prevStatus.filter((s) => s !== status);
      } else {
        return [...prevStatus, status];
      }
    });
  };



  //paging
  const currentProducts = products.slice((currentPage - 1) * productPerPage, currentPage * productPerPage);

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
            {/* Thanh tìm kiếm */}
            <div className="relative w-72">
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

            {/* Nút Thêm */}
            <button className="bg-green-300 text-white p-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition" onClick={handleAddProduct}>
              <FaPlus className="mr-1" />
              Thêm
            </button>

            {/* Bộ lọc trạng thái */}
            <div className="bg-white p-2 shadow-md rounded-lg flex space-x-4 border border-gray-300">
              {[
                { value: "active", label: "Đang bán" },
                { value: "inactive", label: "Tạm ngừng bán" },
                { value: "discontinued", label: "Ngừng cung cấp" },
                { value: "out of stock", label: "Hết hàng" }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    value={value}
                    checked={selectedStatus.includes(value)}
                    onChange={() => handleStatusFilterChange(value)}
                    className="mr-1"
                  />
                  <span className="text-gray-700">{label}</span>
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
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 font-bold text-lg italic text-gray-400">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => {
                    const isInactiveCategory = product.category_id?.status === "discontinued";
                    return (
                      <tr
                        key={product._id}
                        className={`border-b hover:bg-gray-100 transition-colors duration-300 ${isInactiveCategory ? "opacity-50" : ""}`}
                      >
                        <td className="px-6 py-4 text-lg font-medium text-gray-900">
                          {index + 1 + (currentPage - 1) * productPerPage}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500" onClick={() => handleShowIngredientInProduct(product)}>
                          {product.pname}

                          {/* Nếu danh mục của sản phẩm bị inactive */}
                          {isInactiveCategory && (
                            <p className="text-red-500 text-sm mt-1 italic">Sản phẩm này hiện đang ngừng cung cấp</p>
                          )}

                          {/* Nếu chính sản phẩm bị inactive */}
                          {product.status === "inactive" && !isInactiveCategory && (
                            <p className="text-red-500 text-sm mt-1 italic">Sản phẩm này tạm ngừng bán</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.cost_price)}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.sale_price)}
                        </td>
                        <td className="px-6 py-4 text-md text-gray-500">
                          <img src={product.image} alt={product.pname} className="w-16 h-16 object-cover rounded-lg" />
                        </td>
                        <td className="px-6 py-4 text-md font-medium flex space-x-2">
                          <button
                            className="bg-brown-500 text-white py-1 px-3 rounded-lg mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEditProduct(product)}
                            disabled={isInactiveCategory} // Vô hiệu hóa nếu danh mục bị inactive
                          >
                            <FaPen className="inline-block" />
                          </button>
                          <button
                            className={`py-1 px-3 rounded-lg text-white ${isInactiveCategory || product.status === "inactive" ? "bg-red-500" : "bg-green-500"
                              }`}
                            onClick={() => handleUpdateStatus(product._id, product.status)}
                            disabled={isInactiveCategory} // Vô hiệu hóa nếu danh mục bị inactive
                          >
                            {isInactiveCategory || product.status === "inactive" ? "Đang ngừng bán" : "Đang bán"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
