import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
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
        existingProduct.total += product.sale_price;
      } else {
        state.cart.push({ ...product, quantity: 1, total: product.sale_price });
      }
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
    },
    updateQuantity(state, action) {
      const { _id, change } = action.payload;
      const product = state.cart.find((item) => item._id === _id);
      if (product) {
        product.quantity += change;
        product.total = product.quantity * product.sale_price;
        if (product.quantity <= 0) {
          state.cart = state.cart.filter((item) => item._id !== _id);
        }
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
