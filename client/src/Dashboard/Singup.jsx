import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons for showing/hiding password
import { MdEmail } from 'react-icons/md'; // Email icon

const roles = ['Admin', 'SuperAdmin', 'User'];
const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '123456',
    role: '',
    region: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState(''); // State for displaying messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setMessage(''); // Clear the message on input change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setMessage(''); // Clear previous messages

    try {
      await axios.post('https://tuserapi.vercel.app/signup', formData);
      setMessage('Sign up successful! Redirecting to the user list.');
      setTimeout(() => {
        navigate('/listUsers');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('There was an error signing up!', error);
      setMessage(`Error: ${error.response?.data?.message || 'An error occurred'}`);
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
            <label htmlFor="username" className="block text-xs font-medium mb-1">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your Username"
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-2 relative">
            <label htmlFor="email" className="block text-xs font-medium mb-1">Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className={`w-full px-10 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-2 relative">
            <label htmlFor="password" className="block text-xs font-medium mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-3 px-2 py-2 text-sm text-gray-600"
              >
                {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="role" className="block text-xs font-medium mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="region" className="block text-xs font-medium mb-1">Region</label>
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
        {message && (
          <div className={`mt-4 p-4 rounded-md text-sm ${message.includes('Error') ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
