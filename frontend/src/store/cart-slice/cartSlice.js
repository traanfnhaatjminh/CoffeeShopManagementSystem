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
    clearTable(state){
       state.selectedTable=null;
    },
    setBills(state, action) {
      state.bills = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { addToCart, removeFromCart,clearTable, updateQuantity, setSelectedTable, clearCart, setBills, setError } =
  cartSlice.actions;



export default cartSlice.reducer;
