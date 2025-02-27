import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import APITABLE from '../../services/api-table';

// Thunk lấy danh sách bàn
export const fetchTables = createAsyncThunk(
  'tables/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await APITABLE.ApiGetAll();
      return response.data; 
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Lỗi khi lấy danh sách bàn!');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk cập nhật trạng thái bàn
export const updateTableStatus = createAsyncThunk(
  'tables/updateTableStatus',
  async ({ tableId, status }, { rejectWithValue }) => {
    try {
      await APITABLE.ApiUpdateStatusTable(tableId, status);
      return { tableId, status };
    } catch (error) {
      console.error('Error updating table status:', error);
      toast.error('Lỗi khi cập nhật trạng thái bàn!');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  tableList: [],
  selectedTable: null, // Lưu _id của bàn thay vì index
  loading: false,
  error: null,
};

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setSelectedTable(state, action) {
      state.selectedTable = action.payload; // Lưu _id bàn
    },
    clearSelectedTable(state) {
      state.selectedTable = null; // Reset bàn khi cần
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tableList = action.payload || [];
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTableStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { tableId, status } = action.payload;
        const table = state.tableList.find((t) => t._id === tableId);
        if (table) {
          table.status = status;
        }
      })
      .addCase(updateTableStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTable, clearSelectedTable } = tableSlice.actions;
export default tableSlice.reducer;
