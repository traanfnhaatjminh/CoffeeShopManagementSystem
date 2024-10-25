import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditProductModal({ product, closeModal, refreshProducts }) {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [quantityError, setQuantityError] = useState('');
    const [priceError, setPriceError] = useState('');

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

        if (product) {
            setProductName(product.pname);
            setQuantity(product.quantity);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category_id ? product.category_id._id : '');
            setImagePreview(product.image); // Đặt đường dẫn hình ảnh cho preview
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Tạo URL cho hình ảnh đã chọn
        } else {
            setImage('');
            setImagePreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setQuantityError('');
        setPriceError('');
        if (quantity <= 0) {
            setQuantityError('*Số lượng phải lớn hơn 0');
            return;
        }
        if (price <= 0) {
            setPriceError('*Giá phải lớn hơn 0');
            return;
        }
        const formData = new FormData();
        formData.append('pname', productName);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('category_id', category);
        if (image) {
            formData.append('image', image);  // Thêm file ảnh vào FormData
        }
        // const updatedProduct = { pname: productName, quantity, price, image, category_id: category };

        try {
            await axios.put(`/products/updateProduct/${product._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Cập nhật sản phẩm thành công!');
            refreshProducts();
            closeModal();
        } catch (error) {
            toast.error('Cập nhật sản phẩm thất bại!');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/3 h-auto" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="text-xl font-bold mb-2">Chỉnh sửa sản phẩm</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2">
                        <div>
                            <label>Tên sản phẩm</label>
                            <input
                                type="text"
                                name="productName"
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
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="border rounded-md p-2 w-full"
                                min="0"
                            />
                            {quantityError && <p className="text-red-500">{quantityError}</p>} {/* Error Message */}
                        </div>
                        <div>
                            <label>Giá</label>
                            <input
                                type="number"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border rounded-md p-2 w-full"
                                min="0"
                            />
                            {priceError && <p className="text-red-500">{priceError}</p>} {/* Error Message */}
                        </div>
                        <div>
                            <label>Hình ảnh</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="border rounded-md p-2 w-full"
                            />
                            {imagePreview && <img src={imagePreview} alt="Product" className="mt-2 w-16 h-16 object-cover rounded-lg" />}
                        </div>
                        <div>
                            <label>Danh mục</label>
                            <select
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border rounded-md p-2 w-full"
                            >
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
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
