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
  });

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/bills/statistics');
      const data = response.data;
      setStatistics({
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        bestSellingDrink: data.bestSellingDrink,
        totalDrinksSold: data.totalDrinksSold,
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    const ctx = areaChartRef.current.getContext('2d');

    if (areaChartInstanceRef.current) {
      areaChartInstanceRef.current.destroy();
    }

    areaChartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Doanh thu',
            data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: 'rgba(78, 115, 223, 1)',
            pointRadius: 3,
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} VND`,
            },
          },
        },
      },
    });

    // Initialize Pie Chart
    const pieCtx = pieChartRef.current.getContext('2d');

    // Destroy previous chart if it exists to avoid canvas reuse error
    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
    }

    pieChartInstanceRef.current = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: [
          'Cà phê highlight',
          'Cà phê Việt Nam',
          'Cà phê máy',
          'Cold brew',
          'Trà trái cây',
          'Hi-tea',
          'Trà xanh tây bắc',
          'Chocolate',
        ],
        datasets: [
          {
            data: [55, 30, 15, 25, 12, 54, 13, 21],
            backgroundColor: ['#00ffff', '#1cc88a', '#36b9cc', '#8a2be2', '#a52a2a', '#deb887', '#5f9ea0', '#7fff00'],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
      },
    });

    // Cleanup function to destroy charts when the component unmounts
    return () => {
      if (areaChartInstanceRef.current) {
        areaChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, []);

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
      <div className="grid grid-cols-2 gap-4">
        {/* Area Chart */}
        <div className="card shadow h-100">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="font-weight-bold text-primary">Doanh thu từng tháng</h6>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <canvas ref={areaChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card shadow h-100">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="font-weight-bold text-primary">Thống kê số lượng theo loại đồ uống</h6>
          </div>
          <div className="card-body">
            <div className="chart-pie pt-4 pb-2">
              <canvas ref={pieChartRef}></canvas>
            </div>
            <div className="mt-4 text-center small">
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#00ffff' }}></i> Cà phê highlight
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#7fffd4' }}></i> Cà phê Việt Nam
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#0000ff' }}></i> Cà phê máy
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#8a2be2' }}></i> Cold brew
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#a52a2a' }}></i> Trà trái cây
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#deb887' }}></i> Hi-tea
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#5f9ea0' }}></i> Trà xanh tây bắc
              </span>
              <span className="mr-2">
                <i className="fas fa-circle" style={{ color: '#7fff00' }}></i> Chocolate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
