import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';
import { Avatar, Dropdown } from 'flowbite-react';
import logo from '../assets/logo.png';
import { signoutSuccess } from '../redux/user/userSlice';
import { BiSolidReport } from 'react-icons/bi';
import { Tooltip } from 'react-tooltip';
import { MdGroupAdd } from 'react-icons/md';
const regions = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

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
  const userRole = localStorage.getItem('role');
  const userRegion = localStorage.getItem('region'); // Assuming region is stored in localStorage

  // Function to check if user belongs to the required region
  const hasAccessToRegion = (requiredRegion) => {
    if (!requiredRegion) return true; // If no region restriction, allow access
    return userRegion === requiredRegion;
  };

  return (
    <header className={`flex items-center justify-between p-4 shadow-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-indigo-500 text-white'} transition-colors duration-300`}>
    {/* Logo */}
    <div className="flex items-center">
      <NavLink to="/" className="flex items-center text-2xl font-bold uppercase">
        <img src={logo} alt="Logo" className="h-16 w-16" />
      </NavLink>
    </div>
  
    {/* Menu items and controls */}
    <div className="flex items-center space-x-6">
      
      {/* Mobile Menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-2xl p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition duration-300"
      >
        <FaBars />
      </button>
  
      {/* Desktop Menu Links */}
      <div className="hidden md:flex items-center space-x-6">
  
        {/* Admin Links with Region Check */}
        {userRole === 'Admin' && (
          <>
            {regions.map(region => (
              hasAccessToRegion(region) && (
                <NavLink
                  key={region}
                  to={`/teacher/form/${region.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-white hover:text-black ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                  }
                >
                  <span>Teacher form ({region})</span>
                  <Tooltip content={`Teacher form (${region})`} />
                </NavLink>
              )
            ))}
          </>
        )}
  
        {/* Reports for Admins by region */}
        {userRole === 'Admin' && (
          <>
            {regions.map(region => (
              hasAccessToRegion(region) && (
                <NavLink
                  key={region}
                  to={`/teacher/report/${region.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-white hover:text-black ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                  }
                >
                  <span>Report ({region})</span>
                  <Tooltip content={`Report (${region})`} />
                </NavLink>
              )
            ))}
          </>
        )}
  
        {/* SuperAdmin Links */}
        {userRole === 'SuperAdmin' && (
          <div className="space-y-2">
            <NavLink to="/dashboard2" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
              Dashboard
            </NavLink>
          </div>
        )}
  
        {/* Common Links */}
        <NavLink to="/about" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
          About
        </NavLink>
        <NavLink to="/connect" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
          Connect
        </NavLink>
  
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
                  className="w-14 h-14 rounded-full border-opacity-25 border-2 border-gray-200 dark:border-gray-600"
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
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>
    </div>
  
    {/* Mobile Menu */}
    {isMobileMenuOpen && (
      <div className={`md:hidden mt-2 absolute right-0 top-[90px] z-10 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white text-black'} transition duration-300 shadow-md`}>
        <NavLink to="/" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
          Home
        </NavLink>
  
        {/* SuperAdmin Links */}
        {userRole === 'SuperAdmin' && (
          <div className="space-y-2">
            <NavLink to="/dashboard2" className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
              Dashboard
            </NavLink>
          </div>
        )}
  
        <NavLink to="/about" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
          About
        </NavLink>
        <NavLink to="/connect" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
          Connect
        </NavLink>
  
        {/* Mobile User Profile and Sign Out */}
        {currentUser ? (
          <>
            <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              Profile
            </NavLink>
            <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/signin" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
            Sign In
          </NavLink>
        )}
  
        {/* Theme toggle button */}
        <button onClick={toggleTheme} className="flex items-center space-x-2 p-2 mt-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>
    )}
  </header>
  
  );
};

export default Header;
