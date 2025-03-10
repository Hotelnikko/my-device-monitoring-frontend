import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-6">
          <Link to="/dashboard" className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200">
            Dashboard
          </Link>
          <Link to="/manage-devices" className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200">
            Manage Devices
          </Link>
          <Link to="/notification-history" className="text-white text-lg font-medium hover:text-blue-300 transition-colors duration-200">
            Notification History
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;