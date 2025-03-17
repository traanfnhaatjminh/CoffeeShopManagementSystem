import React, { useState } from 'react';
import imgAvatar from '@/assets/images/avatar_staff.png';
import stars from '@/assets/img/Stars.svg';
import { FaMedal } from 'react-icons/fa';
import { FaRankingStar } from 'react-icons/fa6';
import { infoUser } from '@/data/profile';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EEditInfoUser, editInfoUser } from '@/data/profile';
import { IoIosCloseCircle, IoMdClose } from 'react-icons/io';
import * as yup from 'yup';
import MoonLoader from 'react-spinners/MoonLoader';
import { updateInfoUser } from '@/store/auth-slice/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import { ERoleUser } from '../../data/profile';

const Profile = () => {
  const dataUser = useSelector((state) => state.auth.user);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const cssOverride = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    zIndex: 9999,
  };
  const formDataUseAfterEdit = {
    [EEditInfoUser.userName]: dataUser.userName,
    [EEditInfoUser.email]: dataUser.email,
    [EEditInfoUser.phone]: dataUser.phone,
  };

  const [isEditInfoUser, setIsEditInfoUser] = useState(editInfoUser);
  const [dataFormInfoUser, setDataFormInfoUser] = useState(formDataUseAfterEdit);
  const [toggleModalEditUser, setToggleModalEditUser] = useState(false);
  const [errorValidation, serErrorValidation] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleValidationInput = yup.object().shape({
    userName: yup.string().required('Họ và tên không được để trống.'),
    email: yup.string().required('Email không được để trống.').email('Email không đúng định dạng.'),
    phone: yup
      .string()
      .required('Số điện thoại không được để trống.')
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ.'),
  });

  const handleChangePassword = () => {
    if (dataUser.role.role_name === ERoleUser.warehouse) {
      navigation('/warehouse/change-password');
    } else if (dataUser.role.role_name === ERoleUser.cashier) {
      navigation('/cashier/change-password');
    }
  };

  const handleEditInfoUser = (info) => {
    setIsEditInfoUser((prev) => ({
      ...prev,
      [info]: !editInfoUser[info],
    }));
  };

  const handleChangeInfoUser = async () => {
    try {
      serErrorValidation({});
      await handleValidationInput.validate(dataFormInfoUser, { abortEarly: false });
      setToggleModalEditUser(true);
    } catch (error) {
      const listError = {};
      error.inner.forEach((err) => {
        listError[err.path] = err.message;
      });
      serErrorValidation(listError);
    }
  };
  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setDataFormInfoUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCloseModal = () => {
    setToggleModalEditUser(false);
    setIsEditInfoUser(editInfoUser);
  };
  const handleConfirmChangePassword = async () => {
    setIsLoading(true);
    try {
      const pushData = {
        ...dataFormInfoUser,
        oldEmail: dataUser.email,
      };
      await dispatch(updateInfoUser(pushData)).then((data) => {
        if (data.payload.success) {
          toast.success(data.payload.message);
        } else {
          toast.error(data.payload.message);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setToggleModalEditUser(false);
      setIsEditInfoUser(editInfoUser);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <MoonLoader loading={isLoading} size={50} cssOverride={cssOverride} color="#ffffff" />
        </div>
      )}
      {toggleModalEditUser && (
        <div className="modalConfirm fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="content w-[420px] h-[220px] bg-white rounded-md px-4">
            <div className="modal_header flex justify-between items-center py-4 border-b-2 ">
              <span className="title_header text-2xl font-semibold">Xác nhận đổi thông tin</span>
              <IoMdClose className="w-5 h-5 cursor-pointer" onClick={handleCloseModal}></IoMdClose>
            </div>
            <div className="modal_detail mt-4 text-lg ">
              Bạn có chắc chắn muốn đổi thông tin tài khoản của bạn hay không ?
            </div>
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
      <div className="main_container flex flex-col lg:flex-row gap-6 items-center justify-center h-full p-6 bg-[#F5F5DC]">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
        <div className="info w-full md:w-2/3 lg:w-2/5 bg-white mt-5 lg:mt-5 shadow-lg rounded-lg p-6 border border-[#6B4226]">
          <div className="avatar flex flex-col sm:flex-row justify-between items-center">
            <img src={imgAvatar} alt="avatar" className="w-24 h-24 rounded-full border-4 border-[#6B4226]" />
          </div>

          <div className="info_user border border-gray-300 py-3 px-5 mt-5 rounded-lg bg-[#FFF9F2]">
            <div className="mb-4">
              <label className="text-sm text-gray-700">{infoUser.userName}</label>
              <div className="flex gap-2 flex-col">
                {isEditInfoUser.userName ? (
                  <div className="input_info flex justify-between flex-wrap gap-2 ">
                    <input
                      type="text"
                      value={dataFormInfoUser.userName}
                      name="userName"
                      onChange={handleChangeInput}
                      className="border-2 rounded-md pl-1  text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
                    />
                    <button
                      className="bg-[#82f673] text-black h-7 px-4 rounded-xl flex items-center hover:bg-[#47fa00] transition-all"
                      onClick={() => handleChangeInfoUser()}
                    >
                      Sửa
                    </button>
                  </div>
                ) : (
                  <div className="edit_info flex justify-between flex-wrap gap-2 ">
                    <span className="font-medium">{dataUser.userName}</span>
                    <button
                      className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all"
                      onClick={() => handleEditInfoUser(EEditInfoUser.userName)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )}
                {errorValidation.userName && (
                  <div className="text-red-500 flex items-center gap-1 text-xs">
                    <IoIosCloseCircle />
                    <span>{errorValidation.userName}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-700">{infoUser.email}</label>
              <div className="flex flex-col">
                {isEditInfoUser.email ? (
                  <div className="flex justify-between flex-wrap gap-2">
                    <input
                      type="text"
                      value={dataFormInfoUser.email}
                      name="email"
                      onChange={handleChangeInput}
                      className="border-2 rounded-md pl-1 w-[280px]  text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
                    />
                    <button
                      className="bg-[#82f673] text-black h-7 px-4 rounded-xl flex items-center hover:bg-[#47fa00] transition-all"
                      onClick={() => handleChangeInfoUser()}
                    >
                      Sửa
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between flex-wrap gap-2">
                    <span className="font-medium">{dataUser.email}</span>
                    <button
                      className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all"
                      onClick={() => handleEditInfoUser(EEditInfoUser.email)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )}
                {errorValidation.email && (
                  <div className="text-red-500 flex items-center gap-1 text-xs mt-2">
                    <IoIosCloseCircle />
                    <span>{errorValidation.email}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-700">{infoUser.phone || 'Chưa cập nhật'}</label>
              <div className="flex flex-col gap-2">
                {isEditInfoUser.phone ? (
                  <div className="flex justify-between flex-wrap gap-2">
                    <input
                      type="text"
                      value={dataFormInfoUser.phone}
                      name="phone"
                      onChange={handleChangeInput}
                      className="border-2  text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226] rounded-md pl-1"
                    />
                    <button
                      className="bg-[#82f673] text-black h-7 px-4 rounded-xl flex items-center hover:bg-[#47fa00] transition-all"
                      onClick={() => handleChangeInfoUser()}
                    >
                      Sửa
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between flex-wrap gap-2">
                    <span className="font-medium">{dataUser.phone}</span>
                    <button
                      className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all"
                      onClick={() => handleEditInfoUser(EEditInfoUser.phone)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )}
                {errorValidation.phone && (
                  <div className="text-red-500 flex items-center gap-1 text-xs">
                    <IoIosCloseCircle />
                    <span>{errorValidation.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="info_about_more_user border border-gray-300 p-5 mt-5 rounded-lg bg-[#FFF9F2]">
            <div className="flex justify-between">
              <span>
                Thông tin thêm về <span className="text-yellow-700 text-lg">{dataUser.userName}</span>
              </span>
              <button
                className="bg-[#6B4226] text-white h-10 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all"
                onClick={() => handleChangePassword()}
              >
                Đổi mật khẩu
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <span className="font-medium">{dataUser.userName}</span> là một nhân viên tận tâm, có tinh thần trách
              nhiệm cao và luôn giữ thái độ chuyên nghiệp trong công việc. Trong suốt thời gian làm việc,{' '}
              {dataUser.userName} luôn thể hiện sự nhanh nhẹn, chủ động và linh hoạt trong mọi tình huống.
            </p>
          </div>
        </div>

        <div className="more w-full md:w-2/3 lg:w-1/3 bg-white mt-5 lg:mt-10 shadow-lg rounded-lg p-6 border border-[#6B4226]">
          <div className="border border-gray-300 p-5 rounded-lg flex justify-between items-center bg-[#FFF9F2]">
            <div>
              <h3 className="font-medium">Thông tin chi tiết</h3>
              <p className="text-sm text-gray-600">Thông tin chi tiết chuyên môn được hiển thị.</p>
            </div>
            <img src={stars} alt="stars" className="w-16 h-16" />
          </div>

          <div className="skill_user mt-5">
            <h2 className="text-lg font-semibold">Chuyên môn</h2>
            <div className="flex flex-wrap gap-3 mt-3">
              <button className="bg-[#D3B8A0] px-4 py-2 rounded-3xl text-sm hover:bg-[#B89578] transition-all">
                Thu Ngân
              </button>
              <button className="bg-[#D3B8A0] px-4 py-2 rounded-3xl text-sm hover:bg-[#B89578] transition-all">
                Phục Vụ
              </button>
              <button className="bg-[#D3B8A0] px-4 py-2 rounded-3xl text-sm hover:bg-[#B89578] transition-all">
                Đầu Bếp
              </button>
              <button className="bg-[#D3B8A0] px-4 py-2 rounded-3xl text-sm hover:bg-[#B89578] transition-all">
                Quản Kho
              </button>
            </div>
          </div>

          <div className="experience_user mt-5">
            <h2 className="text-lg font-semibold mb-2">Kinh Nghiệm</h2>
            <div className="border border-gray-300 p-5 rounded-lg flex justify-between items-center bg-[#FFF9F2]">
              <div>
                <h3 className="font-medium">1 Năm</h3>
                <p className="text-sm text-gray-600">Ở vị trí thu ngân</p>
              </div>
              <div className="bg-orange-300 px-4 py-2 rounded-lg">
                <FaMedal className="w-8 h-8"></FaMedal>
              </div>
            </div>
          </div>

          <div className="vote_user mt-5">
            <h2 className="text-lg font-semibold mb-2">Đánh giá từ khách hàng</h2>
            <div className="border border-gray-300 p-5 rounded-lg flex justify-between items-center bg-[#FFF9F2]">
              <div>
                <h3 className="font-medium">4 Sao</h3>
                <p className="text-sm text-gray-600">Từ 108 người</p>
              </div>
              <div className="bg-yellow-300 px-4 py-2 rounded-lg">
                <FaRankingStar className="w-8 h-8"></FaRankingStar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
