import { Outlet } from 'react-router-dom';
import Header from '../../components/common/header';
import Sidebar from '../../components/common/sidebar';

const CashierLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header cố định ở trên cùng */}
      <div className="fixed top-0 left-0 w-full shadow-md z-10 h-16">
        <Header />
      </div>

      <div className="flex pt-16 h-full">
        {/* Sidebar cố định bên trái */}
        <div className="fixed left-0 top-16 h-full  shadow-lg">
          <Sidebar />
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 ml-32 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;


