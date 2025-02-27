import React, { useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { labelChangePassword, dataInfoPassword, sloganChangePassword, titleChangePassword } from '@/data/profile';
import { formChangePassword } from '@/data/profile';
import * as yup from 'yup';
import MoonLoader from 'react-spinners/MoonLoader';
import { IoIosCloseCircle, IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '@/store/auth-slice/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import { ERoleUser } from '../../data/profile';

const cssOverride = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  margin: 'auto',
  zIndex: 9999,
};

const ChangePassword = () => {
  const dispatch = useDispatch();
  const dataUser = useSelector((state) => state.auth.user);
  const [formDataChangePassword, setFormDataChangePassword] = useState(formChangePassword);
  const [errorValidate, setErrorValidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [confirmChangePassword, setConfirmChangePassword] = useState(false);

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFormDataChangePassword({
      ...formDataChangePassword,
      [name]: value,
    });
  };

  const handleValidationInput = yup.object().shape({
    oldPassword: yup.string().required('Mật khẩu không được để trống.'),
    newPassword: yup
      .string()
      .required('Mật khẩu mới không được để trống.')
      .min(8, 'Mật khẩu cần tối thiểu 8 ký tự.')
      .matches(/[0-9]/, 'Mật khẩu cần tối thiểu 1 số.')
      .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa.')
      .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết thường.')
      .matches(/[~!@#$%^&*()_+|}{><}]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Không khớp với mật khẩu mới.')
      .required('Xác nhận mật khẩu không được để trống'),
  });

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      setErrorValidate({});
      await handleValidationInput.validate(formDataChangePassword, { abortEarly: false });
      setModalChangePassword(true);
    } catch (error) {
      const listError = {};
      error.inner.forEach((err) => {
        listError[err.path] = err.message;
      });
      setErrorValidate(listError);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalChangePassword(false);
    setConfirmChangePassword(false);
  };

  const handleConfirmChangePassword = async () => {
    setConfirmChangePassword(true);
    try {
      await dispatch(updatePassword({ ...formDataChangePassword, email: dataUser.email })).then((data) => {
        if (data.payload.success) {
          setFormDataChangePassword({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setModalChangePassword(false);
          toast.success(data.payload.message);
        } else {
          setModalChangePassword(false);
          toast.error(data.payload.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <MoonLoader loading={loading} size={50} cssOverride={cssOverride} color="#ffffff" />
        </div>
      )}
      {modalChangePassword && (
        <div className="modalConfirm fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="content w-[420px] h-[220px] bg-white rounded-md px-4">
            <div className="modal_header flex justify-between items-center py-4 border-b-2 ">
              <span className="title_header text-2xl font-semibold">Xác nhận đổi mật khẩu</span>
              <IoMdClose className="w-5 h-5 cursor-pointer" onClick={handleCloseModal}></IoMdClose>
            </div>
            <div className="modal_detail mt-4 text-lg ">Bạn có chắc chắn muốn đổi mật khẩu của bạn hay không ?</div>
            <div className="modal_footer flex justify-end pr-5 gap-2 mt-5">
              <button
                className="cancel bg-brown-600 text-white py-2 px-5 rounded-lg hover:bg-blue-400"
                onClick={handleCloseModal}
              >
                Quay lại
              </button>
              <button
                className="confirm bg-slate-400 text-white py-2 px-5 rounded-lg hover:bg-red-500"
                onClick={handleConfirmChangePassword}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main_container flex flex-col lg:flex-row gap-6 items-center justify-center h-full p-6 bg-[#F5F5DC] pt-0">
        <Link
          className="back absolute top-24 left-36 flex items-center gap-1 hover:text-brown-700"
          to={dataUser.role.role_name === ERoleUser.cashier ? '/cashier/profile' : '/warehouse/profile'}
        >
          <IoArrowBackSharp />
          <span className="text-lg">Trở về</span>
        </Link>
        <div className="info w-full md:w-2/3 lg:w-1/3 bg-[#FFF9F2] mt-10 lg:mt-0 shadow-lg rounded-lg p-6 border border-[#6B4226]">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
          <h2 className="flex justify-center text-3xl font-mono font-semibold text-[#6B4226]">
            {titleChangePassword.titleChange}
          </h2>

          <form className="mt-4 space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-lg text-[#6B4226]">
                {labelChangePassword.oldPassword}
              </label>
              <div className="input_oldPassword flex justify-center items-center">
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={formDataChangePassword.oldPassword}
                  autoComplete="on"
                  className={`w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226] ${errorValidate.oldPassword ? 'border-red-500' : ''}`}
                  onChange={handleChangeInput}
                />
              </div>
              {errorValidate.oldPassword && (
                <div className="text-red-500 my-2 flex items-center gap-1">
                  <IoIosCloseCircle />
                  <span>{errorValidate.oldPassword}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-lg text-[#6B4226]">
                {labelChangePassword.newPassword}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formDataChangePassword.newPassword}
                autoComplete="on"
                className={`w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226] ${errorValidate.newPassword ? 'border-red-500' : ''}`}
                onChange={handleChangeInput}
              />
              {errorValidate.newPassword && (
                <div className="text-red-500 my-2 flex items-center gap-1">
                  <IoIosCloseCircle />
                  <span>{errorValidate.newPassword}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lg text-[#6B4226]">
                {labelChangePassword.confirmPassword}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formDataChangePassword.confirmPassword}
                autoComplete="on"
                className={`w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226] ${errorValidate.confirmPassword ? 'border-red-500' : ''}`}
                onChange={handleChangeInput}
              />
              {errorValidate.confirmPassword && (
                <div className="text-red-500 my-2 flex items-center gap-1">
                  <IoIosCloseCircle />
                  <span>{errorValidate.confirmPassword}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-[#6B4226] text-white font-semibold text-lg rounded-lg hover:bg-[#5a3b1f]"
                onClick={handleChangePassword}
              >
                Đổi Mật Khẩu
              </button>
            </div>
          </form>
        </div>

        <div className="info-box w-full md:w-2/3 lg:w-1/3 bg-[#FFF9F2] mt-5 lg:mt-0 shadow-lg rounded-lg p-6 border border-[#6B4226] flex flex-col items-center text-center gap-8">
          <h3 className="text-2xl font-semibold text-[#6B4226] font-mono pt-5">
            {titleChangePassword.titleInfoPassword}
          </h3>
          <ul className="mt-4 text-[#6B4226] text-lg list-disc list-inside text-left">
            {dataInfoPassword.map((item, index) => {
              return <li key={item | index}>{item}</li>;
            })}
          </ul>
          {sloganChangePassword &&
            sloganChangePassword.map((item, index) => {
              return (
                <p className="text-lg italic text-[#6B4226]  font-mono" key={item | index}>
                  {item}
                </p>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
