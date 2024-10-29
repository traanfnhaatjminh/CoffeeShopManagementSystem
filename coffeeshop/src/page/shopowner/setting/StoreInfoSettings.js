import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';

const StoreInfoSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    name_shop: '',
    email_shop: '',
    address_shop: '',
    phone_shop: '',
    operating_info: {
      time_open: '',
      time_close: '',
      special_notes: '',
      is_open_today: false
    }
  });

  const fetchStoreInfo = async () => {
    try {
      const response = await axios.get("/info");
      if (response.data && response.data.length > 0) {
        const storeData = response.data[0];
        setStoreInfo(storeData);
      }
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  };

  useEffect(() => {
    fetchStoreInfo();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('operating_info.')) {
      const field = name.split('.')[1];
      setStoreInfo(prev => ({
        ...prev,
        operating_info: {
          ...prev.operating_info,
          [field]: value
        }
      }));
    } else {
      setStoreInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/info/updateInfo/${storeInfo.owner}`, 
        storeInfo,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        await fetchStoreInfo();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating store info:', error);
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchStoreInfo(); // Reset to original data
    setIsEditing(false);
  };

  const ViewMode = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Thông tin cửa hàng</h2>
        <button
          onClick={handleStartEditing}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <FaPencilAlt className="w-4 h-4" />
          <span>Chỉnh sửa</span>
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Tên quán</h3>
          <p className="text-lg">{storeInfo.name_shop}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="text-lg">{storeInfo.email_shop}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Địa chỉ</h3>
          <p className="text-lg flex items-center gap-2">
            {storeInfo.address_shop}
            <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
          <p className="text-lg flex items-center gap-2">
            {storeInfo.phone_shop}
            <FaPhone className="w-4 h-4 text-gray-400" />
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Giờ hoạt động</h3>
          <p className="text-lg">
            {storeInfo.operating_info?.time_open || ''} - {storeInfo.operating_info?.time_close || ''}
          </p>
          {storeInfo.operating_info?.special_notes && (
            <p className="text-sm text-gray-500 mt-1">{storeInfo.operating_info.special_notes}</p>
          )}
          <p className="text-sm text-gray-500">
            {storeInfo.operating_info?.is_open_today ? 'Đang mở cửa' : 'Đang đóng cửa'}
          </p>
        </div>
      </div>
    </div>
  );

  const EditMode = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Chỉnh sửa thông tin cửa hàng</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="name_shop" className="block text-sm font-medium text-gray-700 mb-1">
            Tên quán
          </label>
          <input
            id="name_shop"
            type="text"
            name="name_shop"
            value={storeInfo.name_shop}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên quán..."
          />
        </div>

        <div>
          <label htmlFor="email_shop" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email_shop"
            type="email"
            name="email_shop"
            value={storeInfo.email_shop}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập email..."
          />
        </div>

        <div>
          <label htmlFor="address_shop" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <div className="flex gap-2">
            <input
              id="address_shop"
              type="text"
              name="address_shop"
              value={storeInfo.address_shop}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ..."
            />
            <button type="button" className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
              <FaMapMarkerAlt className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="phone_shop" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="flex gap-2">
            <input
              id="phone_shop"
              type="tel"
              name="phone_shop"
              value={storeInfo.phone_shop}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại..."
            />
            <button type="button" className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
              <FaPhone className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giờ hoạt động</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="time_open" className="block text-sm text-gray-600 mb-1">
                Giờ mở cửa
              </label>
              <input
                id="time_open"
                type="time"
                name="operating_info.time_open"
                value={storeInfo.operating_info?.time_open || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="time_close" className="block text-sm text-gray-600 mb-1">
                Giờ đóng cửa
              </label>
              <input
                id="time_close"
                type="time"
                name="operating_info.time_close"
                value={storeInfo.operating_info?.time_close || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-2">
            <label htmlFor="special_notes" className="block text-sm text-gray-600 mb-1">
              Ghi chú đặc biệt
            </label>
            <input
              id="special_notes"
              type="text"
              name="operating_info.special_notes"
              value={storeInfo.operating_info?.special_notes || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập ghi chú..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {isEditing ? <EditMode /> : <ViewMode />}
    </div>
  );
};

export default StoreInfoSettings;