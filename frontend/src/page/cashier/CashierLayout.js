import { Outlet } from 'react-router-dom';
import Header from '../../components/common/header';
import Sidebar from '../../components/common/sidebar';

const CashierLayout = () => {
    return(
    <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
            <Header />
            <Outlet />;
        </div>
    </div>);
};

export default CashierLayout;
