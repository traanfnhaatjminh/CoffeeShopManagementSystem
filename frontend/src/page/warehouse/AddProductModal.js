import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import APISERVICECASHIER from '../../services/api-cashier';

export default function AddProductModal({ closeModal, refreshProducts }) {
  const [productName, setProductName] = useState('');
  const [salePrice, setSalePrice] = useState(0);
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [costPrice, setCostPrice] = useState(0);
  const [salePriceError, setSalePriceError] = useState('');
  const [imageError, setImageError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Các state cho tab Thành phần
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  // selectedIngredients là mảng chứa các ingredient mà bạn đã chọn

  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState('thongtin');

  useEffect(() => {
    let total = 0;
    selectedIngredients.forEach((ingredient) => {
      const costPrice = getCostPrice(ingredient);
      const quantity = quantities[ingredient._id] || 0;
      total += (quantity / ingredient.capacity) * costPrice;
    });
    setCostPrice(Math.round(total)); // Làm tròn để tránh số lẻ
  }, [selectedIngredients, quantities]);

  // Lấy danh sách ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get('/ingredients/getAll');
        setIngredientsList(response.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };
    fetchIngredients();
  }, []);

  // Mỗi khi searchTerm thay đổi, lọc ingredientsList
  useEffect(() => {
    if (!searchTerm) {
      setFilteredIngredients([]);
      return;
    }
    // Giả sử ingredient có field 'name'
    const filtered = ingredientsList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIngredients(filtered);
  }, [searchTerm, ingredientsList]);

  const handleQuantityChange = (id, value) => {
    const newQuantity = Math.max(0, Number(value)); // Không cho giá trị âm
    setQuantities({ ...quantities, [id]: newQuantity });
  };

  // Xử lý khi user chọn 1 ingredient
  const handleSelectIngredient = (ingredient) => {
    // Kiểm tra xem ingredient đã có trong danh sách chưa
    const alreadyExists = selectedIngredients.some(
      (item) => item._id === ingredient._id
    );
    if (!alreadyExists) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    // Clear searchTerm và danh sách gợi ý
    setSearchTerm('');
    setFilteredIngredients([]);
  };

  // Xử lý remove 1 ingredient khỏi selectedIngredients
  const handleRemoveIngredient = (id) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item._id !== id));
  };

  const getCostPrice = (ingredient) => {
    if (!ingredient.purchase_history || ingredient.purchase_history.length === 0) {
      return 0;
    }

    // Lọc ra các lần nhập hàng có remaining_quantity > 0
    const validPurchases = ingredient.purchase_history
      .filter((purchase) => purchase.remaining_quantity > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sắp xếp từ mới đến cũ

    if (validPurchases.length === 0) {
      return 0; // Nếu không còn lần nhập nào có tồn kho
    }

    return validPurchases[0].cost_price; // Lấy giá nhập của lần gần nhất còn tồn kho
  };

  const calculatePrice = (ingredient) => {
    const costPrice = getCostPrice(ingredient);
    const quantity = quantities[ingredient._id] || 0;
    return ((quantity / ingredient.capacity) * costPrice).toFixed(0);
  };

  useEffect(() => {
    fetch('/categories/list')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched Categories:', data); // In ra response để kiểm tra
        setCategories(data.categories || []); // Đảm bảo nó là mảng
      })
      .catch((error) => console.error('Error fetching categories:', error));
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
    setSalePriceError('');
    setImageError('');
    setCategoryError('');  


    if (salePrice <= 0) {
      setSalePriceError('*Giá phải lớn hơn 0');
      return;
    }

    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      setImageError('*Vui lòng chọn tệp hình ảnh');
      return;
    }

    if (!category) {
      setCategoryError('*Vui lòng chọn 1 danh mục');
      return;
    }

    const formData = new FormData();
    formData.append('pname', productName);
    formData.append('sale_price', salePrice);
    formData.append('cost_price', costPrice);
    formData.append('image', selectedFile);
    formData.append('category_id', category);

    // Chuyển danh sách ingredients thành JSON string
    formData.append('ingredients', JSON.stringify(
      selectedIngredients.map(item => ({
        ingredient_id: item._id,
        unit: item.unit,
        quantitative: quantities[item._id],
        TotalPerIngredient: calculatePrice(item)
      }))
    ));

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
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Thêm sản phẩm thất bại!');
      }
    }
  };

  // Render nội dung của từng tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'thongtin':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Tên hàng hóa</label>
              <input
                type="text"
                className="border rounded-md p-2 w-full"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder='Nhập tên hàng hóa'
                required
              />
            </div>
            <div>
              <label className="block font-medium">Giá bán</label>
              <input
                type="number"
                className="border rounded-md p-2 w-full"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
              {salePriceError && <p className="text-red-500">{salePriceError}</p>}
            </div>
            <div>
              <label className="block font-medium">Hình ảnh</label>
              <input type="file" name="image" className="border rounded-md p-2 w-full" onChange={handleImageChange} />
              {imageError && <p className="text-red-500">{imageError}</p>}
              {image && <img src={image} alt="Product" className="mt-2 w-16 h-16 object-cover rounded-lg" />}
            </div>
            <div>
              <label className="block font-medium">Loại sản phẩm</label>
              <select
                className="border rounded-md p-2 w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" hidden disabled>
                  Chọn danh mục
                </option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {categoryError && <p className="text-red-500">{categoryError}</p>} 
            </div>
          </div>
        );
      case 'thanhphan':
        return (
          <div>
            <label className="block font-medium">Thành phần</label>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                className="border rounded-md p-2 w-full"
                placeholder="Tìm kiếm thành phần..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Hiển thị danh sách gợi ý khi searchTerm có dữ liệu */}
              {filteredIngredients.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-1 z-10">
                  {filteredIngredients.map((ingredient) => (
                    <li
                      key={ingredient._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSelectIngredient(ingredient)}
                    >
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bảng hiển thị các ingredient đã chọn */}
            {selectedIngredients.length > 0 && (
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Tên thành phần</th>
                    <th className="border p-2">Số lượng</th>
                    <th className="border p-2">Giá vốn</th>
                    <th className="border p-2">Thành tiền</th>
                    <th className="border p-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedIngredients.map((item) => (
                    <tr key={item._id}>
                      <td className="border p-2" style={{ fontWeight: 'bold' }}>{item.name} - ({item.unit})</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="border p-1 w-20"
                          value={quantities[item._id] || ""}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        />
                      </td>
                      <td className="border p-2">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getCostPrice(item))}
                      </td>
                      <td className="border p-2">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(calculatePrice(item))}
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleRemoveIngredient(item._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <div className='p-2' style={{ fontWeight: 'bold' }}>Tổng giá vốn thành phần:
                  <span className='ml-2' style={{ fontWeight: 'normal' }}>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(costPrice)}

                  </span>

                </div>
              </table>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" >
      <div
        className="bg-white p-4 rounded-lg h-auto w-full max-w-3xl shadow-lg"
        style={{ maxHeight: '150vh', width: '70%' }}
      >
        <h2 className="text-xl font-bold mb-2">Thêm hàng hóa mới</h2>

        {/* Thanh tab */}
        <div className="flex mb-4">
          <button
            className={`mr-2 px-3 py-1 rounded ${activeTab === 'thongtin' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
            onClick={() => setActiveTab('thongtin')}
          >
            Thông tin
          </button>
          <button
            className={`mr-2 px-3 py-1 rounded ${activeTab === 'thanhphan' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
            onClick={() => setActiveTab('thanhphan')}
          >
            Thành phần
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nội dung tab hiện tại */}
          {renderTabContent()}

          {/* Nút hủy và nút thêm */}
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-400 text-white px-3 py-1 rounded-lg mr-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-green-400 text-white px-3 py-1 rounded-lg"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}