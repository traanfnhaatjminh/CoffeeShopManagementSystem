import React, { useState } from 'react';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import TableList from './TableList';

function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header />
        <TableList />
      </div>
    </div>
  );
}

export default Layout;
