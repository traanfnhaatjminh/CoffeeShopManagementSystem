import React, { useState } from 'react';
import HeaderAuthentication from '@/components/authentication/HeaderAuthentication';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import resetPasswordImg from '@/assets/images/resetPassword.webp';
import { FaUser } from 'react-icons/fa6';
import { FaUserGroup } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { resetPassword } from '@/store/auth-slice/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import MoonLoader from 'react-spinners/MoonLoader';

const cssOverride = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  margin: 'auto',
  zIndex: 9999,
};
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = yup.object({
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
  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await validationSchema.validate({ password, confirmPassword }, { abortEarly: false });
      dispatch(resetPassword({ email, newPassword: password })).then((data) => {
        if (data.payload.success) {
          setLoading(false);
          toast.success(data.payload.message);
          setTimeout(() => {
            navigate('/auth/login');
          }, 2000);
        } else if (!data || !data.payload.success) {
          setLoading(false);
          toast.error(data.payload.message);
        }
      });
      setErrors({});
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      setLoading(false);
    }
  };
  return (
    <>
      <HeaderAuthentication></HeaderAuthentication>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <MoonLoader loading={loading} size={50} cssOverride={cssOverride} color="#ffffff" />
        </div>
      )}
      <div className="container font-mono flex">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
        <div className="content-right w-7/12">
          <img src={resetPasswordImg} alt="Img login" className="w-7/12 ml-40" />
        </div>
        <div className="content-left w-5/12 pl-14 mt-10">
          <Link className="btn-back flex items-center w-3/12" to="/auth/login">
            <IoIosArrowBack />
            <p className="ml-2 font-bold">Quay về</p>
          </Link>
          <h1 className="title-page font-semibold text-4xl mt-10 hover:text-amber-600">Đặt mật khẩu</h1>
          <p className="mt-5 text-base w-11/12">Vui lòng đặt mật khẩu mới cho tài khoản của bạn.</p>
          <div className="reset-password w-4/5 mt-5">
            <label htmlFor="password">Tạo mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <FaUser className="w-4 h-4 text-slate-400 dark:text-yellow-800" fill="currentColor" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              ></input>
            </div>
            {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
          </div>
          <div className="re-enter-password w-4/5 mt-3">
            <label htmlFor="re-enter">Nhập lại mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <FaUserGroup className="w-4 h-4 text-slate-400 dark:text-yellow-800" fill="currentColor" />
              </div>
              <input
                type="password"
                id="re-enter"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              ></input>
            </div>
            {errors.confirmPassword && <div className="text-red-500 mt-1">{errors.confirmPassword}</div>}
          </div>
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-4/5 mt-3 focus:outline-none text-white bg-teal-500 hover:bg-teal-300 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus:ring-teal-200"
          >
            Đặt mật khẩu
          </button>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
