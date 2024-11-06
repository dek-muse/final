import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';
import { Avatar, Dropdown } from 'flowbite-react';
import logo from '../assets/logo.png';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const profilePicture = currentUser?.profilePicture;
  const username = currentUser?.username || 'User';
  const email = currentUser?.email || 'No email available';

  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    dispatch(signoutSuccess());
    navigate('/signin', { state: { message: 'You have been signed out.' } });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className={`flex items-center justify-between p-4 shadow-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-indigo-500 text-white'} transition-colors duration-300`}>
      {/* Logo */}
      <div className="flex items-center ">
        <NavLink to="/" className="flex items-center  text-2xl font-bold uppercase">
          <img src={logo} alt="Logo" className="h-16 w-16" />
        </NavLink>
      </div>

      {/* Menu items and controls */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-2xl p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition duration-300"
        >
          <FaBars />
        </button>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink to="/dashboard2" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">Dashboard</NavLink>
          <NavLink to="/about" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">About</NavLink>
          <NavLink to="/connect" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">Connect</NavLink>

          {/* User Avatar / Dropdown */}
          <div className="relative">
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="user"
                    img={profilePicture}
                    rounded
                    className="w-14 h-14 rounded-full  border-opacity-25 border-2 border-gray-200 dark:border-gray-600"
                  />
                }
              >
                <div className="p-2 border-b w-32">
                  <span className="text-lg">{getGreeting()} @{username}</span>
                 </div>
                <NavLink to="/profile" className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">Profile</NavLink>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">Sign Out</button>
              </Dropdown>
            ) : (
              <NavLink to="/signin" className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
                Sign In
              </NavLink>
            )}
          </div>

          {/* Theme toggle button */}
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
            {isDarkMode ? <FaSun className="text-white" /> : <FaMoon className="text-gray-800" />}
          </button>
        </div>
      </div>
      

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden mt-2 absolute right-0 top-[90px] z-10 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition duration-300 shadow-md`}>
          <NavLink to="/" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Home</NavLink>
          <NavLink to="/about" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">About</NavLink>
          <NavLink to="/connect" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Connect</NavLink>
          {currentUser ? (
            <>
              <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Profile</NavLink>
              <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Sign Out</button>
            </>
          ) : (
            <NavLink to="/signin" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Sign In</NavLink>
          )}
          <button onClick={toggleTheme} className="flex items-center space-x-2 p-2 mt-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
            {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
