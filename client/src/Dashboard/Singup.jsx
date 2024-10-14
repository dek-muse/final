import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons for showing/hiding password
import { MdEmail } from 'react-icons/md'; // Email icon
import sigin from '../assets/sigin.svg'


const roles = ['Admin', 'SuperAdmin', 'User'];
const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '123456',
    role: 'User',
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
<div className="flex justify-center items-center min-h-screen   p-6">
  <div className="flex w-full max-w-4xl    overflow-hidden">
    {/* Image Section */}
    <div className="hidden lg:flex lg:w-1/2 justify-center items-center  ">
      <img src={sigin} alt="Illustration" className="w-full h-auto object-contain p-6" />
    </div>

    {/* Form Section */}
    <div className="w-full lg:w-1/2 p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
            required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Region Selection */}
        <div className="mb-6">
          <label htmlFor="region" className="block text-sm font-medium mb-1">Region</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
              className={`w-full px-4 py-2.5 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a region</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 text-white font-semibold rounded-lg ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  </div>
</div>

 
  
  );
};

export default SignUp;
