import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

const SignIn1 = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/profile');
      } else {
        dispatch(signInFailure(data.message || 'Sign in failed'));
      }
    } catch (error) {
      dispatch(signInFailure(error.message || 'An error occurred'));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Sign In</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Your Email
            </label>
            <input
              type='email'
              id='email'
              placeholder='name@company.com'
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Your Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='Password'
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className='flex gap-2 text-sm mt-5 justify-center'>
          <span>Don't have an account?</span>
          <Link to='/signup' className='text-blue-500 hover:underline'>
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <div className='text-red-500 text-sm mt-5 bg-red-200 p-4 rounded-lg'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn1;
