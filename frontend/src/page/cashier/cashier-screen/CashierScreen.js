import React, { useState, useEffect } from 'react';
import '../style.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, removeFromCart } from '../../../store/cart-slice/cartSlice';
import { setSelectedTable } from '../../../store/table-slice/tableSlice';
import APISERVICECASHIER from '../../../services/api-cashier';
import { generatePDF } from './printBill';
import { createBill } from '../../../store/bill-slice/billSlice';
import { fetchTables } from '../../../store/table-slice/tableSlice';
import MenuSection from './MenuSection';
import ProductList from './ProductList';
import LastOrder from './LastOrder';
import Cart from './Cart';
import Paging from './Paging';

export default function CashierScreen() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedView, setSelectedView] = useState('grid');
  const [isCartExpanded, setIsCartExpanded] = useState(true);
  const [note, setNote] = useState('');
  const productPerPage = 12;
  const [noResultsMessage, setNoResultsMessage] = useState('');

  const [recentOrders, setRecentOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  const [discountAmount, setDiscountAmount] = useState(0);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const selectedTable = useSelector((state) => state.tables.selectedTable);
  const { tableList } = useSelector((state) => state.tables);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOrderLoading(true);

        // Fetch categories
        fetch('/categories/list')
          .then((res) => res.json())
          .then((data) => {
            console.log('Fetched Categories:', data); // In ra response để kiểm tra
            setCategories(data.categories || []); // Đảm bảo nó là mảng
          })
          .catch((error) => console.error('Error fetching categories:', error));

        // Fetch products based on filters
        const productsResponse = await APISERVICECASHIER.ApiProductInHome(
          search,
          currentPage,
          productPerPage,
          selectCategory
        );
        setProducts(productsResponse.data.product);
        setTotalPages(productsResponse.data.totalPages);

        // Fetch tables
        dispatch(fetchTables());
        const responeBill = await axios.get('/bills/all');
        setRecentOrders(responeBill.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
        setOrderLoading(false);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      }
    };
    fetchData();
  }, [search, selectCategory, currentPage, dispatch]);
  console.log(recentOrders);

  const handleTableSelect = (table) => {
    if (table.status === true) {
      dispatch(setSelectedTable(table._id));
      toast.success(`Đã chọn ${table.table_name}`);
    } else {
      toast.warning(`${table.table_name} đang không khả dụng`);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`Đã thêm ${product.pname} vào giỏ hàng`);
  };

  const handleRemoveFromCart = (_id) => {
    dispatch(removeFromCart(_id));
  };

  const handleQuantityChange = (_id, change) => {
    dispatch(updateQuantity({ _id, change }));
  };

  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  // const calculateTotal = () => {
  //   const subtotal = calculateTotalPrice();
  //   return subtotal - discountAmount;
  // };

  const handleCreateBill = async () => {
    try {
      setOrderLoading(true);
      if (!selectedTable) {
        toast.error('Vui lòng chọn bàn trước khi tạo đơn');
        setOrderLoading(false);
        return;
      }

      await dispatch(createBill({ cart, selectedTable, tableList, calculateTotalPrice })).unwrap();

      generatePDF(cart, selectedTable, note);

      // Clear cart after successful order

      setNote('');
      setDiscountAmount(0);
      setOrderLoading(false);
    } catch (error) {
      console.error('Lỗi khi tạo hóa đơn:', error);
    }
  };

  console.log(cart);

  return (
    <div className="h-min bg-gray-100 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* Main content - Responsive layout with overflow handling */}
      <main className="flex  md:flex-row flex-1 p-1 md:p-2 overflow-hidden">
        {/* Menu Section - Adaptive width based on screen size */}
        <section
          className={`flex-1 transition-all duration-300 mb-4 md:mb-0 overflow-auto ${
            isCartExpanded ? 'md:w-3/3 lg:w-3/4' : 'md:w-5/6'
          }`}
        >
          <MenuSection
            categories={categories}
            selectCategory={selectCategory}
            setSelectCategory={setSelectCategory}
            search={search}
            setSearch={setSearch}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
          {/* Products Display - Grid View - Responsive grid with smaller items */}
          <ProductList
            selectedView={selectedView}
            products={products}
            handleAddToCart={handleAddToCart}
            noResultsMessage={noResultsMessage}
          />

          {/* Pagination - Smaller and more compact on small screens */}
          {totalPages > 1 && (
            <Paging setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
          )}
          {/* Recent Orders Section - Responsive table with scroll */}
          <LastOrder recentOrders={recentOrders} />
        </section>

        {/* Cart Section - Responsive layout that displays correctly on all screen sizes */}
        <Cart
          isCartExpanded={isCartExpanded}
          tableList={tableList}
          selectedTable={selectedTable}
          handleTableSelect={handleTableSelect}
          cart={cart}
          handleCreateBill={handleCreateBill}
          handleQuantityChange={handleQuantityChange}
          handleRemoveFromCart={handleRemoveFromCart}
          note={note}
          setNote={setNote}
        />
      </main>
    </div>
  );
}
