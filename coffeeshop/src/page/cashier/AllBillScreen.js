import React from 'react';
import Header from '../../components/common/header';
import Sidebar from '../../components/common/sidebar';
import BillList from './BillList';

export default function AllBillScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow overflow-hidden"> {/* Thêm overflow-hidden cho phần BillList */}
          <BillList />
        </div>
      </div>
    </div>
  );
}
