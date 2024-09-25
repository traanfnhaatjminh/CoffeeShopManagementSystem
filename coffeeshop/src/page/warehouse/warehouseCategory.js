import React from 'react';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import Sidebar from './sidebar';
import Navbar from './navbar';

const data = [
    { id: 1, categoryId: "1", groupName: "Cà phê", categoryName: "Cà phê highlight", des: "Ngon lắm, cà phê đẹp" },
    { id: 2, categoryId: "2", groupName: "Trà trái cây-Hitea", categoryName: "Trà trái cây", des: "Ngon vừa, cà phê đẹp" },
];

function WarehouseCategory() {
    return (
        <div className='flex flex-col min-h-screen'>
        <Navbar />
        <div className="flex flex-1">
        <Sidebar />
            <div className="flex-1 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold px-2 font-lauren  bg-brown-900 text-white border border-brown-400 rounded-lg">Danh sách danh mục</h1></div>
                <div className="flex mb-4 items-center space-x-2">
                    <button className="bg-green-300 text-white p-2 rounded-lg flex items-center">
                        <FaPlus className="mr-1" />
                        Thêm
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Nhóm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Danh Mục</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="px-6 py-4 text-lg font-medium text-gray-900">{item.categoryId}</td>
                                    <td className="px-6 py-4 text-md text-gray-500">{item.groupName}</td>
                                    <td className="px-6 py-4 text-md text-gray-500">{item.categoryName}</td>
                                    <td className="px-6 py-4 text-md text-gray-500">{item.des}</td>
                                    <td className="px-6 py-4 text-md font-medium flex">
                                        <button className="bg-brown-500 text-white py-1 px-3 rounded-lg mr-2">
                                            <FaPen className="inline-block" />
                                        </button>
                                        <button className="bg-brown-900 text-white py-1 px-3 rounded-lg">
                                            <FaTrash className="inline-block" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    );
}

export default WarehouseCategory;
