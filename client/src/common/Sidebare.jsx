import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome, FaChalkboardTeacher, FaUserPlus, FaUsers, FaBars, FaTimes,
  FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaFlag, FaRegListAlt,
} from 'react-icons/fa';
import { MdReport } from 'react-icons/md';

const Sidebar = () => {
  // Set the initial state to false to make the sidebar closed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleRegionDropdown = () => setIsRegionOpen(!isRegionOpen);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  return (
    <div className={`relative flex ${isSidebarOpen ? 'w-64' : 'w-20'} h-screen transition-all duration-300 fixed ` }>
      <div className="flex flex-col w-full h-full   dark:bg-gray-900 shadow-2xl shadow-[#b19d60]  ">
        <div className="flex items-center justify-between h-20 p-4  dark:text-white">
          <div className="flex items-center space-x-2">
            <button onClick={toggleSidebar} className="text-xl transition-all">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        <nav className="flex flex-col space-y-4 p-4">
          {/* 'Admin', 'SuperAdmin', 'User' */}
          {(userRole === 'Admin' || userRole === 'SuperAdmin') && (
            <div className="space-y-2">
              <NavLink to="/dashboard" className="flex items-center space-x-4 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md">
                <FaHome />
                {isSidebarOpen && <span>Dashboard</span>}
              </NavLink>

              <NavLink to="/teachersList" className="flex items-center space-x-4 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md">
                <FaChalkboardTeacher />
                {isSidebarOpen && <span>Teachers</span>}
              </NavLink>
            </div>
          )}
          {userRole === 'Admin' && (
            <>
             
              <NavLink to="/listUsers" className="flex items-center space-x-4 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md">
                <FaUsers />
                {isSidebarOpen && <span>Users</span>}
              </NavLink>
              <NavLink to="/report" className="flex items-center space-x-4 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md">
                <MdReport />
                {isSidebarOpen && <span>Report</span>}
              </NavLink>
              <NavLink to="/signup" className="flex items-center space-x-4 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md">
                <FaUserPlus />
                {isSidebarOpen && <span>Create User</span>}
              </NavLink>
            </>
          )}
        </nav>
        <div className="mt-auto p-4">
          <button onClick={handleSignOut} className="w-full flex items-center space-x-4 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md">
            <FaTimes />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;