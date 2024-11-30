import React from 'react';
import { FaHome, FaWarehouse, FaThList } from 'react-icons/fa';
import { MdCategory, MdListAlt, MdLeaderboard } from 'react-icons/md';
import { IoIosSettings } from 'react-icons/io';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-28 bg-brown-800 p-4 flex flex-col items-center space-y-4 justify-self-center">
        <div className="abc">
          <FaHome className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/admin/createbill">
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
          <Link to="/admin/tablelist">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Table List</span>
          </Link>
        </div>
        <div className="abc">
          <MdListAlt className="w-6 h-6 mb-1 text-gray-700" />

          <Link to="/admin/allbill">
            <span className="text-sm text-gray-700 font-lauren font-semibold">AllBill</span>
          </Link>
        </div>
        <div className="abc">
          <MdLeaderboard className="w-6 h-6 mb-1 text-gray-700" />
          <Link to="/admin/statistic">
            <span className="text-sm text-gray-700 font-lauren font-semibold">Statistic</span>
          </Link>
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
