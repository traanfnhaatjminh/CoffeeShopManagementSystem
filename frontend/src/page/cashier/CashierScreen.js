import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import { IoSearch } from 'react-icons/io5';
import axios from 'axios';
import Paging from '../../components/common/paging';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch ,useSelector} from 'react-redux';
import {addToCart,updateQuantity} from '../../store/cart-slice/cartSlice' 

export default function CashierScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const [selectedTable, setSelectedTable] = useState(null);
  // const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 5;
  const dispatch= useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  useEffect(() => {
    // Fetch categories, products, and tables when the component mounts
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('/categories/list');
        setCategories(categoriesResponse.data);

        const productsResponse = await axios.get('/products/listInHome');
        setProducts(productsResponse.data);

        const tablesResponse = await axios.get('/tables/list');
        setTables(tablesResponse.data);

        setFilteredProducts(productsResponse.data); // Initialize filteredProducts with all products
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = products.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category_id === selectedCategory;
      const nameMatch = product.pname.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && nameMatch;
    });

    setFilteredProducts(results);
    if (searchTerm === '') {
      handleCategorySelect(selectedCategory);
    }
    if (results.length === 0 && searchTerm !== '') {
      setNoResultsMessage('Đồ uống không có trong menu hoặc trong phân loại đồ uống!'); // Message when no drinks are found
    } else {
      setNoResultsMessage('');
    }

    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchTerm, products, isOpen, selectedCategory]); // Include selectedCategory as a dependency

  const handleTableSelect = (table, index) => {
    if (table.status === true) {
      // Only allow if table is available
      setSelectedTable(index);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    // const existingProduct = cart.find((item) => item._id === product._id);
    // if (existingProduct) {
    //   setCart(
    //     cart.map((item) =>
    //       item._id === product._id
    //         ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
    //         : item
    //     )
    //   );
    // } else {
    //   setCart([...cart, { ...product, quantity: 1, total: product.price }]);
    // }
  };

  const handleQuantityChange = (_id, change) => {
    dispatch(updateQuantity(_id,change))
    // setCart(
    //   cart
    //     .map((item) =>
    //       item._id === _id
    //         ? {
    //           ...item,
    //           quantity: item.quantity + change,
    //           total: (item.quantity + change) * item.price,
    //         }
    //         : item
    //     )
    //     .filter((item) => item.quantity > 0)
    // );
  };

  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'all') {
      setFilteredProducts(products);
      setSelectedCategory(categoryId); // Clear selected category
    } else {
      setSelectedCategory(categoryId); // Set the selected category
      axios
        .get(`/products/getByCategory/${categoryId}`)
        .then((response) => {
          console.log('Products by category:', response.data); // Log fetched products
          setFilteredProducts(response.data); // Reset filtered products
        })
        .catch((error) => {
          console.error('Error fetching products by category:', error);
        });
    }
  };

  const handleCreateBill = async () => {
    try {
      const billData = {
        total_cost: calculateTotalPrice(),
        table_id: tables[selectedTable]._id,
        product_list: cart.map((item) => ({
          productId: item._id,
          nameP: item.pname,
          imageP: item.image,
          priceP: item.price,
          quantityP: item.quantity,
          total: item.total,
        })),
        payment: null,
        status: 0,
        discount: 0,
      }; // phan nay sua lai 1 chut them cac truong nhu productId: item._id,

      console.log(billData, 'billData');

      const response = await axios.post('/bills/createBill', billData);
      console.log('Bill created successfully:', response.data);

      const tableId = tables[selectedTable]._id;
      await axios.put(`/tables/updateStatus/${tableId}`, { status: false });

      toast.success('Tạo hóa đơn thành công.');
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Lỗi tạo hóa đơn!');
    }
  };

  const currentProducts = filteredProducts.slice((currentPage - 1) * productPerPage, currentPage * productPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* <Header /> */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      {/* Main content */}
      <main className="flex flex-1">
        {/* <Sidebar /> */}

        {/* Menu and Cart */}
        <div className="flex space-x-6 p-4">
          {/* Menu Section */}
          <section className="flex-1">
            <div className="flex">
              <h2 className="text-lg font-bold px-2 py-1 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">Menu</h2>
              <div className="relative flex flex-1 justify-end">
                <input
                  ref={inputRef}
                  type="text"
                  className="relative w-2/3
                   bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm"
                  placeholder={selected}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                  onClick={() => setIsOpen(true)}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 ">
                  <IoSearch />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-6 mt-3">
              <button
                key={'all'}
                className={`btn-categories ${selectedCategory === 'all' ? 'bg-dark font-bold' : ''}`}
                onClick={() => handleCategorySelect('all')}
              >
                Tất cả
              </button>

              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`btn-categories ${selectedCategory === category._id ? 'bg-dark font-bold' : ''}`}
                  onClick={() => handleCategorySelect(category._id)}
                >
                  {category.category_name}
                </button>
              ))}
            </div>

            {/* Drinks List */}
            <div className="grid grid-cols-5 gap-4">
              {currentProducts.length > 0 ? (
                currentProducts
                  .filter((product) => product.status !== 0)
                  .map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow p-4 cursor-pointer"
                      onClick={() => handleAddToCart(product)}
                    >
                      <img src={product.image} alt={product.pname} className="mb-4 rounded" />
                      <h3 className="text-items">{product.pname}</h3>
                      <p className="text-price">{product.price} VND</p>
                    </div>
                  ))
              ) : (
                <div className="col-span-5 text-center text-red-600">{noResultsMessage}</div>
              )}
            </div>
            <Paging
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              itemsPerPage={productPerPage}
              onPageChange={setCurrentPage}
            />
          </section>

          {/* Cart Section */}
          <section className="w-1/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Cart</h2>
            <h2 className="text-xl font-semibold mb-4">Table</h2>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {tables.map((table, index) => (
                <div
                  key={table._id}
                  className={`table ${selectedTable === index ? 'bg-selected' : table.status === true ? 'available' : 'occupied'}`}
                  onClick={() => handleTableSelect(table, index)}
                  style={{
                    cursor: table.status === true ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span>{index + 1}</span>
                </div>
              ))}
            </div>

            <table className="w-full text-left mb-6">
              <thead>
                <tr>
                  <th className="border-b py-2">Name</th>
                  <th className="border-b py-2">Price</th>
                  <th className="border-b py-2">Quantity</th>
                  <th className="border-b py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.pname}</td>
                      <td className="py-2">{item.price} VND</td>
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
                      <td className="py-2">{item.total} VND</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 text-center">
                      No items in cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{calculateTotalPrice()} VND</span>
            </div>
            <button
              style={{ marginTop: '5%' }}
              className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
              disabled={cart.length === 0 || selectedTable === null}
              onClick={handleCreateBill}
            >
              Create Bill
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
