import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProductModal({ closeModal, refreshProducts }) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [quantityError, setQuantityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [imageError, setImageError] = useState('');

  //list categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories/list');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(URL.createObjectURL(file));
        setSelectedFile(file);
        setImageError('');
      } else {
        setImage('');
        setSelectedFile(null);
        setImageError('*Tệp không hợp lệ. Vui lòng chọn tệp hình ảnh.');
      }
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuantityError('');
    setPriceError('');
    setImageError('');

    if (quantity <= 0) {
      setQuantityError('*Số lượng phải lớn hơn 0');
      return;
    }

    if (price <= 0) {
      setPriceError('*Giá phải lớn hơn 0');
      return;
    }

    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      setImageError('*Vui lòng chọn tệp hình ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('pname', productName);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('image', selectedFile);
    formData.append('category_id', category);

    try {
      await axios.post(`/products/createProduct`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Thêm mới sản phẩm thành công');
      refreshProducts();
      closeModal();
    } catch (error) {
      toast.error('Thêm sản phẩm thất bại!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-1/3 h-auto" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="text-xl font-bold mb-2">Thêm sản phẩm mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label>Tên sản phẩm</label>
              <input
                type="text"
                className="border rounded-md p-2 w-full"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Số lượng</label>
              <input
                type="number"
                className="border rounded-md p-2 w-full"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {quantityError && <p className="text-red-500">{quantityError}</p>}
            </div>
            <div>
              <label>Giá</label>
              <input
                type="number"
                className="border rounded-md p-2 w-full"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {priceError && <p className="text-red-500">{priceError}</p>}
            </div>
            <div>
              <label>Hình ảnh</label>
              <input type="file" name="image" className="border rounded-md p-2 w-full" onChange={handleImageChange} />
              {imageError && <p className="text-red-500">{imageError}</p>}
              {image && <img src={image} alt="Product" className="mt-2 w-16 h-16 object-cover rounded-lg" />}
            </div>
            <div>
              <label>Danh sách danh mục</label>
              <select
                className="border rounded-md p-2 w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" hidden disabled>
                  Chọn danh mục
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
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
