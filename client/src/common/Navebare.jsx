import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSun, FaMoon, FaSearch, FaTimes, FaBars } from 'react-icons/fa';
import { Avatar, Dropdown } from 'flowbite-react';
import logo from '../assets/logo.png'; // Add your logo path here
import { signoutSuccess } from '../redux/user/userSlice'; // Adjust the path according to your project structure

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Start in light mode by default
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  // Retrieve user details from Redux store
  const { currentUser } = useSelector((state) => state.user);
  const profilePicture = currentUser?.profilePicture;
  const username = currentUser?.username || 'User';
  const email = currentUser?.email || 'No email available';

  useEffect(() => {
    // Optionally set initial dark mode based on user preference
    if (localStorage.getItem('darkMode') === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode); // Toggle dark mode on the body
    localStorage.setItem('darkMode', !isDarkMode); // Save dark mode preference
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    dispatch(signoutSuccess()); // Dispatch signout success action
    navigate('/signin', { state: { message: 'You have been signed out.' } }); // Redirect to the sign-in page
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className={`flex flex-col md:flex-row items-center justify-between p-4 shadow-md ${isDarkMode ? 'bg-[#b19d60]  ' : 'bg-[#b19d60]   '} transition-colors duration-300`}>
      <div className="flex items-center justify-between w-full md:w-auto">
        <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold uppercase">
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-2xl"
        >
          <FaBars />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="flex items-center space-x-4 md:flex">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="      px-4 py-2 rounded-md pl-12 focus:outline-none focus:ring-2  "
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
          {searchQuery && (
            <FaTimes
              className="absolute right-3 top-1/2 transform -translate-y-1/2  cursor-pointer"
              onClick={clearSearch}
            />
          )}
        </div>

        {/* Profile Dropdown Menu */}
        <div className="relative">
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt='user'
                  img={profilePicture}
                  rounded
                  className='w-12 h-12 rounded-lg'
                />
              }
            >
              <div className="p-2 border-b ">
                <span className='block text-sm'>{getGreeting()} @{username}  </span>
                
                <span className='block text-sm truncate'>
                  {email}
                </span>
              </div>
              <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Profile</NavLink>
              <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Sign Out</button>
            </Dropdown>
          ) : (
            <NavLink to="/signin" className="flex items-center space-x-2">
              <span>Sign In</span>
            </NavLink>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="flex items-center space-x-2">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0    border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="p-4">
            <NavLink to="/" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Home</NavLink>
            {currentUser ? (
              <>
                <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Profile</NavLink>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Sign Out</button>
              </>
            ) : (
              <NavLink to="/signin" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">Sign In</NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;