import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageDevices = () => {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem('token');
      console.log('Token in Manage Devices:', token);

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

    fetchDevices();
  }, [navigate]);

  const fetchDevices = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('http://localhost:5000/api/devices', {
        headers: { 'x-auth-token': token },
      });
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://my-device-monitoring-backend.onrender.com/api/auth/devices/add', { name, ip }, {
        headers: { 'x-auth-token': token },
      });
      setName('');
      setIp('');
      fetchDevices();
    } catch (error) {
      console.error('Error adding device:', error.response ? error.response.data : error.message);
      alert('Failed to add device. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/devices/${id}`, {
        headers: { 'x-auth-token': token },
      });
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error.response ? error.response.data : error.message);
      alert('Failed to delete device. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Devices</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* ฟอร์มเพิ่มอุปกรณ์ */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Device</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Device Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter device name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">IP Address</label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IP address"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Device
            </button>
          </form>
        </div>

        {/* รายการอุปกรณ์ */}
        <div>
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
                <button
                  onClick={() => handleDelete(device._id)}
                  className="mt-4 w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDevices;