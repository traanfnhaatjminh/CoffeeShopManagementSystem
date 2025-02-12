// RegisterModal.js
import React, { useState } from 'react';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

const RegisterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const validationSchema = yup.object({
    email: yup.string().required('Email is required.').email('Invalid email format.'),
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate({ email }, { abortEarly: false });
      setErrors({});
      toast.success('Registration email sent!');
      onClose();
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <>
      <ToastContainer />
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button onClick={onClose} className="absolute top-2 right-2">
              <IoClose className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <button
                type="button"
                className="justify-center text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2 w-full"
                onClick={handleRegister}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterModal;
