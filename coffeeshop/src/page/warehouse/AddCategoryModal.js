import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function AddProductModal({ closeModal }) {
  const [categories, setCategories] = useState('');
  const [formData, setFormData] = useState({
    group_name: '',
    category_name: '',
  });
  useEffect = (() => {}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    try {
      const response = await axios.post('/createbill/createCategory', formData);
      console.log('Category created:', response.data);
      setFormData({
        group_name: '',
        category_name: '',
      });
      closeModal();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-1/3 h-auto">
        <h2 className="text-xl font-bold mb-2">Thêm danh mục mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label htmlFor="group_name">Tên nhóm</label>
              <input
                type="text"
                id="group_name"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="category_name">Tên danh mục</label>
              <input
                type="text"
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-3 py-1 rounded-lg mr-2">
              Hủy
            </button>
            <button type="submit" className="bg-green-400 text-white px-3 py-1 rounded-lg">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
