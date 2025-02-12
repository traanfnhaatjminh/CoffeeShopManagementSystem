import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cart: [],
  bills: [],
  selectedTable: null,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item._id === product._id);

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.total += product.price;
      } else {
        state.cart.push({ ...product, quantity: 1, total: product.price });
      }
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
    },
    updateQuantity(state, action) {
      const { _id, change } = action.payload; // Sửa lại cấu trúc payload
      const product = state.cart.find((item) => item._id === _id);
      
      if (product) {
        product.quantity += change;
        product.total = product.quantity * product.price;
        
        if (product.quantity <= 0) {
          state.cart = state.cart.filter((item) => item._id !== _id);
        }
      }
    },
    setSelectedTable(state, action) {
      state.selectedTable = action.payload;
    },
    clearCart(state) {
      state.cart = [];
    },
    setBills(state, action) {
      state.bills = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setSelectedTable, clearCart, setBills, setError } =
  cartSlice.actions;

// Async action to create bill
export const createBill = (billData) => async (dispatch) => {
  try {
    const response = await axios.post('/bills/createBill', billData);
    dispatch(clearCart());
    dispatch(getBills()); // Refetch bills after creating one
  } catch (error) {
    dispatch(setError(error.response?.data || 'Error creating bill'));
  }
};

// Async action to get all bills
export const getBills = () => async (dispatch) => {
  try {
    const response = await axios.get('/bills');
    dispatch(setBills(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data || 'Error fetching bills'));
  }
};

export default cartSlice.reducer;
