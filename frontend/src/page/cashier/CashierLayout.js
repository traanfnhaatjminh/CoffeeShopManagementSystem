import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';

const CashierLayout = () => {
  return (
<<<<<<< HEAD
    <div className="flex min-h-screen bg-gray-100">
=======
    <div className="flex bg-gray-100 h-full">
>>>>>>> 24c45660396fd3cdf23db205ff9ec953a023b5f4
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header />
<<<<<<< HEAD
        <Outlet />;
=======
        <div className="content h-[90%]">
          <Outlet />
        </div>
>>>>>>> 24c45660396fd3cdf23db205ff9ec953a023b5f4
      </div>
    </div>
  );
};

export default CashierLayout;
