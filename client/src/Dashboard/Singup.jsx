import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const roles = ['Admin', 'SuperAdmin', 'User']; // Define your roles

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear the error message when user starts typing
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
    if (!validate()) return; // Stop form submission if validation fails

    setIsLoading(true); // Start loading

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert('Sign up successful! Redirecting to login page.'); // Alert message
      navigate('/listUsers'); // Redirect to login page
    } catch (error) {
      console.error('There was an error signing up!', error);
      alert(`Error: ${error.response?.data?.message || 'An error occurred'}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen   p-6 -mt-[50px] ">
      <div className="w-full max-w-md   shadow-lg rounded-lg p-8 shadow-[#b19d60] border-[#b19d60]">
        <h2 className="text-2xl font-bold mb-6 bg-[#b19d60] p-3 rounded-md uppercase ">Create users</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium  mb-1">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800    focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium  mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium   mb-1">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-100 dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium  0 mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-100 dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-semibold ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
