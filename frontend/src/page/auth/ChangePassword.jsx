import React from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { labelChangePassword, dataInfoPassword, sloganChangePassword, titleChangePassword } from '@/data/profile';

const ChangePassword = () => {
  return (
    <div className="main_container flex flex-col lg:flex-row gap-6 items-center justify-center h-full p-6 bg-[#F5F5DC] pt-0">
      <Link
        className="back absolute top-24 left-36 flex items-center gap-1 hover:text-brown-700"
        to={'/cashier/profile'}
      >
        <IoArrowBackSharp />
        <span className="text-lg">Trở về</span>
      </Link>
      <div className="info w-full md:w-2/3 lg:w-1/3 bg-[#FFF9F2] mt-5 lg:mt-0 shadow-lg rounded-lg p-6 border border-[#6B4226] lg:h-[80%]">
        <h2 className="flex justify-center text-3xl font-mono font-semibold text-[#6B4226]">
          {titleChangePassword.titleChange}
        </h2>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-lg text-[#6B4226]">
              {labelChangePassword.oldPassword}
            </label>
            <input
              type="password"
              id="oldPassword"
              className="w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-lg text-[#6B4226]">
              {labelChangePassword.newPassword}
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full mt-2 p-3 border rounded-lg text-gray-700 border-[#6B4226] focus:outline-none focus:ring-2 focus:ring-[#6B4226]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-lg text-[#6B4226]">
              {labelChangePassword.confirmPassword}
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

      <div className="info-box w-full md:w-2/3 lg:w-1/3 bg-[#FFF9F2] mt-5 lg:mt-0 shadow-lg rounded-lg p-6 border border-[#6B4226] lg:h-[80%] flex flex-col items-center text-center gap-8">
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
  );
};

export default ChangePassword;
