import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddIngredientModal = ({ closeModal, refreshIngredients }) => {
    // Các state dùng cho tab Thông tin
    const [productName, setProductName] = useState('');
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [costPrice, setCostPrice] = useState(0);
    const [capacity, setCapacity] = useState(0);

    const [quantityError, setQuantityError] = useState('');
    const [costPriceError, setCostPriceError] = useState('');
    const [capacityError, setCapacityError] = useState('');

    // Các state cho tab Thành phần
    const [searchTerm, setSearchTerm] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    // selectedIngredients là mảng chứa các ingredient mà bạn đã chọn

    // State quản lý tab hiện tại
    const [activeTab, setActiveTab] = useState('thongtin');

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

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra lỗi
        setQuantityError('');
        setCostPriceError('');
        setCapacityError('');

        let hasError = false;

        if (quantity <= 0) {
            setQuantityError('*Số lượng nhập phải lớn hơn 0!');
            hasError = true;
        }
        if (costPrice <= 0) {
            setCostPriceError('*Giá vốn phải lớn hơn 0!');
            hasError = true;
        }
        if (capacity <= 0) {
            setCapacityError('*Dung tích phải lớn hơn 0!');
            hasError = true;
        }
        
        if (hasError) return; // Nếu có lỗi thì dừng lại

        // Tạo formData để gửi lên server
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('quantity', quantity);
        formData.append('cost_price', costPrice);
        formData.append('unit', unit);
        formData.append('capacity', capacity);

        // Gửi danh sách ingredient đã chọn
        // formData.append('ingredients', JSON.stringify(selectedIngredients));

        try {
            await axios.post('/ingredients/createIngredient', formData);
            toast.success('Thêm 1 nguyên liệu mới thành công');
            refreshIngredients();
            closeModal();
        } catch (error) {
            toast.error('Thêm nguyên liệu thất bại!');
        }
    };


    // Render nội dung của từng tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'thongtin':
                return (
                    <div>
                        <div>
                            <label>Tên nguyên liệu</label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder='Nhập tên nguyên liệu'
                                required
                            />
                        </div>
                        <div>
                            <label>Số lượng nhập</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                            {quantityError && <p className="text-red-500">{quantityError}</p>}
                        </div>
                        <div>
                            <label>Giá vốn</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={costPrice}
                                onChange={(e) => setCostPrice(e.target.value)}
                                required
                            />
                            {costPriceError && <p className="text-red-500">{costPriceError}</p>}
                        </div>
                        <div>
                            <label>Đơn vị tính</label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder='Nhập đơn vị tính'
                                required
                            />
                        </div>
                        <div>
                            <label>Dung tích nguyên liệu</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                required
                            />
                            {capacityError && <p className="text-red-500">{capacityError}</p>}
                        </div>
                    </div>
                );
            case 'thanhphan':
                return (
                    <div>
                        <label>Thành phần</label>
                        <div className="relative w-96">
                            <input
                                type="text"
                                className="border rounded-md p-2 w-96"
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
                                            <td className="border p-2">{item.name}</td>
                                            <td className="border p-2">
                                                <input type='number' defaultValue={0} />
                                            </td>
                                            <td className="border p-2">{item.cost_costPrice}</td>
                                            <td className="border p-2">VND</td>
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
                className="bg-white p-4 rounded-lg h-auto"
                style={{ maxHeight: '150vh', width: '70%' }}
            >
                <h2 className="text-xl font-bold mb-2">Thêm nguyên liệu mới</h2>

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

export default AddIngredientModal;
