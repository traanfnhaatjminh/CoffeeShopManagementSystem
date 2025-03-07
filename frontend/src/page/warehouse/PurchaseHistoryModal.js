import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment-timezone';

const PurchaseHistoryModal = ({ ingredient, closeModal }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                <h2 className="text-lg font-bold mb-4">Lịch Sử Nhập Hàng - {ingredient.name}</h2>
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Ngày Nhập</th>
                            <th className="border px-4 py-2">Số Lượng</th>
                            <th className="border px-4 py-2">Giá Nhập</th>
                            <th className="border px-4 py-2">Nhà cung cấp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredient?.purchase_history?.map((history, index) => (
                            <tr key={index} className="border">
                                <td className="border px-4 py-2">
                                    {moment(history.date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
                                </td>
                                <td className="border px-4 py-2">{history.quantity}</td>
                                <td className="border px-4 py-2">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(history.cost_price)}
                                </td>
                                <td className="border px-4 py-2">{history.supplier}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default PurchaseHistoryModal;
