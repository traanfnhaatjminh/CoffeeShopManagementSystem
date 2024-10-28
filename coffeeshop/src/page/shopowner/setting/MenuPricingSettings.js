import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCoffee,
 
  FaPencilAlt,
  FaPlus,
  
} from 'react-icons/fa';
const MenuPricingSettings = () => {
  const [activeTab, setActiveTab] = useState('drinks');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Menu & Giá cả</h2>

        <div className="border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('drinks')}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'drinks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <FaCoffee className="w-4 h-4" />
                Đồ uống
              </div>
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'food' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            ></button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              <FaPlus className="w-4 h-4" />
              Thêm món mới
            </button>
          </div>

          {/* Danh sách menu */}
          <div className="grid gap-4">
            {[
              { name: 'Cà phê sữa', price: '29.000đ', category: 'Cà phê' },
              { name: 'Cà phê đen', price: '25.000đ', category: 'Cà phê' },
              { name: 'Trà sữa trân châu', price: '35.000đ', category: 'Trà sữa' },
            ].map((item) => (
              <div key={item.name} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-green-600">{item.price}</span>
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
    </div>
  );
};

export default MenuPricingSettings