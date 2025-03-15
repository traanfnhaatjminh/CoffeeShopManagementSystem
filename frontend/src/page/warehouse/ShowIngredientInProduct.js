import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ShowIngredientInProduct({ product, closeModal }) {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get(`/products/${product._id}/ingredients`);
                setIngredients(response.data.ingredients);
            } catch (err) {
                console.error("Error fetching ingredients:", err);
                setError("Không thể tải nguyên liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, [product]);

    if (loading) return <p className="text-center">Đang tải...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    function splitUnit(number, unit) {
        const units = unit.split('/'); // Tách đơn vị bằng dấu '/'
        return {
            quantitative: `${number} ${units[1]}`,
        };
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                <h2 className="text-lg font-bold mb-4">Nguyên Liệu Thành Phần - {product.pname}</h2>
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Tên nguyên liệu</th>
                            <th className="border px-4 py-2">Định Lượng</th>
                            <th className="border px-4 py-2">Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ingredient, index) => (
                            <tr key={index} className="border">
                                <td className="border px-4 py-2">{ingredient.name}</td>
                                <td className="border px-4 py-2">
                                    {splitUnit(ingredient.quantitative, ingredient.unit).quantitative}
                                </td>
                                <td className="border px-4 py-2">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(ingredient.TotalPerIngredient)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
                    Đóng
                </button>
            </div>
        </div>
    );
}
