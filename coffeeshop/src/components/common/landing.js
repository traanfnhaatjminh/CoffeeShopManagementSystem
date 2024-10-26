import React from 'react';
import landingpage from '@/assets/images/landingpage.png';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200">
      <header className="flex justify-between items-center p-6">
        <div className="text-xl font-bold text-gray-700 flex items-center space-x-2"></div>
      </header>

      <main className="flex flex-col md:flex-row justify-between items-center px-32 ">
        <div className="max-w-lg">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 font-pacifico italic">Coffe House</h1>
          <p className="text-3xl text-gray-600 mb-6 italic font-semibold">Management</p>
          <p className="text-gray-500 mb-8">
            Chào mừng bạn đến với hệ thống quản lý quán cà phê. Hệ thống này được thiết kế để giúp bạn quản lý quán cà
            phê của mình{' '}
          </p>
          <p className="text-gray-500 mb-8">Ngày hôm nay cũng làm việc thật chăm chỉ nhé ‧𓍢ִ໋☕ ׂ 𓈒 ⋆ ۪ </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-white text-gray-800 border border-gray-500 hover:bg-gray-200 rounded-full font-lauren">
              <Link to={'auth/register'}>Sign Up For A Trial</Link>
            </button>
            <button className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 rounded-full font-lauren">
              <Link to={'auth/login'}>Sign In</Link>
            </button>
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <img src={landingpage} alt="Coffee cup" className="w-110 h-110" />
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
// "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/640px-A_small_cup_of_coffee.JPG"
