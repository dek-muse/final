import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome, FaChalkboardTeacher, FaUserPlus, FaUsers, FaBars, FaTimes,
  FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaFlag, FaRegListAlt,
  FaTable,
} from 'react-icons/fa';
import { MdAddModerator, MdReport } from 'react-icons/md';
import { MdGroupAdd } from "react-icons/md";
import { Tooltip } from 'react-tooltip'; // For tooltips on collapsed sidebar

const regions = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleRegionDropdown = () => setIsRegionOpen(!isRegionOpen);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userRegion = localStorage.getItem('region'); // Assuming region is stored in localStorage

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('region'); // Clear region on sign out
    navigate('/signin');
  };

  // Function to check if user belongs to the required region
  const hasAccessToRegion = (requiredRegion) => {
    if (!requiredRegion) return true; // If no region restriction, allow access
    return userRegion === requiredRegion;
  };

  return (
    <div className={`relative flex ${isSidebarOpen ? 'w-64' : 'w-20'} h-screen transition-all duration-300 fixed bg-gradient-to-b from-gray-800 to-gray-900`}>
      <div className="flex flex-col w-full h-full shadow-lg shadow-[#b19d60] text-white">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-12 p-4 border-b border-gray-700">
          <button onClick={toggleSidebar} className="text-xl transition-all hover:text-[#b19d60]">
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 p-4">
          {/* Links for All Roles */}
          <div className="space-y-2"></div>

          {/* SuperAdmin Links */}
          {userRole === 'SuperAdmin' && (
            <div className="space-y-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                }
              >
                <FaHome size={20} />
                {isSidebarOpen && <span>Dashboard</span>}
                {!isSidebarOpen && <Tooltip content="Dashboard" />}
              </NavLink>

              <NavLink
                to="/teachersList"
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                }
              >
                <FaChalkboardTeacher size={20} />
                {isSidebarOpen ? <span>Teachers List</span> : <Tooltip content="Teachers List" />}
              </NavLink>

              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                }
              >
                <MdReport size={20} />
                {isSidebarOpen ? <span>Report</span> : <Tooltip content="Report" />}
              </NavLink>

              <NavLink
                to="/listUsers"
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                }
              >
                <FaUsers size={20} />
                {isSidebarOpen ? <span>List Users</span> : <Tooltip content="List Users" />}
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                }
              >
                <MdAddModerator size={20} />
                {isSidebarOpen ? <span>Create Users</span> : <Tooltip content="Create Users" />}
              </NavLink>
            </div>
          )}

          {/* Admin Links with Region Check */}
          {userRole === 'Admin' && (
            <>
              {regions.map(region => (
                hasAccessToRegion(region) && (
                  <NavLink
                    key={region}
                    to={`/teacher/form/${region.toLowerCase()}`}
                    className={({ isActive }) =>
                      `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                    }
                  >
                    <MdGroupAdd size={20} />
                    {isSidebarOpen && <span>Teacher form ({region})</span>}
                    {!isSidebarOpen && <Tooltip content={`Teacher form (${region})`} />}
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
                      `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                    }
                  >
                    <MdReport size={20} />
                    {isSidebarOpen ? <span>Report ({region})</span> : <Tooltip content={`Report (${region})`} />}
                  </NavLink>
                )
              ))}
            </>
          )}

          {/* User Links */}
          {userRole === 'User' && (
            <div className="space-y-2">
              <NavLink
                to="/userProfile"
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-2 rounded-md transition-all duration-200 hover:bg-[#b19d60] ${isActive ? 'bg-[#b19d60] font-bold' : 'bg-transparent'}`
                }
              >
                <FaRegListAlt size={20} />
                {isSidebarOpen && <span>Profile</span>}
                {!isSidebarOpen && <Tooltip content="Profile" />}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-auto p-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md"
          >
            <FaTimes size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
            {!isSidebarOpen && <Tooltip content="Sign Out" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;