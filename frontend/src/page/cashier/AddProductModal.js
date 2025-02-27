import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import axios from "axios";
import APISERVICECASHIER from "../../services/api-cashier";

export default function AddProductModal({ isOpen, onClose, selectTB, onAddProduct }) {
  const [selectedProducts, setSelectedProducts] = useState([]); // Chọn nhiều sản phẩm
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productPerPage = 10;
  
  // Filter products based on search term and category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('/categories/list');
        setCategories(categoriesResponse.data);

        const productsResponse = await APISERVICECASHIER.ApiProductInHome(
          search,
          currentPage,
          productPerPage,
          selectCategory
        );
        setProducts(productsResponse.data.product);
        setTotalPages(productsResponse.data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [search, selectCategory, currentPage]);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.productId === product._id);
      if (existingProduct) {
        return prev.map((p) =>
          p.productId === product._id
            ? { ...p, quantityP: p.quantityP + 1, total: (p.quantityP + 1) * p.priceP }
            : p
        );
      }
      return [...prev, { 
        productId: product._id, 
        nameP: product.pname, 
        imageP: product.image, 
        quantityP: 1, 
        priceP: product.sale_price, 
        total: product.sale_price 
      }];
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantityP: Math.max(1, newQuantity), total: Math.max(1, newQuantity) * p.priceP }
          : p
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  const handleAdd = () => {
    if (selectedProducts.length > 0) {
      onAddProduct(selectedProducts);
      setSelectedProducts([]); // Reset sau khi thêm vào hóa đơn
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedProducts([]);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                <Dialog.Title className="text-lg font-semibold flex items-center">
                  <FiShoppingCart className="mr-2" size={20} />
                  Thêm sản phẩm vào hóa đơn {selectTB ? `- ${selectTB.table_name}` : ''}
                </Dialog.Title>
                <button 
                  onClick={onClose} 
                  className="text-white hover:text-blue-200 transition duration-200"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Search and filter section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-colors"
                    />
                  </div>
                  
                  <div className="md:w-1/3">
                    <select
                      value={selectCategory}
                      onChange={(e) => setSelectCategory(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-48 overflow-y-auto mb-6 p-1">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div 
                        key={product._id}
                        onClick={() => handleSelectProduct(product)}
                        className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.pname} 
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.pname}</p>
                            <p className="text-sm text-gray-600">{product.sale_price.toLocaleString()} VND</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-4 text-gray-500">
                      Không tìm thấy sản phẩm phù hợp
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center py-4 border-t border-gray-200">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <GrFormPrevious className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <GrFormNext className="h-5 w-5" />
                    </button>
                  </nav>
                </div>

                {/* Selected Products List */}
                {selectedProducts.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">Sản phẩm đã chọn</h3>
                    <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                      {selectedProducts.map((product) => (
                        <div key={product.productId} className="p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.imageP} 
                              alt={product.nameP} 
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.nameP}</p>
                              <p className="text-sm text-gray-600">{product.priceP} VND</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => handleQuantityChange(product.productId, product.quantityP - 1)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="w-12 p-1 text-center focus:outline-none"
                                value={product.quantityP}
                                onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                                min="1"
                              />
                              <button
                                onClick={() => handleQuantityChange(product.productId, product.quantityP + 1)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveProduct(product.productId)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <IoClose size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total calculation */}
                    <div className="flex justify-between items-center mt-4 p-3 bg-gray-100 rounded-lg">
                      <span className="font-medium">Tổng tiền:</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {selectedProducts.reduce((sum, item) => sum + item.total, 0).toLocaleString()} VND
                      </span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Làm mới
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={selectedProducts.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Thêm vào hóa đơn
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}