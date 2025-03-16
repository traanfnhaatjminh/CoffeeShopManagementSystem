import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { register } from '@/store/auth-slice/authSlice';
import { ToastContainer, toast } from 'react-toastify';

const dataForm = {
  fullName: '',
  dob: '',
  email: '',
  phone: '',
  address: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: 'cashier',
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export default function AddUserModal({ closeModal }) {
  const [formData, setFormData] = useState(dataForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const validationSchema = yup.object({
    fullName: yup.string().required('Vui lòng nhập tên đầy đủ của bạn.'),
    dob: yup.date().required('Vui lòng chọn ngày sinh của bạn.'),
    email: yup.string().email('Địa chỉ email không hợp lệ.').required('Vui lòng nhập email của bạn.'),
    phone: yup
      .string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ.')
      .required('Vui lòng nhập số điện thoại của bạn.'),
    address: yup.string().required('Vui lòng nhập địa chỉ của bạn.'),
    username: yup.string().required('Vui lòng nhập tên người dùng của bạn.'),
    password: yup
      .string()
      .required('Mật khẩu không được để trống.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số.')
      .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in hoa.')
      .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường.')
      .matches(/[~!@#$%^&*()_+|}{><}]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp.')
      .required('Vui lòng nhập lại mật khẩu.'),
  });

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      console.log(formData);
      const result = await dispatch(register(formData));

      if (result.payload.success) {
        toast.success(result.payload.message);
      } else {
        toast.error(result.payload.message);
      }

      setErrors({});
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Tạo người dùng mới</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Tên đầy đủ</label>
            <input
              type="text"
              name="fullName"
              className="border rounded-md p-2 w-full"
              placeholder="Nguyễn Văn A ..."
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <div className="text-red-500 mt-1">{errors.fullName}</div>}
          </div>

          <div>
            <label>Ngày/Tháng/Năm Sinh</label>
            <input
              type="date"
              name="dob"
              className="border rounded-md p-2 w-full"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <div className="text-red-500 mt-1">{errors.dob}</div>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="border rounded-md p-2 w-full"
              placeholder="demo@gmail.com..."
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
          </div>
          <div>
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              className="border rounded-md p-2 w-full"
              placeholder="0977786928 ..."
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <div className="text-red-500 mt-1">{errors.phone}</div>}
          </div>
          <div>
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              className="border rounded-md p-2 w-full"
              placeholder="Hà Nội..."
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <div className="text-red-500 mt-1">{errors.address}</div>}
          </div>
          <div>
            <label>Tên người dùng</label>
            <input
              type="text"
              name="username"
              className="border rounded-md p-2 w-full"
              placeholder="nguyenvana..."
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="text-red-500 mt-1">{errors.username}</div>}
          </div>
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="border rounded-md p-2 w-full"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
          </div>
          <div>
            <label>Lặp lại mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              className="border rounded-md p-2 w-full"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="text-red-500 mt-1">{errors.confirmPassword}</div>}
          </div>
          <div>
            <label>Vai trò</label>
            <select name="role" className="border rounded-md p-2 w-full" value={formData.role} onChange={handleChange}>
              <option value="cashier">Thu ngân</option>
              <option value="warehouse manager">Quản lý kho</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">
            Hủy
          </button>
          <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSubmitForm}>
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
}
