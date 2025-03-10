import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialDevices = async () => {
      const token = localStorage.getItem('token');
      console.log('Token in Dashboard:', token);

      if (!token) {
        alert('No token found. Please log in again.');
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/devices', {
          headers: { 'x-auth-token': token },
        });
        setDevices(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access:', error.response.data);
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error fetching devices:', error.response ? error.response.data : error.message);
          alert('Failed to fetch devices. Please try again.');
        }
      }
    };

    fetchInitialDevices();

    const socket = io('https://my-device-monitoring-backend.onrender.com', {
      query: { token: localStorage.getItem('token') },
    });

    socket.on('deviceStatusUpdate', (device) => {
      setDevices((prevDevices) =>
        prevDevices.map((d) => (d._id === device._id ? device : d))
      );
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      if (error.message.includes('401')) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  // นับจำนวนอุปกรณ์ออนไลน์และออฟไลน์
  const onlineCount = devices.filter((device) => device.status === 'online').length;
  const offlineCount = devices.filter((device) => device.status === 'offline').length;

  // ข้อมูลสำหรับกราฟวงกลม
  const pieData = {
    labels: ['Online', 'Offline'],
    datasets: [
      {
        data: [onlineCount, offlineCount],
        backgroundColor: ['#10B981', '#EF4444'], // สีเขียวอ่อนสำหรับออนไลน์, แดงสำหรับออฟไลน์
        hoverOffset: 4,
      },
    ],
  };

  // ตัวเลือกสำหรับกราฟ
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1F2937', // สีข้อความใน legend
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Device Status Overview',
        color: '#1F2937', // สีชื่อกราฟ
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Network Monitoring Dashboard</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-row gap-8">
          {/* รายการอุปกรณ์ (ด้านซ้าย) */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Device List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <div
                  key={device._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4"
                >
                  <h3 className="text-xl font-medium text-gray-800 mb-2">{device.name}</h3>
                  <p className="text-gray-600">IP: {device.ip}</p>
                  <p className="text-gray-600">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        device.status === 'online' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {device.status}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Last Checked: {new Date(device.lastChecked).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* กราฟวงกลม (ด้านขวา) */}
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Status Overview</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;