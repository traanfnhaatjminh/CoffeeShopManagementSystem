
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaStore, 
  FaUserCog, 
  FaCoffee, 
  FaChair,
  FaWallet,
  FaBell, 
  FaChartBar,
  FaLanguage,
  FaMapMarkerAlt,
  FaTable ,
  FaPhone,
  FaPencilAlt,
  FaPlus,
  FaUser,
  FaLock,
  
} from 'react-icons/fa';
const UserRolesSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Quản lý nhân viên & Phân quyền</h2>
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                <FaPlus className="w-4 h-4" />
                Thêm nhân viên
              </button>
            </div>
            
            {['Quản lý', 'Thu ngân', 'Phục vụ'].map((role) => (
              <div key={role} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FaUser className="w-8 h-8 text-gray-500" />
                    <div>
                      <p className="font-medium">{role}</p>
                      <p className="text-sm text-gray-500">Quyền truy cập: Đầy đủ</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
                      <FaLock className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
                      <FaPencilAlt className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
export default UserRolesSettings;  