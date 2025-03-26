import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { generatePDF } from './PayBills';
import { generateOrderPDF } from '../cashier-screen/printBill';
import { fetchTables, updateTablePosition } from '../../../store/table-slice/tableSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddProductModal from '../table-screen/AddProductModal';
import { updateBill } from '../../../store/bill-slice/billSlice';

import floorPlan from '../../../assets/img/planFloor.jpg';
import { useNavigate } from 'react-router-dom';

import CartOrder from './CartOrder';
import RenderTables from './RenderTables';
import FilterTable from './FilterTable';

export default function TableList() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectBill, setSelectBill] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [cashReal, setCashReal] = useState('');
  const [notes, setNotes] = useState('');
  const [splitBill, setSplitBill] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [zones, setZones] = useState(['Trong nhà', 'Ngoài trời', 'Tầng trên']);
  const [selectedZone, setSelectedZone] = useState('all');
  const dispatch = useDispatch();
  const [floorPlanImage, setFloorPlanImage] = useState(floorPlan);
  const navigate = useNavigate();

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
    window.handleTableClick = handleTableClick;
    return () => {
      delete window.handleTableClick;
    };
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
        const responseAdd = await axios.put(`/bills/add-products/${selectBill._id}`, { products });

        if (responseAdd.data.success) {
          const response = await axios.get(`/bills/table/${selectedTable._id}`);
          if (response.data) {
            setSelectBill(response.data);
            setSelectedTable({
              ...selectedTable,
              bill: response.data.product_list || [],
            });
          }
          const formattedProducts = products.map((p) => ({
            pname: p.nameP,
            price: p.priceP,
            quantity: p.quantityP,
          }));

          generateOrderPDF(formattedProducts, selectedTable.table_name, notes);
          toast.success('Đã thêm sản phẩm vào hóa đơn!');

          return responseAdd.data;
        } else {
          // Thông báo lỗi nếu không đủ nguyên liệu
          toast.error(responseAdd.data.message || 'Không đủ nguyên liệu để tạo hóa đơn!');
        }

      } else {
        toast.error('Không thể thêm sản phẩm! Vui lòng chọn bàn trước.');
      }
    } catch (error) {
      console.error('Error adding products:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm!';
      toast.error(errorMessage);
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

  const handleUpdateTablePosition = async (tableId, position) => {
    dispatch(updateTablePosition({ tableId, position }));
  };
  const { occupiedTables, availableTables } = getTableStatistics();

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
            <FilterTable
              searchText={searchText}
              setFilterStatus={setFilterStatus}
              setSearchText={setSearchText}
              setSelectedZone={setSelectedZone}
              zones={zones}
              setViewMode={setViewMode}
              viewMode={viewMode}
            />
            {/* Thống kê nhanh */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">Bàn đang dùng: {occupiedTables}</span>
              <span className="text-sm text-gray-600 ml-4">Bàn trống: {availableTables}</span>
            </div>

            {/* Danh sách bàn */}
            <RenderTables
              viewMode={viewMode}
              filteredTables={filteredTables}
              handleOpenModal={handleOpenModal}
              handleTableClick={handleTableClick}
              floorPlanImage={floorPlanImage}
              handleUpdateTablePosition={handleUpdateTablePosition}
            />
          </section>

          {/* Phần Giỏ hàng */}
          <CartOrder
            selectedTable={selectedTable}
            handleChange={handleChange}
            handleDiscountChange={handleDiscountChange}
            handleNoteChange={handleNoteChange}
            notes={notes}
            handleOpenModal={handleOpenModal}
            discount={discount}
            paymentMethod={paymentMethod}
            cashReal={cashReal}
            setCashReal={setCashReal}
            totalCost={totalCost}
            handleUpdateBill={handleUpdateBill}
            handleSplitBill={handleSplitBill}
            splitBill={splitBill}
          />
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
