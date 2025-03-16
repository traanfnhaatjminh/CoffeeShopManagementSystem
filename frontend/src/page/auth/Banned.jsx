import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BannedAccountPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/auth/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-brown-100 to-brown-300">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-brown-600">Tài khoản của bạn đã bị khóa</h2>
          <FaTimesCircle className="text-brown-600 w-6 h-6 cursor-pointer" onClick={handleBack} />
        </div>
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">Rất tiếc, tài khoản của bạn đã bị ban do vi phạm chính sách.</p>
          <p className="text-sm text-gray-500 mb-6">Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.</p>
          <button
            className="bg-brown-600 text-white px-6 py-3 rounded-lg hover:bg-brown-700 transition duration-300"
            onClick={handleBack}
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannedAccountPage;
