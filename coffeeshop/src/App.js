import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutProduct from './page/warehouse/layout_product';
import LayoutCategory from './page/warehouse/layout_category';
import AuthLogin from '@/page/auth/Login';
import ForgotPassword from '@/page/auth/ForgotPassword';
import VerifyPassword from '@/page/auth/VerifyPassword';
import ResetPassword from '@/page/auth/ResetPassword';

import AuthLayout from '@/page/auth/Layout';
import AdminLayout from '@/page/shopowner/ShopownerLayout';
import WarehouseLayout from '@/page/warehouse/WarehouseLayout';
import CashierLayout from '@/page/cashier/CashierLayout';

import React, { useEffect } from 'react';
import LayoutSetting from './page/shopowner/layout_setting';
import CashierScreen from './page/cashier/CashierScreen';
import AllBillScreen from './page/cashier/AllBillScreen';
import TableList from './page/cashier/TableList';
import LayoutStatistic from './page/shopowner/layout_statistic';
import LandingPage from './components/common/landing';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth-slice/authSlice';
import CheckAuth from '@/page/common/CheckAuth';
import NotFound from '@/page/auth/NotFound';

function App() {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout></AuthLayout>
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />}></Route>
          <Route path="login/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="login/verify-password" element={<VerifyPassword />}></Route>
          <Route path="login/reset-password" element={<ResetPassword />}></Route>
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout></AdminLayout>
            </CheckAuth>
          }
        >
          <Route path="statistic" element={<LayoutStatistic />}></Route>
          <Route path="setting" element={<LayoutSetting />}></Route>
        </Route>

        <Route path="/cashier"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <CashierLayout></CashierLayout>
            </CheckAuth>
          }
        >
          <Route path="allbill" element={<AllBillScreen />}></Route>
          <Route path="createBill" element={<CashierScreen />}></Route>
          <Route path="tablelist" element={<TableList />}></Route>
        </Route>

        <Route
          path="/warehouse"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <WarehouseLayout></WarehouseLayout>
            </CheckAuth>
          }
        >
          <Route path="categories" element={<LayoutCategory />} />
          <Route path="products" element={<LayoutProduct />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
