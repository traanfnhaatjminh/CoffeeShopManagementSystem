import React from 'react';

const ChangePassword = () => {
  return (
    <div className="main_container flex flex-col lg:flex-row gap-6 items-center justify-center h-auto lg:h-[90%] p-6 bg-[#F5F5DC] pt-0">
      <div className="info w-full md:w-2/3 lg:w-1/3 bg-[#FFF9F2] mt-5 lg:mt-5 shadow-lg rounded-lg p-6 border border-[#6B4226] lg:h-[80%] lg:pt-[30px]">
        <h2 className="flex justify-center text-3xl font-mono font-semibold text-[#6B4226]">Đổi Mật Khẩu</h2>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-lg text-[#6B4226]">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              id="oldPassword"
              className="w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-lg text-[#6B4226]">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-lg text-[#6B4226]">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-[#6B4226] text-white font-semibold text-lg rounded-lg hover:bg-[#5a3b1f]"
            >
              Đổi Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
