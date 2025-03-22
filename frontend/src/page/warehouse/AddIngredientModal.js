import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddIngredientModal = ({ closeModal, refreshIngredients }) => {
    // Các state dùng cho tab Thông tin
    const [ingredientName , setIngredientName ] = useState('');
    const [unit, setUnit] = useState('');
    const [supplier, setSupplier] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [costPrice, setCostPrice] = useState(0);
    const [capacity, setCapacity] = useState(0);

    const [quantityError, setQuantityError] = useState('');
    const [costPriceError, setCostPriceError] = useState('');
    const [capacityError, setCapacityError] = useState('');
    const [ingredientNameError, setIngredientNameError] = useState('');
    const [unitError, setUnitError] = useState('');

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

    // Kiểm tra tên nguyên liệu không chứa ký tự đặc biệt
    const isValidProductName = (name) => /^[a-zA-Z0-9\s]+$/.test(name);

    // Kiểm tra xem đơn vị có đúng định dạng không (vd: "hộp/ml")
    const isValidUnit = (unit) => /^[a-zA-ZÀ-Ỹà-ỹ]+\/[a-zA-ZÀ-Ỹà-ỹ]+$/.test(unit);

    // Kiểm tra giá trị số không chứa dấu phẩy
    const isValidNumber = (value) => /^\d+$/.test(value);

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra lỗi
        setQuantityError('');
        setCostPriceError('');
        setCapacityError('');

        let hasError = false;

        // Kiểm tra tên nguyên liệu
        if (!isValidProductName(ingredientName)) {
            setIngredientNameError('Tên nguyên liệu không được chứa ký tự đặc biệt!');
            hasError = true;
        }

        // Kiểm tra đơn vị hợp lệ
        if (!isValidUnit(unit)) {
            setUnitError('Đơn vị không đúng định dạng, không chứa số hoặc ký tự đặc biệt!');
            hasError = true;
        }

        if (quantity <= 0) {
            setQuantityError('*Số lượng nhập phải lớn hơn 0!');
            hasError = true;
        } else if (!isValidNumber(quantity)) {
            setQuantityError('*Số lượng nhập không được chứa dấu phẩy!');
            hasError = true;
        }

        if (costPrice <= 0) {
            setCostPriceError('*Giá vốn phải lớn hơn 0!');
            hasError = true;
        } else if (!isValidNumber(costPrice)) {
            setCostPriceError('*Giá vốn không được chứa dấu phẩy');
            hasError = true;
        }

        if (capacity <= 0) {
            setCapacityError('*Dung tích phải lớn hơn 0!');
            hasError = true;
        } else if (!isValidNumber(capacity)) {
            setCapacityError('*Dung tích không được chứa dấu phẩy');
            hasError = true;
        }

        if (hasError) return; // Nếu có lỗi thì dừng lại

        // Tạo formData để gửi lên server
        const formData = new FormData();
        formData.append('name', ingredientName );
        formData.append('quantity', quantity);
        formData.append('cost_price', costPrice);
        formData.append('unit', unit);
        formData.append('capacity', capacity);
        formData.append('supplier', supplier);


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
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tên nguyên liệu */}
                        <div>
                            <label className="block font-medium">Tên nguyên liệu</label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={ingredientName }
                                onChange={(e) => setIngredientName (e.target.value)}
                                placeholder="Nhập tên nguyên liệu"
                                required
                            />
                            {ingredientNameError && <p className="text-red-500">{ingredientNameError}</p>}
                        </div>

                        {/* Số lượng nhập */}
                        <div>
                            <label className="block font-medium">Số lượng nhập</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                            {quantityError && <p className="text-red-500">{quantityError}</p>}
                        </div>

                        {/* Giá vốn */}
                        <div>
                            <label className="block font-medium">Giá vốn</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={costPrice}
                                onChange={(e) => setCostPrice(e.target.value)}
                                required
                            />
                            {costPriceError && <p className="text-red-500">{costPriceError}</p>}
                        </div>

                        {/* Đơn vị tính */}
                        <div>
                            <label className="block font-medium">
                                Đơn vị tính
                                <span style={{marginLeft:'5px', fontWeight:'normal'}}>(Ví dụ: Hộp/ml)</span>
                            </label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="Nhập đơn vị tính"
                                required
                            />
                            {unitError && <p className="text-red-500">{unitError}</p>}
                        </div>

                        {/* Dung tích nguyên liệu */}
                        <div className="">
                            <label className="block font-medium">Dung tích nguyên liệu</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                required
                            />
                            {capacityError && <p className="text-red-500">{capacityError}</p>}
                        </div>

                        <div>
                            <label className="block font-medium">Nhà cung cấp</label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                placeholder="Nhập tên nhà cung cấp"
                                required
                            />
                        </div>
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
