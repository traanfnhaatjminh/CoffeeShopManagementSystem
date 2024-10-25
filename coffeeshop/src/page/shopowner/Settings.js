import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStore, FaUserCog, FaCoffee, FaChair, FaWallet, FaBell, FaChartBar, FaLanguage } from 'react-icons/fa';
import ManagerTable from '../shopowner/setting/ManagerTable';
import MenuPricingSettings from '../shopowner/setting/MenuPricingSettings';
import StoreInfoSettings from '../shopowner/setting/StoreInfoSettings';

import UserRolesSettings from '../shopowner/setting/UserRolesSettings';

function Settings() {
  const [activeTab, setActiveTab] = useState('storeInfo');

  const renderContent = () => {
    switch (activeTab) {
      case 'storeInfo':
        return <StoreInfoSettings />;
      case 'userRoles':
        return <UserRolesSettings />;
      case 'menuPricing':
        return <MenuPricingSettings />;
      case 'table':
        return <ManagerTable />;
      default:
        return <div>Đang phát triển...</div>;
    }
  };

  const menuItems = [
    { id: 'storeInfo', label: 'Thông tin Quán', icon: FaStore },
    { id: 'userRoles', label: 'Người dùng & Phân quyền', icon: FaUserCog },
    { id: 'menuPricing', label: 'Giá & Giảm Giá', icon: FaCoffee },
    { id: 'table', label: 'QL Bàn', icon: FaChair },
    { id: 'payment', label: 'Thanh toán', icon: FaWallet },
    { id: 'notifications', label: 'Thông báo', icon: FaBell },
    { id: 'reports', label: 'Báo cáo', icon: FaChartBar },
    { id: 'languageUI', label: 'Giao diện', icon: FaLanguage },
  ];

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="flex justify-around p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === item.id ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">{renderContent()}</div>
    </div>
  );
}

export default Settings;
