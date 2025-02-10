import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import Statistic from './Statistic';

function LayoutSetting() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <Statistic />
      </div>
    </div>
  );
}

export default LayoutSetting;
