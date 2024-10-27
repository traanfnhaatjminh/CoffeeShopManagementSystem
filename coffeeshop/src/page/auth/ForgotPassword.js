import React, { useState } from 'react';
import HeaderAuthentication from '@/components/authentication/HeaderAuthentication';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import imageForgotPassword from '@/assets/images/forgotPassword.webp';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { forgotPassword } from '@/store/auth-slice/authSlice';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const validationSchema = yup.object({
    email: yup.string().required('Email is required.').email('Invalid email format.'),
  });
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await validationSchema.validate({ email }, { abortEarly: false });
      setErrors({});
      dispatch(forgotPassword({ email })).then((data) => {
        console.log('data:', data);
        if (data.payload.success) {
          navigate('/auth/login/verify-password');
        } else if (!data.payload.success || !data) {
          toast.error(data.payload.message);
        }
      });
    } catch (err) {
      console.log(err);
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event) => {
    setEmail(event.target.value);
    console.log('email:', email);
  };
  return (
    <>
      <HeaderAuthentication></HeaderAuthentication>
      <div className="container font-mono flex">
        <div className="content-left w-5/12 pl-36 mt-10">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
          <Link className="btn-back flex items-center w-4/12" to="/auth/login">
            <IoIosArrowBack />
            <p className="ml-2 font-bold">Back to login</p>
          </Link>
          <h1 className="title-page font-semibold text-4xl mt-10 hover:text-amber-600">Forgot your password?</h1>
          <p className="mt-3 text-base w-11/12">
            Don't worry , happens to all of us . Enter your email below to recover your password
          </p>
          <div className="email mt-5 w-11/12">
            <div className="relative mb-2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-orange-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <input
                type="text"
                id="email"
                name="email"
                className="text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600"
                placeholder=""
                onChange={handleChange}
              ></input>
            </div>
            {errors.email && <div className="text-red-500 mb-3">{errors.email}</div>}
          </div>
          <button
            type="button"
            className="w-11/12 mt-2 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="content-right w-7/12">
          <img src={imageForgotPassword} alt="Img login" className="w-9/12 ml-40" />
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
