// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import { generatePDF } from './PayBills';
// import { fetchTables } from '../../../store/table-slice/tableSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import AddProductModal from '../table-screen/AddProductModal';
// import { updateBill } from '../../../store/bill-slice/billSlice';

// export default function TableList() {
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [selectBill, setSelectBill] = useState(null);
//   const [discount, setDiscount] = useState(0);
//   const [totalCost, setTotalCost] = useState(0);
//   const [cashReal, setCashReal] = useState('');
//   const dispatch = useDispatch();

//   const { tableList } = useSelector((state) => state.tables);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const loadData = async () => {
//     try {
//       dispatch(fetchTables());
//       // const responseBill = await axios.get('/bills');
//       // setBillList(responseBill.data);
//     } catch (error) {
//       console.error('Error loading:', error);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);
//   /////////code lại đoạn naỳ
//   useEffect(() => {
//     if (selectedTable) {
//       // Tính tổng tiền ban đầu
//       const subtotal = selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0);
//       const discountValue = discount || 0; // Sử dụng 0 nếu không có giảm giá
//       // Tính tổng tiền sau khi giảm giá
//       const discountedTotal = subtotal * ((100 - discountValue) / 100);
//       setTotalCost(discountedTotal);
//     }
//   }, [selectedTable, discount]);
//   ////// cho vào redux
//   console.log(cashReal);

//   const handleTableClick = async (table) => {
//     try {
//       if (!table.status) {
//         const response = await axios.get(`/bills/table/${table._id}`);
//         if (response.data) {
//           setSelectBill(response.data);
//           setSelectedTable({
//             ...table,
//             bill: response.data.product_list || [], // Đảm bảo sử dụng đúng key từ API
//           });
//         } else {
//           toast.error('Không tìm thấy hóa đơn cho bàn này');
//         }
//         setPaymentMethod('');
//       } else {
//         setSelectedTable(null);
//         setSelectBill(null);
//       }
//     } catch (error) {
//       console.error('Error fetching bill:', error);
//       toast.error('Lỗi khi tải thông tin hóa đơn!');
//     }
//   };

//   const handleChange = (event) => {
//     setPaymentMethod(event.target.value);
//   };

//   const handleDiscountChange = (event) => {
//     const value = event.target.value;

//     if (value === '') {
//       setDiscount(0);
//       return;
//     }

//     const parsedValue = parseFloat(value);

//     if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
//       toast.error('Vui lòng nhập từ 0 - 100');
//     } else {
//       setDiscount(parsedValue); // Đặt giảm giá nếu hợp lệ
//     }
//   };
//   //////cho vào redux
//   const handleUpdateBill = async () => {
//     try {
//       if (selectedTable && paymentMethod && selectBill) {
//         const billUpdateData = {
//           payment: paymentMethod,
//           status: 1,
//           table_id: selectedTable._id,
//           discount: discount || 0, // Sử dụng 0 nếu không có giảm giá
//           totalCost: totalCost || selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0),
//         };

//         const { data: updatedBill } = await axios.put(`/bills/update/${selectBill._id}`, billUpdateData);

//         // Xuất hóa đơn PDF sau khi thanh toán
//         // generatePDF(selectBill, paymentMethod, selectedTable, discount, totalCost, cashReal);
//         generatePDF(updatedBill.bill, cashReal);
//         console.log(updatedBill, 'bill print');

//         await loadData();

//         toast.success('Thanh toán thành công!');
//         setSelectedTable(null);
//         setSelectBill(null);
//         setPaymentMethod('');
//         setDiscount(0);
//         setCashReal('');
//       } else {
//         toast.error('Vui lòng chọn phương thức thanh toán!');
//       }
//     } catch (error) {
//       console.error('Error updating bill:', error);
//       toast.error('Có lỗi xảy ra khi thanh toán!');
//     }
//   };
//   console.log(updateBill);

//   const handleOpenModal = (tableId) => {
//     // Chỉ mở modal khi đã có bàn được chọn
//     if (selectedTable || tableId) {
//       // Nếu được truyền tableId cụ thể, tìm bàn đó và cập nhật state
//       if (tableId && (!selectedTable || selectedTable._id !== tableId)) {
//         const table = tableList.find((t) => t._id === tableId);
//         if (table) {
//           handleTableClick(table);
//         }
//       }
//       setIsModalOpen(true);
//     } else {
//       toast.error('Vui lòng chọn bàn trước khi thêm sản phẩm!');
//     }
//   };

//   // Đóng modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   // Xử lý khi thêm sản phẩm từ modal cho vapof redux
//   const handleAddProducts = async (products) => {
//     try {
//       if (selectBill && products.length > 0) {
//         // Gọi API để thêm nhiều sản phẩm vào hóa đơn
//         await axios.put(`/bills/add-products/${selectBill._id}`, { products });

//         // Cập nhật lại dữ liệu sau khi thêm
//         toast.success('Đã thêm sản phẩm vào hóa đơn!');

//         // Refresh bill data
//         const response = await axios.get(`/bills/table/${selectedTable._id}`);
//         if (response.data) {
//           setSelectBill(response.data);
//           setSelectedTable({
//             ...selectedTable,
//             bill: response.data.product_list || [], // Đảm bảo sử dụng đúng key từ API
//           });
//         }
//       } else {
//         toast.error('Không thể thêm sản phẩm! Vui lòng chọn bàn trước.');
//       }
//     } catch (error) {
//       console.error('Error adding products:', error);
//       toast.error('Có lỗi xảy ra khi thêm sản phẩm!');
//     }
//   };

//   return (
//     <div className="flex flex-col h-min bg-gray-100">
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         pauseOnFocusLoss
//       />

//       <main className="flex flex-1">
//         <div className="flex space-x-6 p-4 w-full">
//           {/* Phần Menu */}
//           <section className="flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
//                 Danh sách bàn
//               </h1>
//             </div>

//             {/* Danh sách bàn */}
//             <div className="grid grid-cols-5 gap-4 p-4">
//               {tableList.map((table) => (
//                 <div
//                   key={table._id}
//                   className="bg-white rounded-lg shadow p-4 h-40 w-32 flex flex-col items-center justify-between cursor-pointer"
//                   style={{
//                     backgroundColor: table.status === true ? '#dcfce7' : '#fee2e2',
//                   }}
//                 >
//                   <div onClick={() => handleTableClick(table)} className="text-center w-full">
//                     <h3 className="font-bold text-xl">{table.table_name}</h3>
//                     <p className="text-sm">Số ghế: {table.number_of_chair}</p>
//                     <p className={`text-xs font-semibold ${table.status === true ? 'text-green-500' : 'text-red-500'}`}>
//                       {table.status === true ? 'Đang trống' : 'Đang có khách'}
//                     </p>
//                   </div>

//                   {!table.status && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenModal(table._id);
//                       }}
//                       className="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
//                     >
//                       Gọi thêm
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Phần Giỏ hàng */}
//           <section className="w-1/3 bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-6">Hóa đơn thanh toán</h2>

//             {selectedTable ? (
//               <div>
//                 <div className="mb-4 text-lg font-medium">Bàn: {selectedTable.table_name}</div>

//                 {selectedTable.bill && selectedTable.bill.length > 0 ? (
//                   <table className="w-full text-left mb-6">
//                     <thead>
//                       <tr>
//                         <th className="border-b py-2">Sản phẩm</th>
//                         <th className="border-b py-2">Hình ảnh</th>
//                         <th className="border-b py-2">Giá</th>
//                         <th className="border-b py-2">Số lượng</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedTable.bill.map((item, index) => (
//                         <tr key={index}>
//                           <td className="py-2">{item.nameP}</td>
//                           <td className="py-2">
//                             <img className="w-12 h-12 border-spacing-1" src={item.imageP} alt={item.nameP} />
//                           </td>
//                           <td className="py-2">{item.priceP ? item.priceP.toLocaleString() : '0'} VND</td>
//                           <td className="py-2">{item.quantityP}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="text-center mb-4">Chưa có sản phẩm trong hóa đơn</p>
//                 )}

//                 {/* Nút thêm đồ uống */}
//                 <button
//                   onClick={() => handleOpenModal(selectedTable._id)}
//                   className="w-full mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 font-semibold transition duration-200"
//                 >
//                   Thêm đồ uống
//                 </button>

//                 {/* Input giảm giá */}
//                 <div className="mb-4">
//                   <label htmlFor="discount" className="font-semibold">
//                     Khuyến mãi (%):
//                   </label>
//                   <input
//                     type="text"
//                     id="discount"
//                     value={discount === 0 ? '' : discount}
//                     onChange={handleDiscountChange}
//                     className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
//                     placeholder="Nhập khuyến mãi"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-lg font-semibold">Tổng tiền:</span>
//                   <span className="text-lg font-semibold">
//                     {(
//                       selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0) *
//                       ((100 - discount) / 100)
//                     ).toLocaleString()}{' '}
//                     VND
//                   </span>
//                 </div>

//                 {/* Chọn phương thức thanh toán */}
//                 <div className="mb-4">
//                   <h4 className="font-semibold mb-2">Chọn phương thức thanh toán:</h4>
//                   <div className="flex items-center space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         id="cash"
//                         value="cash"
//                         checked={paymentMethod === 'cash'}
//                         onChange={handleChange}
//                         className="mr-2"
//                       />
//                       Tiền mặt
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         id="transfer"
//                         value="transfer"
//                         checked={paymentMethod === 'transfer'}
//                         onChange={handleChange}
//                         className="mr-2"
//                       />
//                       Chuyển khoản
//                     </label>
//                   </div>
//                 </div>

//                 {/* Giao diện phương thức thanh toán */}
//                 <div className="mt-4">
//                   {paymentMethod === 'cash' && (
//                     <div className="p-4 bg-gray-100 rounded-md shadow-md ">
//                       <input
//                         type="number"
//                         value={cashReal}
//                         id="cashreal"
//                         onChange={(e) => setCashReal(e.target.value)}
//                         className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
//                         placeholder="Tiền mặt khách đưa"
//                       />
//                       <h5 className="text-lg font-bold">
//                         Số tiền trả lại:{' '}
//                         {isNaN(parseFloat(cashReal) - totalCost)
//                           ? '0'
//                           : (parseFloat(cashReal) - totalCost).toLocaleString()}{' '}
//                         VND
//                       </h5>

//                       <h4 className="text-lg font-bold text-center">Thanh toán bằng tiền mặt</h4>
//                       <p className="text-center">Vui lòng thanh toán trực tiếp khi nhận hàng.</p>
//                     </div>
//                   )}

//                   {paymentMethod === 'transfer' && (
//                     <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
//                       <h4 className="text-lg font-bold">Quét mã QR để thanh toán</h4>
//                       <img
//                         src={require('../../../assets/images/maqr.jpg')}
//                         alt="QR Code"
//                         className="mx-auto mt-2 w-40 h-100"
//                       />
//                       <p className="mt-2 text-sm text-gray-600">Sử dụng ứng dụng ngân hàng để quét mã.</p>
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleUpdateBill}
//                   className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-orange-400 font-bold mt-4"
//                   disabled={!paymentMethod}
//                 >
//                   Xác nhận thanh toán & Xuất hóa đơn
//                 </button>
//               </div>
//             ) : (
//               <p className="text-center text-gray-500">Vui lòng chọn bàn để xem hóa đơn</p>
//             )}
//           </section>
//         </div>
//       </main>

//       {/* Modal thêm sản phẩm */}
//       {selectedTable && (
//         <AddProductModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           selectTB={selectedTable}
//           onAddProduct={handleAddProducts}
//         />
//       )}
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import { generatePDF } from './PayBills';
// import { fetchTables } from '../../../store/table-slice/tableSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import AddProductModal from '../table-screen/AddProductModal';
// import { updateBill } from '../../../store/bill-slice/billSlice';
// import { Table, Input, Button, Radio, Modal, Select } from 'antd';
// import { SearchOutlined, MergeCellsOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// const { Option } = Select;

// export default function TableList() {
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [selectBill, setSelectBill] = useState(null);
//   const [discount, setDiscount] = useState(0);
//   const [totalCost, setTotalCost] = useState(0);
//   const [cashReal, setCashReal] = useState('');
//   const [notes, setNotes] = useState({});
//   const [splitBill, setSplitBill] = useState(false);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchText, setSearchText] = useState('');
//   const [viewMode, setViewMode] = useState('grid');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { tableList } = useSelector((state) => state.tables);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const loadData = async () => {
//     try {
//       dispatch(fetchTables());
//     } catch (error) {
//       console.error('Error loading:', error);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (selectedTable) {
//       const subtotal = selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0);
//       const discountValue = discount || 0;
//       const discountedTotal = subtotal * ((100 - discountValue) / 100);
//       setTotalCost(discountedTotal);
//     }
//   }, [selectedTable, discount]);

//   const handleTableClick = async (table) => {
//     try {
//       if (!table.status) {
//         const response = await axios.get(`/bills/table/${table._id}`);
//         if (response.data) {
//           setSelectBill(response.data);
//           setSelectedTable({
//             ...table,
//             bill: response.data.product_list || [],
//           });
//         } else {
//           toast.error('Không tìm thấy hóa đơn cho bàn này');
//         }
//         setPaymentMethod('');
//       } else {
//         setSelectedTable(null);
//         setSelectBill(null);
//       }
//     } catch (error) {
//       console.error('Error fetching bill:', error);
//       toast.error('Lỗi khi tải thông tin hóa đơn!');
//     }
//   };

//   const handleChange = (event) => {
//     setPaymentMethod(event.target.value);
//   };

//   const handleDiscountChange = (event) => {
//     const value = event.target.value;
//     if (value === '') {
//       setDiscount(0);
//       return;
//     }
//     const parsedValue = parseFloat(value);
//     if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
//       toast.error('Vui lòng nhập từ 0 - 100');
//     } else {
//       setDiscount(parsedValue);
//     }
//   };

//   const handleUpdateBill = async () => {
//     try {
//       if (selectedTable && paymentMethod && selectBill) {
//         const billUpdateData = {
//           payment: paymentMethod,
//           status: 1,
//           table_id: selectedTable._id,
//           discount: discount || 0,
//           totalCost: totalCost || selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0),
//         };

//         const { data: updatedBill } = await axios.put(`/bills/update/${selectBill._id}`, billUpdateData);
//         generatePDF(updatedBill.bill, cashReal);
//         await loadData();
//         toast.success('Thanh toán thành công!');
//         setSelectedTable(null);
//         setSelectBill(null);
//         setPaymentMethod('');
//         setDiscount(0);
//         setCashReal('');
//       } else {
//         toast.error('Vui lòng chọn phương thức thanh toán!');
//       }
//     } catch (error) {
//       console.error('Error updating bill:', error);
//       toast.error('Có lỗi xảy ra khi thanh toán!');
//     }
//   };

//   const handleOpenModal = (tableId) => {
//     if (selectedTable || tableId) {
//       if (tableId && (!selectedTable || selectedTable._id !== tableId)) {
//         const table = tableList.find((t) => t._id === tableId);
//         if (table) {
//           handleTableClick(table);
//         }
//       }
//       setIsModalOpen(true);
//     } else {
//       toast.error('Vui lòng chọn bàn trước khi thêm sản phẩm!');
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleAddProducts = async (products) => {
//     try {
//       if (selectBill && products.length > 0) {
//         await axios.put(`/bills/add-products/${selectBill._id}`, { products });
//         toast.success('Đã thêm sản phẩm vào hóa đơn!');
//         const response = await axios.get(`/bills/table/${selectedTable._id}`);
//         if (response.data) {
//           setSelectBill(response.data);
//           setSelectedTable({
//             ...selectedTable,
//             bill: response.data.product_list || [],
//           });
//         }
//       } else {
//         toast.error('Không thể thêm sản phẩm! Vui lòng chọn bàn trước.');
//       }
//     } catch (error) {
//       console.error('Error adding products:', error);
//       toast.error('Có lỗi xảy ra khi thêm sản phẩm!');
//     }
//   };

//   const handleNoteChange = (itemId, note) => {
//     setNotes({ ...notes, [itemId]: note });
//   };

//   const handleSplitBill = () => {
//     setSplitBill(!splitBill);
//   };

//   const filteredTables = tableList.filter((table) => {
//     const matchesStatus = filterStatus === 'all' || table.status === (filterStatus === 'available');
//     const matchesSearch = table.table_name.toLowerCase().includes(searchText.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   const getTableStatistics = () => {
//     const occupiedTables = tableList.filter((table) => !table.status).length;
//     const availableTables = tableList.length - occupiedTables;
//     return { occupiedTables, availableTables };
//   };

//   const { occupiedTables, availableTables } = getTableStatistics();

//   return (
//     <div className="flex flex-col h-min bg-gray-100">
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         pauseOnFocusLoss
//       />

//       <main className="flex flex-1">
//         <div className="flex space-x-6 p-4 w-full">
//           {/* Phần Menu */}
//           <section className="flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
//                 Danh sách bàn
//               </h1>
//               <div className="flex items-center space-x-4">
//                 <Input
//                   placeholder="Tìm kiếm bàn"
//                   prefix={<SearchOutlined />}
//                   value={searchText}
//                   onChange={(e) => setSearchText(e.target.value)}
//                 />
//                 <Select defaultValue="all" style={{ width: 120 }} onChange={(value) => setFilterStatus(value)}>
//                   <Option value="all">Tất cả</Option>
//                   <Option value="available">Trống</Option>
//                   <Option value="occupied">Đang dùng</Option>
//                 </Select>
//                 <Button onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}>
//                   {viewMode === 'grid' ? 'Xem sơ đồ' : 'Xem lưới'}
//                 </Button>
//                 <Button onClick={() => navigate('/cashier/tableList/managerTable')}>Quản lý bàn</Button>
//               </div>
//             </div>

//             {/* Thống kê nhanh */}
//             <div className="mb-4">
//               <span className="text-sm text-gray-600">Bàn đang dùng: {occupiedTables}</span>
//               <span className="text-sm text-gray-600 ml-4">Bàn trống: {availableTables}</span>
//             </div>

//             {/* Danh sách bàn */}
//             <div className={`grid ${viewMode === 'grid' ? 'grid-cols-5' : 'grid-cols-3'} gap-4 p-4`}>
//               {filteredTables.map((table) => (
//                 <div
//                   key={table._id}
//                   className="bg-white rounded-lg shadow p-4 h-40 w-32 flex flex-col items-center justify-between cursor-pointer"
//                   style={{
//                     backgroundColor: table.status === true ? '#dcfce7' : '#fee2e2',
//                   }}
//                 >
//                   <div onClick={() => handleTableClick(table)} className="text-center w-full">
//                     <h3 className="font-bold text-xl">{table.table_name}</h3>
//                     <p className="text-sm">Số ghế: {table.number_of_chair}</p>
//                     <p className={`text-xs font-semibold ${table.status === true ? 'text-green-500' : 'text-red-500'}`}>
//                       {table.status === true ? 'Đang trống' : 'Đang có khách'}
//                     </p>
//                     {!table.status && (
//                       <p className="text-xs text-gray-500">
//                         Thời gian: {new Date(table).toLocaleTimeString() || 'trống'}
//                       </p>
//                     )}
//                   </div>

//                   {!table.status && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenModal(table._id);
//                       }}
//                       className="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
//                     >
//                       Gọi thêm
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Phần Giỏ hàng */}
//           <section className="w-1/3 bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-6">Hóa đơn thanh toán</h2>

//             {selectedTable ? (
//               <div>
//                 <div className="mb-4 text-lg font-medium">Bàn: {selectedTable.table_name}</div>

//                 {selectedTable.bill && selectedTable.bill.length > 0 ? (
//                   <table className="w-full text-left mb-6">
//                     <thead>
//                       <tr>
//                         <th className="border-b py-2">Sản phẩm</th>
//                         <th className="border-b py-2">Hình ảnh</th>
//                         <th className="border-b py-2">Giá</th>
//                         <th className="border-b py-2">Số lượng</th>
//                         <th className="border-b py-2">Ghi chú</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedTable.bill.map((item, index) => (
//                         <tr key={index}>
//                           <td className="py-2">{item.nameP}</td>
//                           <td className="py-2">
//                             <img className="w-12 h-12 border-spacing-1" src={item.imageP} alt={item.nameP} />
//                           </td>
//                           <td className="py-2">{item.priceP ? item.priceP.toLocaleString() : '0'} VND</td>
//                           <td className="py-2">{item.quantityP}</td>
//                           <td className="py-2">
//                             <Input
//                               value={notes[item._id] || ''}
//                               onChange={(e) => handleNoteChange(item._id, e.target.value)}
//                               placeholder="Ghi chú"
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="text-center mb-4">Chưa có sản phẩm trong hóa đơn</p>
//                 )}

//                 {/* Nút thêm đồ uống */}
//                 <button
//                   onClick={() => handleOpenModal(selectedTable._id)}
//                   className="w-full mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 font-semibold transition duration-200"
//                 >
//                   Thêm đồ uống
//                 </button>

//                 {/* Input giảm giá */}
//                 <div className="mb-4">
//                   <label htmlFor="discount" className="font-semibold">
//                     Khuyến mãi (%):
//                   </label>
//                   <input
//                     type="text"
//                     id="discount"
//                     value={discount === 0 ? '' : discount}
//                     onChange={handleDiscountChange}
//                     className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
//                     placeholder="Nhập khuyến mãi"
//                   />
//                 </div>

//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-lg font-semibold">Tổng tiền:</span>
//                   <span className="text-lg font-semibold">
//                     {(
//                       selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0) *
//                       ((100 - discount) / 100)
//                     ).toLocaleString()}{' '}
//                     VND
//                   </span>
//                 </div>

//                 {/* Chọn phương thức thanh toán */}
//                 <div className="mb-4">
//                   <h4 className="font-semibold mb-2">Chọn phương thức thanh toán:</h4>
//                   <div className="flex items-center space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         id="cash"
//                         value="cash"
//                         checked={paymentMethod === 'cash'}
//                         onChange={handleChange}
//                         className="mr-2"
//                       />
//                       Tiền mặt
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         id="transfer"
//                         value="transfer"
//                         checked={paymentMethod === 'transfer'}
//                         onChange={handleChange}
//                         className="mr-2"
//                       />
//                       Chuyển khoản
//                     </label>
//                   </div>
//                 </div>

//                 {/* Giao diện phương thức thanh toán */}
//                 <div className="mt-4">
//                   {paymentMethod === 'cash' && (
//                     <div className="p-4 bg-gray-100 rounded-md shadow-md ">
//                       <input
//                         type="number"
//                         value={cashReal}
//                         id="cashreal"
//                         onChange={(e) => setCashReal(e.target.value)}
//                         className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
//                         placeholder="Tiền mặt khách đưa"
//                       />
//                       <h5 className="text-lg font-bold">
//                         Số tiền trả lại:{' '}
//                         {isNaN(parseFloat(cashReal) - totalCost)
//                           ? '0'
//                           : (parseFloat(cashReal) - totalCost).toLocaleString()}{' '}
//                         VND
//                       </h5>

//                       <h4 className="text-lg font-bold text-center">Thanh toán bằng tiền mặt</h4>
//                       <p className="text-center">Vui lòng thanh toán trực tiếp khi nhận hàng.</p>
//                     </div>
//                   )}

//                   {paymentMethod === 'transfer' && (
//                     <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
//                       <h4 className="text-lg font-bold">Quét mã QR để thanh toán</h4>
//                       <img
//                         src={require('../../../assets/images/maqr.jpg')}
//                         alt="QR Code"
//                         className="mx-auto mt-2 w-40 h-100"
//                       />
//                       <p className="mt-2 text-sm text-gray-600">Sử dụng ứng dụng ngân hàng để quét mã.</p>
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleUpdateBill}
//                   className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-orange-400 font-bold mt-4"
//                   disabled={!paymentMethod}
//                 >
//                   Xác nhận thanh toán & Xuất hóa đơn
//                 </button>

//                 {/* Tách hóa đơn */}
//                 <button
//                   onClick={handleSplitBill}
//                   className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 font-bold mt-4"
//                 >
//                   {splitBill ? 'Hủy tách hóa đơn' : 'Tách hóa đơn'}
//                 </button>
//               </div>
//             ) : (
//               <p className="text-center text-gray-500">Vui lòng chọn bàn để xem hóa đơn</p>
//             )}
//           </section>
//         </div>
//       </main>

//       {/* Modal thêm sản phẩm */}
//       {selectedTable && (
//         <AddProductModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           selectTB={selectedTable}
//           onAddProduct={handleAddProducts}
//         />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { generatePDF } from './PayBills';
import { fetchTables } from '../../../store/table-slice/tableSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddProductModal from '../table-screen/AddProductModal';
import { updateBill } from '../../../store/bill-slice/billSlice';
import { Table, Input, Button, Radio, Modal, Select, Tabs } from 'antd';
import { SearchOutlined, MergeCellsOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ReactFlow, { Controls } from 'react-flow-renderer';

const { Option } = Select;
const { TabPane } = Tabs;

export default function TableList() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectBill, setSelectBill] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [cashReal, setCashReal] = useState('');
  const [notes, setNotes] = useState({});
  const [splitBill, setSplitBill] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [zones, setZones] = useState(['Trong nhà', 'Ngoài trời', 'Tầng trên']);
  const [selectedZone, setSelectedZone] = useState('all');
  const dispatch = useDispatch();

  const { tableList } = useSelector((state) => state.tables);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      dispatch(fetchTables());
    } catch (error) {
      console.error('Error loading:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      const subtotal = selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0);
      const discountValue = discount || 0;
      const discountedTotal = subtotal * ((100 - discountValue) / 100);
      setTotalCost(discountedTotal);
    }
  }, [selectedTable, discount]);

  const handleTableClick = async (table) => {
    try {
      if (!table.status) {
        const response = await axios.get(`/bills/table/${table._id}`);
        if (response.data) {
          setSelectBill(response.data);
          setSelectedTable({
            ...table,
            bill: response.data.product_list || [],
          });
        } else {
          toast.error('Không tìm thấy hóa đơn cho bàn này');
        }
        setPaymentMethod('');
      } else {
        setSelectedTable(null);
        setSelectBill(null);
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      toast.error('Lỗi khi tải thông tin hóa đơn!');
    }
  };

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleDiscountChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      setDiscount(0);
      return;
    }
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      toast.error('Vui lòng nhập từ 0 - 100');
    } else {
      setDiscount(parsedValue);
    }
  };

  const handleUpdateBill = async () => {
    try {
      if (selectedTable && paymentMethod && selectBill) {
        const billUpdateData = {
          payment: paymentMethod,
          status: 1,
          table_id: selectedTable._id,
          discount: discount || 0,
          totalCost: totalCost || selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0),
        };

        const { data: updatedBill } = await axios.put(`/bills/update/${selectBill._id}`, billUpdateData);
        generatePDF(updatedBill.bill, cashReal);
        await loadData();
        toast.success('Thanh toán thành công!');
        setSelectedTable(null);
        setSelectBill(null);
        setPaymentMethod('');
        setDiscount(0);
        setCashReal('');
      } else {
        toast.error('Vui lòng chọn phương thức thanh toán!');
      }
    } catch (error) {
      console.error('Error updating bill:', error);
      toast.error('Có lỗi xảy ra khi thanh toán!');
    }
  };

  const handleOpenModal = (tableId) => {
    if (selectedTable || tableId) {
      if (tableId && (!selectedTable || selectedTable._id !== tableId)) {
        const table = tableList.find((t) => t._id === tableId);
        if (table) {
          handleTableClick(table);
        }
      }
      setIsModalOpen(true);
    } else {
      toast.error('Vui lòng chọn bàn trước khi thêm sản phẩm!');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProducts = async (products) => {
    try {
      if (selectBill && products.length > 0) {
        await axios.put(`/bills/add-products/${selectBill._id}`, { products });
        toast.success('Đã thêm sản phẩm vào hóa đơn!');
        const response = await axios.get(`/bills/table/${selectedTable._id}`);
        if (response.data) {
          setSelectBill(response.data);
          setSelectedTable({
            ...selectedTable,
            bill: response.data.product_list || [],
          });
        }
      } else {
        toast.error('Không thể thêm sản phẩm! Vui lòng chọn bàn trước.');
      }
    } catch (error) {
      console.error('Error adding products:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm!');
    }
  };

  const handleNoteChange = (itemId, note) => {
    setNotes({ ...notes, [itemId]: note });
  };

  const handleSplitBill = () => {
    setSplitBill(!splitBill);
  };

  const filteredTables = tableList.filter((table) => {
    const matchesStatus = filterStatus === 'all' || table.status === (filterStatus === 'available');
    const matchesSearch = table.table_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesZone = selectedZone === 'all' || table.zone === selectedZone;
    return matchesStatus && matchesSearch && matchesZone;
  });

  const getTableStatistics = () => {
    const occupiedTables = tableList.filter((table) => !table.status).length;
    const availableTables = tableList.length - occupiedTables;
    return { occupiedTables, availableTables };
  };

  const { occupiedTables, availableTables } = getTableStatistics();

  const renderTables = () => {
    if (viewMode === 'grid') {
      return (
        <div className={`grid grid-cols-5 gap-4 p-4`}>
          {filteredTables.map((table) => (
            <div
              key={table._id}
              className="bg-white rounded-lg shadow p-4 h-40 w-32 flex flex-col items-center justify-between cursor-pointer"
              style={{
                backgroundColor: table.status === true ? '#dcfce7' : '#fee2e2',
              }}
              onClick={() => handleTableClick(table)}
            >
              <div className="text-center w-full">
                <h3 className="font-bold text-xl">{table.table_name}</h3>
                <p className="text-sm">Số ghế: {table.number_of_chair}</p>
                <p className={`text-xs font-semibold ${table.status === true ? 'text-green-500' : 'text-red-500'}`}>
                  {table.status === true ? 'Đang trống' : 'Đang có khách'}
                </p>
                {!table.status && (
                  <p className="text-xs text-gray-500">Thời gian: {new Date(table.startTime).toLocaleTimeString()}</p>
                )}
              </div>

              {!table.status && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(table._id);
                  }}
                  className="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                >
                  Gọi thêm
                </button>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="p-4">
          <ReactFlow
            elements={filteredTables.map((table) => ({
              id: table._id,
              type: 'default',
              data: { label: table.table_name },
              position: { x: table.x, y: table.y },
            }))}
          >
            <Controls />
          </ReactFlow>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-min bg-gray-100">
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
        <div className="flex space-x-6 p-4 w-full">
          {/* Phần Menu */}
          <section className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
                Danh sách bàn
              </h1>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Tìm kiếm bàn"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select defaultValue="all" style={{ width: 120 }} onChange={(value) => setFilterStatus(value)}>
                  <Option value="all">Tất cả</Option>
                  <Option value="available">Trống</Option>
                  <Option value="occupied">Đang dùng</Option>
                </Select>
                <Select defaultValue="all" style={{ width: 120 }} onChange={(value) => setSelectedZone(value)}>
                  <Option value="all">Tất cả khu vực</Option>
                  {zones.map((zone) => (
                    <Option key={zone} value={zone}>
                      {zone}
                    </Option>
                  ))}
                </Select>
                <Button onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}>
                  {viewMode === 'grid' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
                </Button>
              </div>
            </div>

            {/* Thống kê nhanh */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">Bàn đang dùng: {occupiedTables}</span>
              <span className="text-sm text-gray-600 ml-4">Bàn trống: {availableTables}</span>
            </div>

            {/* Danh sách bàn */}
            {renderTables()}
          </section>

          {/* Phần Giỏ hàng */}
          <section className="w-1/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Hóa đơn thanh toán</h2>

            {selectedTable ? (
              <div>
                <div className="mb-4 text-lg font-medium">Bàn: {selectedTable.table_name}</div>

                {selectedTable.bill && selectedTable.bill.length > 0 ? (
                  <table className="w-full text-left mb-6">
                    <thead>
                      <tr>
                        <th className="border-b py-2">Sản phẩm</th>
                        <th className="border-b py-2">Hình ảnh</th>
                        <th className="border-b py-2">Giá</th>
                        <th className="border-b py-2">Số lượng</th>
                        <th className="border-b py-2">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTable.bill.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2">{item.nameP}</td>
                          <td className="py-2">
                            <img className="w-12 h-12 border-spacing-1" src={item.imageP} alt={item.nameP} />
                          </td>
                          <td className="py-2">{item.priceP ? item.priceP.toLocaleString() : '0'} VND</td>
                          <td className="py-2">{item.quantityP}</td>
                          <td className="py-2">
                            <Input
                              value={notes[item._id] || ''}
                              onChange={(e) => handleNoteChange(item._id, e.target.value)}
                              placeholder="Ghi chú"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center mb-4">Chưa có sản phẩm trong hóa đơn</p>
                )}

                {/* Nút thêm đồ uống */}
                <button
                  onClick={() => handleOpenModal(selectedTable._id)}
                  className="w-full mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 font-semibold transition duration-200"
                >
                  Thêm đồ uống
                </button>

                {/* Input giảm giá */}
                <div className="mb-4">
                  <label htmlFor="discount" className="font-semibold">
                    Khuyến mãi (%):
                  </label>
                  <input
                    type="text"
                    id="discount"
                    value={discount === 0 ? '' : discount}
                    onChange={handleDiscountChange}
                    className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
                    placeholder="Nhập khuyến mãi"
                  />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Tổng tiền:</span>
                  <span className="text-lg font-semibold">
                    {(
                      selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0) *
                      ((100 - discount) / 100)
                    ).toLocaleString()}{' '}
                    VND
                  </span>
                </div>

                {/* Chọn phương thức thanh toán */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Chọn phương thức thanh toán:</h4>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Tiền mặt
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        id="transfer"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Chuyển khoản
                    </label>
                  </div>
                </div>

                {/* Giao diện phương thức thanh toán */}
                <div className="mt-4">
                  {paymentMethod === 'cash' && (
                    <div className="p-4 bg-gray-100 rounded-md shadow-md ">
                      <input
                        type="number"
                        value={cashReal}
                        id="cashreal"
                        onChange={(e) => setCashReal(e.target.value)}
                        className="w-full mt-2 py-2 px-3 border border-gray-300 rounded"
                        placeholder="Tiền mặt khách đưa"
                      />
                      <h5 className="text-lg font-bold">
                        Số tiền trả lại:{' '}
                        {isNaN(parseFloat(cashReal) - totalCost)
                          ? '0'
                          : (parseFloat(cashReal) - totalCost).toLocaleString()}{' '}
                        VND
                      </h5>

                      <h4 className="text-lg font-bold text-center">Thanh toán bằng tiền mặt</h4>
                      <p className="text-center">Vui lòng thanh toán trực tiếp khi nhận hàng.</p>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
                      <h4 className="text-lg font-bold">Quét mã QR để thanh toán</h4>
                      <img
                        src={require('../../../assets/images/maqr.jpg')}
                        alt="QR Code"
                        className="mx-auto mt-2 w-40 h-100"
                      />
                      <p className="mt-2 text-sm text-gray-600">Sử dụng ứng dụng ngân hàng để quét mã.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUpdateBill}
                  className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-orange-400 font-bold mt-4"
                  disabled={!paymentMethod}
                >
                  Xác nhận thanh toán & Xuất hóa đơn
                </button>

                {/* Tách hóa đơn */}
                <button
                  onClick={handleSplitBill}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 font-bold mt-4"
                >
                  {splitBill ? 'Hủy tách hóa đơn' : 'Tách hóa đơn'}
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500">Vui lòng chọn bàn để xem hóa đơn</p>
            )}
          </section>
        </div>
      </main>

      {/* Modal thêm sản phẩm */}
      {selectedTable && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectTB={selectedTable}
          onAddProduct={handleAddProducts}
        />
      )}
    </div>
  );
}
