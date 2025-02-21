import React from 'react';
import imgAvatar from '@/assets/images/avatar_staff.png';
import stars from '@/assets/img/Stars.svg';
import { FaMedal } from 'react-icons/fa';
import { FaRankingStar } from 'react-icons/fa6';
import { infoUser } from '@/data/profile';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigation = useNavigate();
  const handleChangePassword = () => {
    navigation('/cashier/change-password');
  };
  const dataUser = useSelector((state) => state.auth.user);
  return (
    <div className="main_container flex flex-col lg:flex-row gap-6 items-center justify-center h-auto lg:h-[90%] p-6 bg-[#F5F5DC]">
      <div className="info w-full md:w-2/3 lg:w-2/5 bg-white mt-5 lg:mt-5 shadow-lg rounded-lg p-6 border border-[#6B4226]">
        <div className="avatar flex flex-col sm:flex-row justify-between items-center">
          <img src={imgAvatar} alt="avatar" className="w-24 h-24 rounded-full border-4 border-[#6B4226]" />
          <button className="bg-[#6B4226] text-white h-10 px-6 rounded-3xl mt-3 sm:mt-0 hover:bg-[#8B5E3C] transition-all">
            Chỉnh sửa ảnh
          </button>
        </div>

        <div className="info_user border border-gray-300 p-5 mt-5 rounded-lg bg-[#FFF9F2]">
          <div className="mb-4">
            <label className="text-sm text-gray-700">{infoUser.userName}</label>
            <div className="flex justify-between flex-wrap gap-2">
              <span className="font-medium">{dataUser.userName}</span>
              <button className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all">
                Chỉnh sửa
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-700">{infoUser.email}</label>
            <div className="flex justify-between flex-wrap gap-2">
              <span className="font-medium">{dataUser.email}</span>
              <button className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all">
                Chỉnh sửa
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-700">{infoUser.phone || 'Chưa cập nhật'}</label>
            <div className="flex justify-between flex-wrap gap-2">
              <span className="font-medium">{dataUser.phone}</span>
              <button className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>

        <div className="info_about_more_user border border-gray-300 p-5 mt-5 rounded-lg bg-[#FFF9F2]">
          <div className="flex justify-between">
            <span>
              Thông tin thêm về <span className="text-yellow-700 text-lg">Tuấn</span>
            </span>
            <button
              className="bg-[#6B4226] text-white h-7 px-4 rounded-xl flex items-center hover:bg-[#8B5E3C] transition-all"
              onClick={() => handleChangePassword()}
            >
              Đổi mật khẩu
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Lương Quốc Tuấn là một nhân viên tận tâm, có tinh thần trách nhiệm cao và luôn giữ thái độ chuyên nghiệp
            trong công việc. Trong suốt thời gian làm việc, Tuấn luôn thể hiện sự nhanh nhẹn, chủ động và linh hoạt
            trong mọi tình huống.
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
            <button className="bg-green-300 px-4 py-2 rounded-3xl text-sm hover:bg-green-500 transition-all">
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
  );
};

export default Profile;
