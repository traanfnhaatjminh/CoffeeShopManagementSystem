import { Outlet } from 'react-router-dom';
import Header from '../../components/common/header';
import Sidebar from '../../components/common/sidebar';

const CashierLayout = () => {
    return (
        <div className="flex bg-gray-100 h-full">
            {/* Sidebar */}
            <Sidebar />

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
