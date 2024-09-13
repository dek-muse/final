import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'; // Adjust the import path as needed

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '', region: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(''); // Track role to conditionally show region

  // Redux state
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (role === 'Admin' && !formData.region)) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('https://tuserapi.vercel.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('region', data.region || ''); // Store region if available
        localStorage.setItem('profilePicture', data.profilePicture);
        localStorage.setItem('username', data.username);

        dispatch(signInSuccess(data));
        navigate('/dashboard');
      } else {
        dispatch(signInFailure(data.message || 'Sign in failed'));
      }
    } catch (error) {
      dispatch(signInFailure(error.message || 'An error occurred'));
    }
  };

  return (
    <div className="flex justify-around items-center min-h-screen -mt-20">
      <div className="p-8 w-full max-w-md transition-transform transform duration-300 ease-in-out">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-200">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              placeholder="example@example.com"
              onChange={handleChange}
              className="shadow-md bg-gray-100 dark:bg-gray-700 placeholder-gray-400 text-gray-900 dark:text-white appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                placeholder="password"
                onChange={handleChange}
                className="shadow-md bg-gray-100 dark:bg-gray-700 placeholder-gray-400 text-gray-900 dark:text-white appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {role === 'Admin' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300" htmlFor="region">
                Region
              </label>
              <input
                id="region"
                type="text"
                value={formData.region}
                placeholder="e.g., Sitti"
                onChange={handleChange}
                className="shadow-md bg-gray-100 dark:bg-gray-700 placeholder-gray-400 text-gray-900 dark:text-white appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
              />
            </div>
          )}
          {errorMessage && <p className="mb-4 text-red-500 text-center">{errorMessage}</p>}
          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
