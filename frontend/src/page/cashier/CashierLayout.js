import { Outlet } from 'react-router-dom';
import Header from '../../components/common/header';
import Sidebar from '../../components/common/sidebar';

const CashierLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full shadow-md z-10 h-[9%] lg:h-[10%]">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Header />
        <div className="content h-[94%] lg:h-[90%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;
