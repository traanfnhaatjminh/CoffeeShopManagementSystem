import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Card from './common/Card';
import Table from './common/Table';
import { COLORS, totalRevenue, totalProfit, totalExpense, listChartData } from './data/dataDashboard';
import { formatCurrency } from './data/helper';
import { useDispatch } from 'react-redux';
import { getTotalRevenue, getTotalProfit, getTotalExpense } from '@/store/revenue-slice/revenueSlice';
import MoonLoader from 'react-spinners/MoonLoader';

const cssOverride = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  margin: 'auto',
  zIndex: 9999,
};
const monthlyRevenueData = [
  { month: 'Tháng 1', revenue: 4800000 },
  { month: 'Tháng 2', revenue: 5200000 },
  { month: 'Tháng 3', revenue: 4900000 },
];

const profitSources = [
  { source: 'Bán cà phê', amount: 1800000 },
  { source: 'Bán trà', amount: 500000 },
  { source: 'Khác', amount: 200000 },
];

const expenseSources = [
  { source: 'Nhập hàng', amount: 700000 },
  { source: 'Nhân viên', amount: 300000 },
  { source: 'Khác', amount: 200000 },
];

const ReportDashboard = () => {
  const dispatch = useDispatch();

  const [dataTotalRevenue, setDataTotalRevenue] = useState(totalRevenue);
  const [dataTotalProfit, setDataTotalProfit] = useState(totalProfit);
  const [dataTotalExpense, setDataTotalExpense] = useState(totalExpense);
  const [chartData, setChartData] = useState(listChartData);
  const [loading, setLoading] = useState(false);

  const handleGetDataTotalRevenue = async () => {
    setLoading(true);
    try {
      const dataRevenue = await dispatch(getTotalRevenue({ month: 3 }));
      setDataTotalRevenue(dataRevenue.payload.data);

      const dataProfit = await dispatch(getTotalProfit({ month: 3 }));
      setDataTotalProfit(dataProfit.payload.data);

      const dataExpense = await dispatch(getTotalExpense({ month: 3 }));
      setDataTotalExpense(dataExpense.payload.data);

      setChartData([
        { name: 'Lợi nhuận', value: dataProfit.payload.data.totalMoneyProfit || 0, rase: true },
        { name: 'Chi phí', value: dataExpense.payload.data.totalExpense || 0, rase: true },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDataTotalRevenue();
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <MoonLoader loading={loading} size={50} cssOverride={cssOverride} color="#ffffff" />
        </div>
      )}
      <div className="py-5 bg-[#F5E1C0] min-h-screen flex flex-col gap-6 px-6 md:px-10 w-full font-mono">
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold text-[#5D4037] mb-6">Báo Cáo Kinh Doanh Tháng 3</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Doanh Thu Tổng"
            value={dataTotalRevenue.totalMoney || 0}
            type={true}
            className={`bg-white border shadow-lg rounded-lg p-4 text-center flex items-center gap-4`}
          />

          <Card
            title="Lợi Nhuận"
            value={dataTotalProfit.totalMoneyProfit || 0}
            type={true}
            className={`bg-white border shadow-lg rounded-lg p-4 text-center flex items-center gap-4`}
          />

          <Card
            title="Chi Phí"
            value={dataTotalExpense.totalExpense || 0}
            type={false}
            className={`bg-white border shadow-lg rounded-lg p-4 text-center flex items-center gap-4`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#795548]">
            <h2 className="text-xl font-semibold text-[#5D4037] mb-4">Thống kê lợi nhuận và chi phí</h2>
            <ResponsiveContainer width="100%" height={300} className="py-1">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#795548]">
            <h2 className="text-xl font-semibold text-[#5D4037] mb-4">Doanh thu 3 tháng gần nhất</h2>
            <ResponsiveContainer width="90%" height={300} className="p-2">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#6D4C41" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Table
            title="Lợi nhuận trong tháng qua"
            data={profitSources.map((item) => ({ source: item.source, amount: formatCurrency(item.amount) }))}
          />
          <Table
            title="Các nguồn chi trong tháng qua"
            data={expenseSources.map((item) => ({ source: item.source, amount: formatCurrency(item.amount) }))}
          />
        </div>
      </div>
    </>
  );
};

export default ReportDashboard;
