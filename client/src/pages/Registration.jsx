import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '', // Clear error when the user starts typing
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      emailjs.send(
        'service_82mpouu',
        'service_82mpouu',
        {
          to_name: formData.username,
          to_email: formData.email,
          username: formData.username,
          password: formData.password,
        },
        'q8sEL27SXWQIg305m'
      ).then(
        (result) => {
          console.log('Email sent:', result.text);
        },
        (error) => {
          console.error('Error sending email:', error.text);
        }
      );
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username" className="font-semibold mb-1">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`p-2 border rounded-lg ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="font-semibold mb-1">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`p-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
