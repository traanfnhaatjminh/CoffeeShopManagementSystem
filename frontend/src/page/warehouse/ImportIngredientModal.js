import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ImportIngredientModal({ ingredient, closeModal, refreshingredients }) {

    const [quantity, setQuantity] = useState(0);
    const [costPrice, setCostPrice] = useState(0);
    const [supplier, setSupplier] = useState('');

    const [quantityError, setQuantityError] = useState('');
    const [costPriceError, setCostPriceError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra lỗi
        setQuantityError('');
        setCostPriceError('');

        let hasError = false;

        if (quantity <= 0) {
            setQuantityError('*Số lượng nhập phải lớn hơn 0!');
            hasError = true;
        }
        if (costPrice <= 0) {
            setCostPriceError('*Giá vốn phải lớn hơn 0!');
            hasError = true;
        }

        if (hasError) return; // Nếu có lỗi thì dừng lại

        const formData = new FormData();
        formData.append('quantity', Number(quantity));
        formData.append('cost_price', Number(costPrice));
        formData.append('supplier', supplier);
        console.log("Dữ liệu gửi đi:", { quantity, costPrice, supplier });

        try {
            await axios.post(`/ingredients/importIngredient/${ingredient._id}`, formData);
            toast.success('Nhập thêm nguyên liệu thành công');
            refreshingredients();
            closeModal();
        } catch (error) {
            toast.error('Nhập thêm nguyên liệu thất bại!');
        }
    };

    const units = ingredient.unit.split('/');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/3 h-auto" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="text-xl font-bold mb-2">Nhập thêm nguyên liệu - {ingredient.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2">
                        <div>
                            <label>Số lượng nhập</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            {quantityError && <p className="text-red-500">{quantityError}</p>}
                        </div>
                        <div>
                            <label>Đơn vị nhập</label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={units[0]}
                                disabled
                            />
                            {quantityError && <p className="text-red-500">{quantityError}</p>}
                        </div>
                        <div>
                            <label>Giá nhập</label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                value={costPrice}
                                onChange={(e) => setCostPrice(e.target.value)}
                            />
                            {costPriceError && <p className="text-red-500">{costPriceError}</p>}
                        </div>
                        <div>
                            <label>Nhà cung cấp</label>
                            <input
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                placeholder='Nhập tên nhà cung cấp'
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-3">
                        <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-3 py-1 rounded-lg mr-2">
                            Hủy
                        </button>
                        <button type="submit" className="bg-green-400 text-white px-3 py-1 rounded-lg">
                            Nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
