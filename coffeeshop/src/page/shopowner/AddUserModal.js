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
  status: '1',
};
export default function AddUserModal({ closeModal }) {
  const [formData, setFormData] = useState(dataForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const validationSchema = yup.object({
    fullName: yup.string().required('Please enter your full name.'),
    dob: yup.date().required('Please select your date of birth.'),
    email: yup.string().email('Invalid email address.').required('Please enter your email.'),
    phone: yup
      .string()
      .matches(/^[0-9]{10,11}$/, 'Invalid phone number.')
      .required('Please enter your phone number.'),
    address: yup.string().required('Please enter your address.'),
    username: yup.string().required('Please enter your username.'),
    password: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 characters long.')
      .matches(/[0-9]/, 'Password must contain at least one number.')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .matches(/[~!@#$%^&*()_+|}{><}]/, 'Password must contain at least one symbol.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords do not match.')
      .required('Please confirm your password.'),
  });

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await validationSchema.validate(formData, { abortEarly: false });
      dispatch(register(formData)).then((data) => {
        console.log('data:', data);
        if (data.payload.success) {
          toast.success(data.payload.message);
        } else if (!data.payload.success || !data) {
          toast.error(data.payload.message);
        }
      });
      console.log('formData:', formData);
      setErrors({});
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      console.log('error:', errors);
    } finally {
      setLoading(false);
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
              <option value="warehouse">Quản lý kho</option>
            </select>
          </div>
          <div>
            <label>Trạng thái</label>
            <select
              name="status"
              className="border rounded-md p-2 w-full"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="1">Đang hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">
            Hủy
          </button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSubmitForm}>
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
}
