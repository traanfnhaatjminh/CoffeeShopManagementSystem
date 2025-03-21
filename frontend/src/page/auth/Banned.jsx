import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BannedAccountPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/auth/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5E8C7] px-4">
      <div className="bg-[#F8E4C9] p-10 rounded-2xl shadow-lg w-full max-w-lg border border-[#D2B48C] text-center">
        <div className="flex justify-center mb-4"></div>
        <h2 className="text-2xl font-semibold text-[#5D4037] mb-4">Tài khoản bị khóa</h2>
        <p className="text-[#6D4C41] text-lg mb-2">Rất tiếc, tài khoản của bạn đã bị khóa.</p>
        <p className="text-sm text-[#8D6E63] mb-6">Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.</p>
        <button
          className="bg-[#8D6E63] text-white px-6 py-3 rounded-lg hover:bg-[#6D4C41] transition duration-300 w-full font-medium"
          onClick={handleBack}
        >
          Quay lại đăng nhập
        </button>
        <div className="mt-4 flex justify-center">
          <FaTimesCircle className="text-[#8D6E63] w-8 h-8 cursor-pointer" onClick={handleBack} />
        </div>
      </div>
    </div>
  );
};

export default BannedAccountPage;
