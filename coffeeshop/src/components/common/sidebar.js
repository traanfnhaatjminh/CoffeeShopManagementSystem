import React from 'react';
import { FaHome, FaWarehouse, FaThList } from 'react-icons/fa';

import { MdCategory, MdListAlt, MdLeaderboard } from 'react-icons/md';
import { HiMiniClipboardDocumentList } from 'react-icons/hi2';
import { IoIosSettings } from 'react-icons/io';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo_cafes.png'

function Sidebar() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-28 bg-brown-800 p-4 flex flex-col items-center space-y-4 justify-self-center">
        <img src={logo} alt="Logo" className="w-8 h-8 mr-2" style={{ width: 70, height: 70 }} />
        <div className="abc">
          <FaHome className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Home</span>
          </Link>
        </div>
        <div className="abc">
          <FaWarehouse className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/warehouse/products">
            <span className="text-sm text-gray-700 font-lauren font-semibold">WareHouse</span>
          </Link>
        </div>
        <div className="abc">
          <MdCategory className="w-6 h-6 mb-1 text-gray-700" />

          <Link to="/warehouse/categories">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Categories</span>
          </Link>
        </div>
        <div className="abc">
          <FaThList className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/waiter">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Table List</span>
          </Link>
        </div>
        <div className="abc">
          <MdListAlt className="w-6 h-6 mb-1 text-gray-700" />
          <span className="text-sm text-gray-700 font-lauren font-semibold">All Bill</span>
        </div>
        <div className="abc">
          <HiMiniClipboardDocumentList className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/admin/jobboard">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Job Board</span>
          </Link>
        </div>
        <div className="abc">
          <MdLeaderboard className="w-6 h-6 mb-1 text-gray-700" />
          <span className="text-sm text-gray-700 font-lauren font-semibold">Statistic</span>
        </div>
        <div className="abc">
          <IoIosSettings className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/admin/userlist">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Setting</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
