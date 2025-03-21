import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment-timezone';

const PurchaseHistoryModal = ({ ingredient, closeModal }) => {


    function splitUnit(quantity, remaining_quantity, unit) {
        const units = unit.split('/'); // Tách đơn vị bằng dấu '/'
        return {
            quantity: `${quantity} ${units[0]}`,
            remaining_quantity: `${remaining_quantity} ${units[1] || ''}` // Nếu chỉ có 1 đơn vị, đơn vị thứ 2 để trống
        };
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                <h2 className="text-lg font-bold mb-4">Lịch Sử Nhập Hàng - {ingredient.name}</h2>
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Ngày Nhập</th>
                            <th className="border px-4 py-2">Số Lượng</th>
                            <th className="border px-4 py-2">Tồn Kho</th>
                            <th className="border px-4 py-2">Giá Nhập</th>
                            <th className="border px-4 py-2">Nhà Cung Cấp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...(ingredient?.purchase_history || [])] // Ensure it's an array before sorting
                            .sort((a, b) => moment(b.date, "DD/MM/YYYY HH:mm").toDate() - moment(a.date, "DD/MM/YYYY HH:mm").toDate())
                            // Sort by date descending
                            .map((history, index) => (
                                <tr key={index} className="border">
                                    <td className="border px-4 py-2">
                                        {history.date && moment(history.date, "DD/MM/YYYY HH:mm", true).isValid()
                                            ? moment(history.date, "DD/MM/YYYY HH:mm").tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')
                                            : "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {splitUnit(history.quantity, history.remaining_quantity, ingredient.unit).quantity}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {splitUnit(history.quantity, history.remaining_quantity, ingredient.unit).remaining_quantity}
                                    </td>
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
