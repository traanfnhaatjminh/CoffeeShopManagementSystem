import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-brown-900 font-lauren text-white py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex flex-col items-center md:items-start">
          <img src="../coffeehouse.png" alt="Logo" className="w-100 h-20 mb-4" />
          <p className="text-center md:text-left">
            Chào mừng bạn tới Coffe House, nơi bán ra những đồ uống ngon bổ rẻ, uống nó đã mà nó ngon mà nó đã gì đâu.
          </p>
        </div>

        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-white"
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-white"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
        </div>

        <div className="text-center md:text-right">
          <p>Liên hệ với chúng tôi: +123 456 7890</p>
          <p>Email: coffehouse2k5@gmail.com</p>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-gray-700">
        <p>&copy; 2024 Coffee House</p>
      </div>
    </footer>
  );
}

export default Footer;
