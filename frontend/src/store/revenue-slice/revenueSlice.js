import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { environment } from '@/environment/env';

const initialState = {
  dataTotalRevenue: {},
  dataProfit: {},
  dataExpense: {},
  dataLatestMonth: {},
  getData: false,
  isLoading: false,
};

export const getTotalRevenue = createAsyncThunk('admin/totalRevenue', async ({ month, year }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/totalRevenue`, { month, year });
  return response.data;
});
export const getTotalProfit = createAsyncThunk('admin/totalProfit', async ({ month, year }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/totalProfit`, { month, year });
  return response.data;
});

export const getTotalExpense = createAsyncThunk('admin/totalExpense', async ({ month, year }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/totalExpense`, { month, year });
  return response.data;
});

export const getDataLatestMonths = createAsyncThunk('admin/getRevenueLatestMonths', async () => {
  const response = await axios.get(`${environment.apiUrl}/admin/getRevenueLatestMonths`);
  return response.data;
});

export const getListTopProductsOrder = createAsyncThunk('admin/listTopProductsOrder', async ({ month, year }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/listTopProductsOrder`, { month, year });
  return response.data;
});

export const getListIngredient = createAsyncThunk('admin/listDataExpense', async ({ month, year }) => {
  const response = await axios.post(`${environment.apiUrl}/admin/listDataExpense`, { month, year });
  return response.data;
});

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
      state.getData = true;
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
      state.getData = true;
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
      state.getData = true;
    });

    builder.addCase(getDataLatestMonths.rejected, (state) => {
      state.dataLatestMonth = {};
      state.getData = false;
    });
    builder.addCase(getDataLatestMonths.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDataLatestMonths.fulfilled, (state, action) => {
      state.dataLatestMonth = action.payload.success ? action.payload.data : {};
      state.getData = true;
    });

    builder.addCase(getListTopProductsOrder.rejected, (state) => {
      state.getData = false;
    });
    builder.addCase(getListTopProductsOrder.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getListTopProductsOrder.fulfilled, (state, action) => {
      state.getData = true;
    });

    builder.addCase(getListIngredient.rejected, (state) => {
      state.getData = false;
    });
    builder.addCase(getListIngredient.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getListIngredient.fulfilled, (state, action) => {
      state.getData = true;
    });
  },
});
export default revenueSlice.reducer;
