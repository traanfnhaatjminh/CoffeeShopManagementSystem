import React, { useState } from 'react';
import HeaderAuthentication from '@/components/authentication/HeaderAuthentication';
import logoLoginMain from '@/assets/images/imgLogin.png';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdOutlineMail } from 'react-icons/md';
import * as yup from 'yup';
import { FaGoogle, FaUserLock, FaFacebook } from 'react-icons/fa';
import { login } from '@/store/auth-slice/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import MoonLoader from 'react-spinners/MoonLoader';
import RegisterModal from './RegisterModal';

const dataFormLogin = {
  email: '',
  password: '',
};
const cssOverride = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  margin: 'auto',
  zIndex: 9999,
};
const AuthLogin = () => {
  const [formData, setFormData] = useState(dataFormLogin);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const dispatch = useDispatch();
  const validationSchema = yup.object({
    email: yup.string().required('Email is required.').email('Invalid email format.'),
    password: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 character!')
      .matches(/[0-9]/, 'Password must contain at least one number.')
      .matches(/[A-Z]/, 'Password must const at least on uppercase letter.')
      .matches(/[a-z]/, 'Password must const at least lowercase letter.')
      .matches(/[~!@#$%^&*()_+|}{><}]/, 'Password must contain at least one symbol.'),
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      dispatch(login(formData)).then((data) => {
        if (data.payload.success) {
          setLoading(false);
          toast.success(data.payload.message);
        } else if (!data.payload.success || !data) {
          setLoading(false);
          toast.error(data.payload.message);
        }
      });
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      console.log('errors:', errors);
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
    <>
      <HeaderAuthentication position="justify-start container mx-auto " />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <div className="container px-20 flex font-mono relative">
        {loading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <MoonLoader loading={loading} size={50} cssOverride={cssOverride} color="#ffffff" />
          </div>
        )}
        <div className="w-5/12">
          <img src={logoLoginMain} alt="Img login" className="w-11/12 mt-7 ml-16" />
        </div>
        <div className="w-7/12">
          <div className="w-8/12 ml-40">
            <h1 className="header-container-form font-semibold text-5xl mt-5 text-amber-800 hover:text-amber-600">
              Welcome back
            </h1>
            <p className="sub-header mt-3">
              Login to access your <span className="text-[#FF1515]">CaffeShop</span> account
            </p>
            <form onSubmit={handleLogin}>
              <div className="form-login mt-3">
                <div className="email-login">
                  <label htmlFor="email">Your Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <MdOutlineMail
                        className="w-4 h-4 text-gray-500 dark:text-orange-300"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className=" bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600"
                      placeholder=""
                      value={formData.username}
                      onChange={handleChange}
                    ></input>
                  </div>
                  {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
                </div>
                <div className="password-login mt-4">
                  <label htmlFor="password">Password</label>
                  <div className="relative mb-1">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <FaUserLock
                        className="w-4 h-4 text-gray-500 dark:text-orange-300"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                  </div>
                  {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
                </div>
                <div className="feature-login flex justify-between mt-2">
                  <div className="remember-account flex items-center">
                    <input type="checkbox" id="check-remember" className="h-6" />
                    <label htmlFor="check-remember" className="pl-2">
                      Remember me
                    </label>
                  </div>
                  <Link className="forgot-password text-[#3B82F6]" to="./forgot-password">
                    Forgot password
                  </Link>
                </div>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full mt-4"
                >
                  Sign in to your account
                </button>
                <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
                <p className="register-account text-center font-mono">
                  Don’t have an account?{' '}
                  <span onClick={openRegisterModal} className="text-[#3B82F6] cursor-pointer">
                    Sign up
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLogin;
