import React from 'react';
import { FaHome, FaWarehouse, FaThList } from 'react-icons/fa';

import { MdCategory, MdListAlt, MdLeaderboard } from "react-icons/md";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { IoIosSettings } from "react-icons/io";
import { Link } from 'react-router-dom';
function Sidebar() {
    return (
        <div className='flex min-h-screen'>
            <aside className="w-max bg-brown-800 p-4 flex flex-col items-center space-y-4">
                <div className="abc">
                    <FaHome className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">Home</span>
                </div>
                <div className="abc">
                    <FaWarehouse className="w-6 h-6 mb-2 text-gray-700" />
                    <Link to="/warehouse/products"><span className="text-sm text-gray-700 font-lauren font-semibold">WareHouse</span></Link>
                </div>
                <div className="abc">
                    <MdCategory className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">Categories</span>
                </div>

                <div className="abc">
                    <FaThList className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">TableList</span>
                </div>
                <div className="abc">
                    <MdListAlt className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">AllBill</span>
                </div>
                <div className="abc">
                    <HiMiniClipboardDocumentList className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">JobBoard</span>
                </div>
                <div className="abc">
                    <MdLeaderboard className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">Statistic</span>
                </div>
                <div className="abc">
                    <IoIosSettings className="w-6 h-6 mb-2 text-gray-700" />
                    <span className="text-sm text-gray-700 font-lauren font-semibold">Setting</span>
                </div>
            </aside>
            </div>
    );
}

export default Sidebar;
