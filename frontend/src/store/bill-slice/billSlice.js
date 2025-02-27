import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { clearCart } from '../cart-slice/cartSlice';
import { clearSelectedTable, updateTableStatus } from '../table-slice/tableSlice';
import APISERVICEBILL from '../../services/api-bill';

// **Tạo hóa đơn mới**
export const createBill = createAsyncThunk(
  'bills/createBill',
  async ({ cart, selectedTable, calculateTotalPrice }, { dispatch, rejectWithValue }) => {
    try {
      if (!selectedTable) {
        toast.error('Vui lòng chọn bàn trước khi tạo hóa đơn!');
        return rejectWithValue('Vui lòng chọn bàn!');
      }

      const billData = {
        total_cost: calculateTotalPrice(),
        table_id: selectedTable, // selectedTable bây giờ là _id của bàn
        product_list: cart.map((item) => ({
          productId: item._id,
          nameP: item.pname,
          imageP: item.image,
          priceP: item.sale_price,
          quantityP: item.quantity,
          total: item.total,
        })),
        payment: null,
        status: 0,
        discount: 0,
      };

      const response = await APISERVICEBILL.ApiCreateNewBill(billData);

      // Cập nhật trạng thái bàn (Bàn bận: false)
      await dispatch(updateTableStatus({ tableId: selectedTable, status: false }));

      toast.success('Tạo hóa đơn thành công.');
      dispatch(clearCart()); // Xóa giỏ hàng sau khi tạo bill
      dispatch(clearSelectedTable()); // Xóa bàn đã chọn

      return response.data;
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Lỗi tạo hóa đơn!');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// **Lấy hóa đơn theo bàn**
export const fetchBillByTable = createAsyncThunk(
  'bills/fetchBillByTable',
  async (tableId, { rejectWithValue }) => {
    try {
      const response = await APISERVICEBILL.ApiGetBillFromTable(tableId);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill:', error);
      toast.error('Không thể lấy thông tin hóa đơn!');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// **Cập nhật hóa đơn (Thanh toán)**
export const updateBill = createAsyncThunk(
  'bills/updateBill',
  async ({ selectedTable, paymentMethod, discount, totalCost }, { dispatch, rejectWithValue }) => {
    try {
      if (!selectedTable || !paymentMethod) {
        toast.error('Vui lòng chọn phương thức thanh toán!');
        return rejectWithValue('Thiếu thông tin thanh toán!');
      }

      const billUpdateData = {
        payment: paymentMethod,
        status: 1, // Đã thanh toán
        table_id: selectedTable._id,
        discount: discount || 0,
        totalCost: totalCost || selectedTable.bill.reduce((total, item) => total + item.priceP * item.quantityP, 0),
      };

      const response = await APISERVICEBILL.ApiUpdateBill(selectedTable.billId, billUpdateData);

      // Cập nhật trạng thái bàn thành rảnh (true)
      await dispatch(updateTableStatus({ tableId: selectedTable._id, status: true }));

      toast.success('Thanh toán thành công!');
      dispatch(clearSelectedTable());
      dispatch(clearCart());

      return response.data;
    } catch (error) {
      console.error('Error updating bill:', error);
      toast.error('Có lỗi xảy ra khi thanh toán!');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// **Initial State**
const initialState = {
  bills: [],
  selectedBill: null,
  error: null,
  loading: false,
};

// **Slice**
const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setBills(state, action) {
      state.bills = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearSelectedBill(state) {
      state.selectedBill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // **Tạo hóa đơn**
      .addCase(createBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // **Lấy hóa đơn theo bàn**
      .addCase(fetchBillByTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBillByTable.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBill = action.payload;
      })
      .addCase(fetchBillByTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // **Cập nhật hóa đơn (Thanh toán)**
      .addCase(updateBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBill = null;
        state.bills = state.bills.map((bill) =>
          bill._id === action.payload._id ? action.payload : bill
        );
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBills, setError, clearSelectedBill } = billSlice.actions;
export default billSlice.reducer;
