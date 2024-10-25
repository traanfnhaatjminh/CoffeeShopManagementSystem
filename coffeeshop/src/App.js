import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutProduct from './page/warehouse/layout_product';
import LayoutCategory from './page/warehouse/layout_category';
import AuthLogin from '@/page/auth/Login';
import ForgotPassword from '@/page/auth/ForgotPassword';
import VerifyPassword from '@/page/auth/VerifyPassword';
import ResetPassword from '@/page/auth/ResetPassword';
import React from 'react';
import LayoutSetting from './page/shopowner/layout_setting';
import CashierScreen from './page/cashier/CashierScreen';
import AllBillScreen from './page/cashier/AllBillScreen';
import TableList from './page/cashier/TableList';
import LayoutStatistic from './page/shopowner/layout_statistic';
import LandingPage from './components/common/landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<AuthLogin />}></Route>
        <Route path="/login/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/login/verify-password" element={<VerifyPassword />}></Route>
        <Route path="/login/reset-password" element={<ResetPassword />}></Route>
        <Route path="/allbill" element={<AllBillScreen />} />
        <Route path="/createBill" element={<CashierScreen />} />
        <Route path="/tablelist" element={<TableList />} />
        <Route path="/warehouse/categories" element={<LayoutCategory />} />
        <Route path="/warehouse/products" element={<LayoutProduct />} />
        <Route path="/admin/userlist" element={<LayoutSetting />} />
        <Route path="/admin/statistic" element={<LayoutStatistic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
