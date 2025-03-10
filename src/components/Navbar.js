import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Device Monitoring</Link>
        {token ? (
          <div className="space-x-4">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/manage-devices" className="hover:underline">Manage Devices</Link>
            <Link to="/notifications" className="hover:underline">Notifications</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;