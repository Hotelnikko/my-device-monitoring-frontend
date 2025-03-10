import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      console.log('Token in NotificationHistory:', token);

      if (!token) {
        alert('No token found. Please log in again.');
        navigate('/login');
        return;
      }

      try {
        let url = 'http://localhost:5000/api/notifications';
        if (filter !== 'all') {
          url += `?status=${filter}`;
        }
        const { data } = await axios.get(url, {
          headers: { 'x-auth-token': token },
        });
        setNotifications(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access:', error.response.data);
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
          alert('Failed to fetch notifications. Please try again.');
        }
      }
    };

    fetchNotifications();
  }, [filter, navigate]);

  const handleClearLogs = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      navigate('/login');
      return;
    }

    if (window.confirm('Are you sure you want to clear all notification logs?')) {
      try {
        await axios.delete('https://my-device-monitoring-backend.onrender.com/api/notifications', {
          headers: { 'x-auth-token': token },
        });
        setNotifications([]); // ล้างรายการใน state
        alert('Notification logs cleared successfully');
      } catch (error) {
        console.error('Error clearing notifications:', error.response ? error.response.data : error.message);
        alert('Failed to clear notifications. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Notification History</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <button
            onClick={handleClearLogs}
            className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Clear Logs
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4"
            >
              <h3 className="text-xl font-medium text-gray-800 mb-2">{notification.deviceName}</h3>
              <p className="text-gray-600">IP: {notification.ip}</p>
              <p className="text-gray-600">
                Status Change: {notification.previousStatus} → {notification.newStatus}
              </p>
              <p className="text-gray-500 text-sm">
                Time: {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        {notifications.length === 0 && (
          <p className="text-gray-500 text-center">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationHistory;