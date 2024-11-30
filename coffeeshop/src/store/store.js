import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/store/auth-slice/authSlice';
import cartSlice from './cart-slice/cartSlice';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
  },
});

export default store;
