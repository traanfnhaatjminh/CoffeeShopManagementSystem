import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

export default function Statistic() {
  const areaChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const areaChartInstanceRef = useRef(null);
  const pieChartInstanceRef = useRef(null);
  // State to hold statistics data
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    bestSellingDrink: '',
    totalDrinksSold: 0,
    categories: [],
    soldQuantities: []
  });

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/bills/statistics');
      const responseCate = await axios.get('/categories/list');
      const soldQuantitiesResponse = await axios.get('/bills/sold-by-category');
      const data = response.data;
      const categoriesData = responseCate.data;
      setStatistics({
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        bestSellingDrink: data.bestSellingDrink,
        totalDrinksSold: data.totalDrinksSold,
        categories: categoriesData,
        soldQuantities: soldQuantitiesResponse.data
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


  useEffect(() => {
    fetchStatistics();
    // const ctx = areaChartRef.current.getContext('2d');

    // if (areaChartInstanceRef.current) {
    //   areaChartInstanceRef.current.destroy();
    // }

    // areaChartInstanceRef.current = new Chart(ctx, {
    //   type: 'line',
    //   data: {
    //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //     datasets: [
    //       {
    //         label: 'Doanh thu',
    //         data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
    //         backgroundColor: 'rgba(78, 115, 223, 0.05)',
    //         borderColor: 'rgba(78, 115, 223, 1)',
    //         pointRadius: 3,
    //         pointBackgroundColor: 'rgba(78, 115, 223, 1)',
    //       },
    //     ],
    //   },
    //   options: {
    //     maintainAspectRatio: false,
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //         ticks: {
    //           callback: (value) => `${value} VND`,
    //         },
    //       },
    //     },
    //   },
    // });

    // // Cleanup function to destroy charts when the component unmounts
    // return () => {
    //   if (areaChartInstanceRef.current) {
    //     areaChartInstanceRef.current.destroy();
    //   }
    // };
  }, []);

  useEffect(() => {
    if (statistics.categories.length === 0) return;

    const pieCtx = pieChartRef.current.getContext('2d');

    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
    }

    pieChartInstanceRef.current = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: statistics.soldQuantities.map((q) => q.category),
        datasets: [
          {
            data: statistics.soldQuantities.map(q => q.totalSold),
            backgroundColor: statistics.soldQuantities.map(() => getRandomColor()),
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
      },
    });
  }, [statistics]);

  return (
    <div className="flex-1 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
          Thống kê
        </h1>
        <a href="#" className="btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-download fa-sm text-white-50"></i> Xuất báo cáo
        </a>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="card border-left-primary shadow h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col ml-3">
                <div
                  className="text-xs font-weight-bold text-primary text-uppercase mb-1"
                  style={{ fontWeight: 'bold', fontSize: 17 }}
                >
                  Doanh thu
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{statistics.totalRevenue.toLocaleString()} VND</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-left-success shadow h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col ml-3">
                <div
                  className="text-xs font-weight-bold text-success text-uppercase mb-1"
                  style={{ fontWeight: 'bold', fontSize: 17 }}
                >
                  Số đơn hàng
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{statistics.totalOrders}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-left-info shadow h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col ml-3">
                <div
                  className="text-xs font-weight-bold text-info text-uppercase mb-1"
                  style={{ fontWeight: 'bold', fontSize: 17 }}
                >
                  Đồ uống bán chạy
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{statistics.bestSellingDrink}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-left-warning shadow h-100 py-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col ml-3">
                <div
                  className="text-xs font-weight-bold text-warning text-uppercase mb-1"
                  style={{ fontWeight: 'bold', fontSize: 17 }}
                >
                  Số đồ uống bán được
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">{statistics.totalDrinksSold}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="center gap-4">
        {/* Area Chart */}
        {/* <div className="card shadow h-100">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="font-weight-bold text-primary">Doanh thu từng tháng</h6>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <canvas ref={areaChartRef}></canvas>
            </div>
          </div>
        </div> */}

        {/* Pie Chart */}
        <div className="card shadow h-100">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="font-weight-bold text-primary">Thống kê lượng bán ra của từng loại đồ uống (Đơn vị: Cốc)</h6>
          </div>
          <div className="card-body">
            <div className="chart-pie pt-4 pb-2">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
