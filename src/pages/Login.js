import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password }, {
        timeout: 30000,
      });
      const { data } = response;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        // เปลี่ยนเส้นทางทันทีและบังคับ render ใหม่
        navigate('/dashboard', { replace: true });
        window.location.reload(); // ใช้เป็นการแก้ชั่วคราว ถ้าปัญหายังอยู่
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.msg || `Server error (Status: ${error.response.status})`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again later.';
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
      console.error('Login error:', errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
          <p className="text-gray-600 text-center">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;