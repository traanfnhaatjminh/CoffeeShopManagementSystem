import React from 'react';

const Table = ({ title, data }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border-b p-3">Stt</th>
            <th className="border-b p-3">Nguồn</th>
            <th className="border-b p-3">Tỷ lệ</th>
            <th className="border-b p-3">So sánh với tháng trước</th>
            <th className="border-b p-3">Số Tiền (VND)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border-b p-3">{index + 1}</td>
              <td className="border-b p-3">{item.source}</td>
              <td className="border-b p-3">{item.source}</td>
              <td className="border-b p-3">{item.source}</td>
              <td className="border-b p-3">{item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
