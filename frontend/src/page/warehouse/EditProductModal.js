import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditProductModal({ product, closeModal, refreshProducts }) {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [productNameError, setProductNameError] = useState('');
    const [salePriceError, setSalePriceError] = useState('');
    const [imageError, setImageError] = useState('');

    //list categories
    useEffect(() => {
        fetch('/categories/list')
            .then((res) => res.json())
            .then((data) => {
                console.log('Fetched Categories:', data); // In ra response để kiểm tra
                setCategories(data.categories || []); // Đảm bảo nó là mảng
            })
            .catch((error) => console.error('Error fetching categories:', error));

        if (product) {
            setProductName(product.pname);
            setPrice(product.sale_price);
            setImage(product.image);
            setCategory(product.category_id ? product.category_id._id : '');
            setImagePreview(product.image); //xem trc ảnh
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
                setImageError('');
            } else {
                setImage(null);
                setImagePreview('');
                setImageError('*Tệp không hợp lệ. Vui lòng chọn tệp hình ảnh.')
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalePriceError('');
        setImageError('');

        // Kiểm tra tên sản phẩm (chỉ cho phép chữ và khoảng trắng)
        if (!/^[A-Za-zÀ-Ỹà-ỹ\s]+$/.test(productName)) {
            setProductNameError('*Tên sản phẩm không hợp lệ. Không được chứa số hoặc ký tự đặc biệt!');
            return;
        }

        // Kiểm tra giá bán (chỉ cho phép số dương)
        if (isNaN(price) || price <= 0) {
            setSalePriceError('*Giá bán phải là số và lớn hơn 0!');
            return;
        }

        if (imageError) {
            setImageError('*Vui lòng chọn tệp hình ảnh');
            return;
        }

        const formData = new FormData();
        formData.append('pname', productName);
        formData.append('sale_price', price);
        formData.append('category_id', category);
        if (image) {
            formData.append('image', image);  // thêm file ảnh vào FormData
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
            if (error.response && error.response.status === 400) {
                setProductNameError(error.response.data.message);
            } else {
                toast.error('Cập nhật sản phẩm thất bại!');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/3 h-auto" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="text-xl font-bold mb-2">Chỉnh sửa thông tin đồ uống</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2">
                        <div>
                            <label>Tên đồ uống</label>
                            <input
                                type="text"
                                name="productName"
                                className="border rounded-md p-2 w-full"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                            {productNameError && <p className="text-red-500 text-sm mt-1">{productNameError}</p>}

                        </div>
                        <div>
                            <label>Giá bán</label>
                            <input
                                type="number"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border rounded-md p-2 w-full"
                                min="0"
                            />
                            {salePriceError && <p className="text-red-500">{salePriceError}</p>}
                        </div>

                        <div>
                            <label>Hình ảnh</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="border rounded-md p-2 w-full"
                            />
                            {imageError && <p className="text-red-500">{imageError}</p>}
                            {imagePreview && <img src={imagePreview} alt="Product" className="mt-2 w-16 h-16 object-cover rounded-lg" />}
                        </div>
                        <div>
                            <label>Loại đồ uống</label>
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
