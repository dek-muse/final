import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const roles = ['Admin', 'SuperAdmin', 'User'];
const REGIONS = ['c', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

const SignUp = () => {
  const [formData, setFormData] = useState({
    FullName: '',
    email: '',
    password: '',
    role: '',
    region: '' // Added region to formData
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.FullName) newErrors.FullName = 'FullName is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';
    // No validation error for region as it is optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await axios.post('https://tuserapi.vercel.app/signup', formData);
      alert('Sign up successful! Redirecting to login page.');
      navigate('/listUsers');
    } catch (error) {
      console.error('There was an error signing up!', error);
      alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 -mt-[50px]">
      <div className="w-full max-w-md shadow-lg rounded-lg p-8 shadow-[#b19d60] border-[#b19d60]">
        <h2 className="text-xl font-bold mb-6 bg-[#b19d60] p-3 rounded-md uppercase">Create users</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="FullName" className="block  text-xs font-medium mb-1">Full Name</label>
            <input
              id="Full Name"
              type="text"
              name="Name"
              value={formData.FullName}
              onChange={handleChange}
              required
              placeholder="Enter your Full Name"
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105    rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.FullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.FullName && <p className="text-red-500 text-xs mt-1">{errors.FullName}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block  text-xs font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105   rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block  text-xs font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105   rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="role" className="block  text-xs font-medium mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105   rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="region" className="block  text-xs font-medium mb-1">Region  </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.region ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a region</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-md shadow-sm text-white font-semibold ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
