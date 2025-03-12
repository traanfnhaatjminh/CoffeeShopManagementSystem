import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from './common/Table';
import { useDispatch } from 'react-redux';
import { getListTopProductsOrder } from '../../../store/revenue-slice/revenueSlice';
import { IoArrowBackSharp } from 'react-icons/io5';
import MoonLoader from 'react-spinners/MoonLoader';
import { staticSelectProfits } from './data/dataDashboard';
const cssOverride = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  margin: 'auto',
  zIndex: 9999,
};
const Profits = () => {
  const [listTopProductOrder, setListTopProductOrder] = useState([]);
  const [filterMode, setFilterMode] = useState('latest');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const handleGetDataTotalRevenue = async () => {
    setLoading(true);
    try {
      let params = filterMode === 'latest' ? { month, year } : {};

      dispatch(getListTopProductsOrder(params)).then((productOrder) => {
        setListTopProductOrder(productOrder.payload.data.listDataTopProduct);
      });
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
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-xl font-mono">
        <div className="flex justify-between px-5 mb-4">
          <Link className="back flex items-center gap-1 hover:text-brown-700" to={'/admin/dashboard'}>
            <IoArrowBackSharp />
            <span className="text-lg">Trở về</span>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-800">
            Lợi nhuận chi tiết {filterMode === 'latest' ? `- Tháng ${month}` : ''}
          </h1>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-1 py-3 border border-gray-300 rounded-lg text-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {staticSelectProfits &&
              staticSelectProfits.map((item, index) => (
                <option value={item.value} key={index}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <Table
          title="Danh sách lợi nhuận từ đồ uống"
          data={listTopProductOrder}
          type="listTopProductOrder"
          sum="profit"
        />
      </div>
    </>
  );
};

export default Profits;
