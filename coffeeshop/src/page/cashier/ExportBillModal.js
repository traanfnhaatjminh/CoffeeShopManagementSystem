import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

export default function ExportBillModal({ show, onClose, data, tableInfo }) {
    // tableInfo là danh sách thông tin bàn
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [processedData, setProcessedData] = useState([]);

    if (!show) return null;

    const handleCloseModal = () => {
        setFromDate('');
        setToDate('');
        setProcessedData([]); // Reset processed data on close
        onClose();
    };

    const handleSubmit = () => {
        // Kiểm tra ngày tháng
        if (!fromDate || !toDate) {
            alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
            return;
        }

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        // Kiểm tra ngày kết thúc phải không nhỏ hơn ngày bắt đầu
        if (endDate < startDate) {
            alert('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.');
            return;
        }

        // Lọc dữ liệu theo khoảng thời gian đã chọn
        const filteredData = data.filter((bill) => {
            const billDate = new Date(bill.updated_time);
            return billDate >= startDate && billDate <= endDate;
        });

        if (filteredData.length === 0) {
            alert('Không có hóa đơn nào trong khoảng thời gian đã chọn.');
            return; // Không xuất CSV nếu không có hóa đơn
        }

        const processed = filteredData.map((bill, index) => {
            // Tìm số bàn từ thông tin bàn
            const getTableNumber = (tableId) => {
                const tableIndex = tableInfo.findIndex((table) => table._id.toString() === tableId.toString());
                return tableIndex !== -1 ? tableIndex + 1 : 'Not found';
              };
            
            return {
                index: index + 1,
                created_time: new Date(bill.created_time).toLocaleString(),
                updated_time: new Date(bill.updated_time).toLocaleString(),
                table_id:  getTableNumber(bill.table_id), // Số bàn được thay thế
                product_list: bill.product_list.map((product) => product.nameP).join(', '),
                discount: `${bill.discount}%`,
                payment: bill.payment === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
                total_cost: `${bill.total_cost.toLocaleString('vi-VN')} VND`,
            };
        });

        setProcessedData(processed);
       
    };

    const headersExport = [
        { label: 'STT', key: 'index' },
        { label: 'TG tạo hóa đơn', key: 'created_time' },
        { label: 'TG thanh toán', key: 'updated_time' },
        { label: 'Bàn', key: 'table_id' },
        { label: 'Sản phẩm', key: 'product_list' },
        { label: 'Giảm giá', key: 'discount' },
        { label: 'PT Thanh Toán', key: 'payment' },
        { label: 'Tổng tiền', key: 'total_cost' },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Xuất hóa đơn</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Từ ngày:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Đến ngày:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded-lg">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} className="bg-brown-500 hover:bg-brown-600 text-white px-4 py-2 rounded-lg">
                        Xử lý
                    </button>
                    <CSVLink
                        id="csvLink"
                        data={processedData} // Chỉ xuất khi processedData đã được cập nhật
                        headers={headersExport}
                        separator=";"
                        enclosingCharacter={``}
                      
                        filename={`Bill-${fromDate}-${toDate}`}
                        className={`bg-brown-500 hover:bg-brown-600 text-white px-4 py-2 rounded-lg ${processedData.length === 0 ? 'hidden' : ''}`} // Ẩn nếu không có dữ liệu
                    >
                        Xuất
                    </CSVLink>
                </div>
            </div>
        </div>
    );
}
