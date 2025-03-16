import React from 'react';
import { formatCurrency } from '../data/helper';
import { columnsConfig } from '../data/dataDashboard';

const Table = ({ title, data, row, type, sum }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-600 text-lg font-medium bg-[#F5E1C0] p-4 rounded-lg shadow-md">
        {title}: Không có dữ liệu
      </p>
    );
  }

  const columns = columnsConfig[type] || [];
  const displayData = row ? data.slice(0, row) : data;

  let totalRevenue = 0;
  let totalProfit = 0;
  if (sum) {
    totalRevenue = data.reduce(
      (acc, item) => acc + (sum !== 'expense' ? item.total_revenue : item.totalExpense || 0),
      0
    );
    totalProfit = data.reduce((acc, item) => acc + (item.total_profit || 0), 0);
  }

  return (
    <div className="bg-[#FFF8ED] p-6 shadow-lg rounded-xl border border-[#D2B48C]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-[#5D4037]">{title}</h3>
        {sum && (
          <div className="flex gap-10 p-3 bg-[#FFE0B2] rounded-lg shadow-md px-8">
            <span className="text-lg font-bold text-[#4E342E]">
              {sum !== 'expense' ? 'Tổng tiền bán:' : 'Tổng tiền mua'}{' '}
              <span className="text-green-600 ml-2">{formatCurrency(totalRevenue)}</span>
            </span>
            {sum !== 'expense' && (
              <span className="text-lg font-bold text-[#4E342E]">
                Tổng lợi nhuận: <span className="text-green-600">{formatCurrency(totalProfit)}</span>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-md table-fixed">
          <thead>
            <tr className="bg-[#6D4C41] text-white uppercase tracking-wide text-sm text-center">
              <th className="border-b p-4 w-[5%]">STT</th>
              {columns.map((col, index) => (
                <th key={index} className="border-b p-4 w-[20%]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D7CCC8] text-center">
            {displayData.map((item, index) => (
              <tr key={index} className="hover:bg-[#FFE0B2] transition-all duration-200">
                <td className="border-b p-4 font-medium text-[#4E342E] w-[5%]">{index + 1}</td>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border-b p-4 text-[#5D4037] w-[20%]">
                    {col.isCurrency ? formatCurrency(item[col.key]) : item[col.key] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
