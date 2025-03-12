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
import { COLORS, totalRevenue, totalProfit, totalExpense, listChartData, staticSelect } from './data/dataDashboard';
import { formatCurrency } from './data/helper';
import { useDispatch } from 'react-redux';
import {
  getTotalRevenue,
  getTotalProfit,
  getTotalExpense,
  getDataLatestMonths,
  getListTopProductsOrder,
  getListIngredient,
} from '@/store/revenue-slice/revenueSlice';
import MoonLoader from 'react-spinners/MoonLoader';
import { Link } from 'react-router-dom';

const cssOverride = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  margin: 'auto',
  zIndex: 9999,
};

const ReportDashboard = () => {
  const dispatch = useDispatch();

  const [dataTotalRevenue, setDataTotalRevenue] = useState(totalRevenue);
  const [dataTotalProfit, setDataTotalProfit] = useState(totalProfit);
  const [dataTotalExpense, setDataTotalExpense] = useState(totalExpense);
  const [chartData, setChartData] = useState(listChartData);
  const [dataLatestMonth, setDataLatestMonth] = useState([]);
  const [listTopProductOrder, setListTopProductOrder] = useState([]);
  const [listIngredient, setListIngredient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMode, setFilterMode] = useState('latest');

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const handleGetDataTotalRevenue = async () => {
    setLoading(true);
    try {
      let dataRevenue, dataProfit, dataExpense, dataAllLatestMonth, dataListTopOrderProduct, dataListIngredient;

      let params = filterMode === 'latest' ? { month, year } : {};

      [dataRevenue, dataProfit, dataExpense, dataAllLatestMonth, dataListTopOrderProduct, dataListIngredient] =
        await Promise.all([
          dispatch(getTotalRevenue(params)),
          dispatch(getTotalProfit(params)),
          dispatch(getTotalExpense(params)),
          dispatch(getDataLatestMonths()),
          dispatch(getListTopProductsOrder(params)),
          dispatch(getListIngredient(params)),
        ]);

      setDataTotalRevenue(dataRevenue.payload.data);
      setDataTotalProfit(dataProfit.payload.data);
      setDataTotalExpense(dataExpense.payload.data);
      setListTopProductOrder(dataListTopOrderProduct.payload.data.listDataTopProduct);
      setListIngredient(dataListIngredient.payload.data);

      setChartData([
        { name: 'Lợi nhuận', value: dataProfit.payload.data.totalMoneyProfit || 0, rase: true },
        { name: 'Chi phí', value: dataExpense.payload.data.totalExpense || 0, rase: true },
      ]);

      if (dataAllLatestMonth?.payload?.data) {
        setDataLatestMonth(dataAllLatestMonth.payload.data);
      }
      console.log('listIngredient:', listIngredient);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDataTotalRevenue();
  }, [filterMode]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <MoonLoader loading={loading} size={50} cssOverride={cssOverride} color="#ffffff" />
        </div>
      )}
      <div className="py-5 bg-[#F5E1C0] min-h-screen flex flex-col gap-6 px-6 md:px-10 w-full font-mono">
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            📊 Báo Cáo Kinh Doanh
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="px-6 py-3 bg-blue-100 text-blue-700 text-2xl font-bold border border-blue-500 rounded-lg shadow-md min-w-[150px] text-center">
              {filterMode === 'latest' ? `Tháng ${month}` : 'Toàn bộ'}
            </div>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {staticSelect &&
                staticSelect.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Doanh Thu Tổng"
            value={dataTotalRevenue.totalMoney || 0}
            type={true}
            className={`bg-white border shadow-lg rounded-lg p-4 text-center flex items-center gap-4`}
          />

          <Link to="/admin/profits">
            <Card
              title="Lợi Nhuận"
              value={dataTotalProfit.totalMoneyProfit || 0}
              type={true}
              className={`bg-white border shadow-lg rounded-lg p-4 text-center flex items-center gap-4`}
            />
          </Link>
          <Link to="/admin/expense">
            <Card
              title="Chi Phí"
              value={dataTotalExpense.totalExpense || 0}
              type={false}
              className={`bg-white border shadow-lg rounded-lg p-4 text-center flex items-center gap-4`}
            />
          </Link>
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
            <h2 className="text-xl font-semibold text-[#5D4037] mb-4">Doanh thu các tháng gần nhất</h2>
            <ResponsiveContainer width="90%" height={300} className="p-5">
              <BarChart data={dataLatestMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={(value) => `Tháng ${value}`} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value, name, props) => [`${formatCurrency(value)}`, `Tháng ${props.payload.month}`]}
                />
                <Legend formatter={() => `Thống kê doanh thu theo tháng`} />
                <Bar dataKey="totalAmountInMonth" fill="#6D4C41" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listTopProductOrder && (
            <Table title="Top 5 đồ uống Hot" data={listTopProductOrder} row={5} type="listTopProductOrder" />
          )}
          {listIngredient && (
            <Table title="Các nguồn chi trong tháng qua" data={listIngredient} row={5} type="listIngredient" />
          )}
        </div>
      </div>
    </>
  );
};

export default ReportDashboard;
