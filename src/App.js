import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageDevices from './pages/ManageDevices';
import NotificationHistory from './pages/NotificationHistory';
import Register from './pages/Register';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = location.pathname;

    if (token && (currentPath === '/login' || currentPath === '/register')) {
      window.location.href = '/dashboard'; // เปลี่ยนเส้นทางทันทีถ้ามี token
    } else if (!token && (currentPath === '/dashboard' || currentPath === '/manage-devices' || currentPath === '/notifications')) {
      window.location.href = '/login'; // เปลี่ยนเส้นทางถ้าไม่มี token
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/manage-devices"
          element={<ManageDevices />}
        />
        <Route
          path="/notifications"
          element={<NotificationHistory />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;