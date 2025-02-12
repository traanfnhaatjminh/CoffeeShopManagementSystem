import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';

const CashierLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header />
        <Outlet />;
      </div>
    </div>
  );
};

export default CashierLayout;
