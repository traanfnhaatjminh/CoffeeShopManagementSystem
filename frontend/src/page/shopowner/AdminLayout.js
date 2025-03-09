import { Outlet } from 'react-router-dom';
import Header from '../../components/common/header';
import Sidebar from '../../components/common/sidebar';

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full shadow-md z-10 h-[9%] lg:h-[10%]">
        <Header />
      </div>

      <div className="flex flex-1 pt-[5%]">
        <div className="fixed left-0 top-[9%] shadow-lg">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-auto ml-32 mt-3 lg:mt-[-5px] xl:mt-[]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
