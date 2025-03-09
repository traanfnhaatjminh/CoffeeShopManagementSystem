import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { environment } from '@/environment/env';

const initialState = {
  dataTotalRevenue: {},
  dataProfit: {},
  dataExpense: {},
  getData: false,
  isLoading: false,
};

export const getTotalRevenue = createAsyncThunk('admin/totalRevenue', async ({ month }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/totalRevenue`, { month });
  return response.data;
});
export const getTotalProfit = createAsyncThunk('admin/totalProfit', async ({ month }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/totalProfit`, { month });
  return response.data;
});

export const getTotalExpense = createAsyncThunk('admin/totalExpense', async ({ month }) => {
    const response = await axios.post(`${environment.apiUrl}/admin/totalExpense`, { month });
    return response.data;
})

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    setRevenue: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(getTotalRevenue.rejected, (state) => {
      state.dataTotalRevenue = {};
      state.getData = false;
    });
    builder.addCase(getTotalRevenue.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTotalRevenue.fulfilled, (state, action) => {
      state.dataTotalRevenue = action.payload.success ? action.payload.data : {};
      state.getData = false;
    });
    builder.addCase(getTotalProfit.rejected, (state) => {
      state.dataProfit = {};
      state.getData = false;
    });
    builder.addCase(getTotalProfit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTotalProfit.fulfilled, (state, action) => {
      state.dataProfit = action.payload.success ? action.payload.data : {};
      state.getData = false;
    });

    builder.addCase(getTotalExpense.rejected, (state) => {
      state.dataExpense = {};
      state.getData = false;
    });
    builder.addCase(getTotalExpense.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTotalExpense.fulfilled, (state, action) => {
      state.dataExpense = action.payload.success ? action.payload.data : {};
      state.getData = false;
    });
  },
});
export default revenueSlice.reducer;
