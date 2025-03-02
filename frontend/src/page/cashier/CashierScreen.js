import React, { useState, useEffect } from 'react';
import './style.css';
import { IoSearch } from 'react-icons/io5';
import axios from 'axios';
import Paging from '../../components/common/paging';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../../store/cart-slice/cartSlice';
import { setSelectedTable } from '../../store/table-slice/tableSlice'; // Sử dụng từ tableSlice
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import APISERVICECASHIER from '../../services/api-cashier';
import { generatePDF } from './printBill';
import { createBill } from '../../store/bill-slice/billSlice';
import { fetchTables } from '../../store/table-slice/tableSlice';

export default function CashierScreen() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // const [tables, setTables] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productPerPage = 10;
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const selectedTable = useSelector((state) => state.tables.selectedTable); // Lấy từ tableSlice
  const { tableList } = useSelector((state) => state.tables);
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

        // const tablesResponse = await axios.get('/tables/list');
        // setTables(tablesResponse.data);
        dispatch(fetchTables());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [search, selectCategory, currentPage,dispatch]);

  const handleTableSelect = (table) => {
    if (table.status === true) {
      dispatch(setSelectedTable(table._id)); // Lưu `_id` thay vì index
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleQuantityChange = (_id, change) => {
    dispatch(updateQuantity({ _id, change }));
  };

  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateBill = async () => {
    try {
      await dispatch(createBill({ cart, selectedTable, tableList, calculateTotalPrice })).unwrap();
      generatePDF(cart, selectedTable);
    } catch (error) {
      console.error('Lỗi khi tạo hóa đơn:', error);
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
      <main className="flex flex-1">
        <div className="flex space-x-6 p-4">
          {/* Menu Section */}
          <section className="flex-1">
            <div className="flex">
              <h2 className="text-lg font-bold px-2 py-1 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
                Menu
              </h2>
              <div className="relative flex flex-1 justify-end">
                <input
                  type="text"
                  className="relative w-2/3 bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 ">
                  <IoSearch />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-6 mt-3">
              <button
                className={`btn-categories ${selectCategory === '' ? 'bg-dark font-bold' : ''}`}
                onClick={() => setSelectCategory('')}
              >
                Tất cả
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`btn-categories ${selectCategory === category._id ? 'bg-dark font-bold' : ''}`}
                  onClick={() => setSelectCategory(category._id)}
                >
                  {category.category_name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {products.length > 0 ? (
                products
                  .filter((product) => product.status !== 0)
                  .map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow p-4 cursor-pointer"
                      onClick={() => handleAddToCart(product)}
                    >
                      <img src={product.image} alt={product.pname} className="mb-4 rounded" />
                      <h3 className="text-items">{product.pname}</h3>
                      <p className="text-price">{product.sale_price} VND</p>
                    </div>
                  ))
              ) : (
                <div className="col-span-5 text-center text-red-600">{noResultsMessage}</div>
              )}
            </div>
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
                        ? 'bg-brown-500 text-white'
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
          </section>

          {/* Cart Section */}
          <section className="w-1/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Giỏ hàng</h2>

            <h2 className="text-xl font-semibold mb-4">Bàn</h2>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {tableList.map((table, index) => (
                <div
                  key={table._id}
                  className={`table px-4 py-2 border rounded-lg cursor-pointer text-center 
               ${selectedTable === table._id ? 'bg-cyan-500 text-white font-bold' : 'bg-green-400 text-black'}
               ${table.status ? 'hover:bg-teal-200' : ' bg-red-400 cursor-not-allowed'}`}
                  onClick={() => handleTableSelect(table)}
                >
                  {table.table_name}
                </div>
              ))}
            </div>

            <table className="w-full text-left mb-6">
              <thead>
                <tr>
                  <th className="border-b py-2">Tên sản phẩm</th>
                  <th className="border-b py-2">Ảnh</th>
                  <th className="border-b py-2">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.pname}</td>
                      <td className="py-2">
                        <img className="h-10" alt={item.pname} src={item.image} />
                      </td>
                      <td className="py-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 text-center">
                      Chưa có sản phẩm được thêm vào giỏ hàng!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-around font-bold">
              Chú thích:
              {/* <span>{calculateTotalPrice()} VND</span> */}
              <input
                type="text"
                className="relative w-FULL bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              style={{ marginTop: '5%' }}
              className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
              disabled={cart.length === 0 || selectedTable === null}
              onClick={handleCreateBill}
            >
              Tạo đơn
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}