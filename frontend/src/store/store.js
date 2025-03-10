import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/auth-slice/authSlice';
import cartReducer from './cart-slice/cartSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import billReducer from './bill-slice/billSlice';
import tableReducer from './table-slice/tableSlice';
import revenueReducer from './revenue-slice/revenueSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  bill: billReducer,
  tables: tableReducer,
  revenue: revenueReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
