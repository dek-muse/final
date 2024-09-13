import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome, FaChalkboardTeacher, FaUserPlus, FaUsers, FaBars, FaTimes,
  FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaFlag, FaRegListAlt,
} from 'react-icons/fa';
import { MdReport } from 'react-icons/md';
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
    <div className={`relative flex ${isSidebarOpen ? 'w-64' : 'w-20'} h-screen transition-all duration-300 fixed bg-gray-800`}>
      <div className="flex flex-col w-full h-full shadow-2xl shadow-[#b19d60] bg-gray-900 text-white">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-12 p-4 border-b border-gray-700">
          <button onClick={toggleSidebar} className="text-xl transition-all hover:text-[#b19d60]">
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 p-4">
          {/* Links for All Roles */}
          <div className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => 
                `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
              }
            >
              <FaHome />
              {isSidebarOpen && <span>Dashboard</span>}
              {!isSidebarOpen && <Tooltip content="Dashboard" />}
            </NavLink>
          </div>

          {/* Admin and SuperAdmin Links (Available only for specific regions if required) */}

          {userRole === 'SuperAdmin' && (
  <div className="space-y-2">
    {/* Teachers List NavLink */}
    <NavLink
      to="/teachersList"
      className={({ isActive }) => 
        `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
      }
    >
      <FaChalkboardTeacher />
     </NavLink>

    {/* Report NavLink */}
    <NavLink
      to="/report"
      className={({ isActive }) => 
        `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
      }
    >
      <MdReport />
      {isSidebarOpen ? <span>Report</span> : <Tooltip content="Report" />}
    </NavLink>
  </div>
)}


          {/* Admin Links with Region Check */}
          {userRole === 'Admin' && (
            <>
       {/* Afdheer */}
{hasAccessToRegion('Afdheer') && (
  <NavLink
    to="/teacher/form/afdheer"
    className={({ isActive }) => 
      `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
    }
  >
    <MdGroupAdd />
    {isSidebarOpen && <span>Users (Afdheer Region)</span>}
    {!isSidebarOpen && <Tooltip content="Users" />}
  </NavLink>
)}

{/* Report */}
<NavLink
  to="/report"
  className={({ isActive }) => 
    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
  }
>
  <MdReport />
  {isSidebarOpen ? <span>Report</span> : <Tooltip content="Report" />}
</NavLink>

              {/* Daawo*/}
              {hasAccessToRegion('Daawo') && (
                <NavLink
                  to="/teacher/form/daawo"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Daawo Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
              {/* Doolo*/}
              {hasAccessToRegion('Doolo') && (
                <NavLink
                  to="/teacher/form/doolo"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Doolo Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
              {/* Erar*/}
              {hasAccessToRegion('Erar') && (
                <NavLink
                  to="/teacher/form/erar"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Erar Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
              {/* Faafan*/}
              {hasAccessToRegion('Faafan') && (
                <NavLink
                  to="/teacher/form/faafan"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Faafan Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
               {/* Jarar */}
               {hasAccessToRegion('Jarar') && (
                         <NavLink
                           to="/teacher/form/jarar"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Jarar Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Liibaan */}
               {hasAccessToRegion('Liibaan') && (
                         <NavLink
                           to="/teacher/form/liibaan"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Liibaan Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Qoraxay */}
               {hasAccessToRegion('Qoraxay') && (
                         <NavLink
                           to="/teacher/form/qoraxay"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Qoraxay Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Shabelle */}
               {hasAccessToRegion('Shabelle') && (
                         <NavLink
                           to="/teacher/form/shabelle"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Shabelle Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Sitti */}
               {hasAccessToRegion('Sitti') && (
                         <NavLink
                           to="/teacher/form/shabelle"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Sitti Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
            </>
          )}

          
{userRole === 'Admin' && (
            <>
       {/* Afdheer */}
{hasAccessToRegion('Afdheer') && (
  <NavLink
    to="/teacher/form/afdheer"
    className={({ isActive }) => 
      `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
    }
  >
    <MdGroupAdd />
    {isSidebarOpen && <span>Users (Afdheer Region)</span>}
    {!isSidebarOpen && <Tooltip content="Users" />}
  </NavLink>
)}

{/* Report */}
<NavLink
  to="/report"
  className={({ isActive }) => 
    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
  }
>
  <MdReport />
  {isSidebarOpen ? <span>Report</span> : <Tooltip content="Report" />}
</NavLink>

              {/* Daawo*/}
              {hasAccessToRegion('Daawo') && (
                <NavLink
                  to="/teacher/form/daawo"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Daawo Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
              {/* Doolo*/}
              {hasAccessToRegion('Doolo') && (
                <NavLink
                  to="/teacher/form/doolo"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Doolo Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
              {/* Erar*/}
              {hasAccessToRegion('Erar') && (
                <NavLink
                  to="/teacher/form/erar"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Erar Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
              {/* Faafan*/}
              {hasAccessToRegion('Faafan') && (
                <NavLink
                  to="/teacher/form/faafan"
                  className={({ isActive }) => 
                    `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                  }
                >
                  <MdGroupAdd />
                  {isSidebarOpen && <span>Users (Faafan Region)</span>}
                  {!isSidebarOpen && <Tooltip content="Users" />}
                </NavLink>
              )}
               {/* Jarar */}
               {hasAccessToRegion('Jarar') && (
                         <NavLink
                           to="/teacher/form/jarar"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Jarar Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Liibaan */}
               {hasAccessToRegion('Liibaan') && (
                         <NavLink
                           to="/teacher/form/liibaan"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Liibaan Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Qoraxay */}
               {hasAccessToRegion('Qoraxay') && (
                         <NavLink
                           to="/teacher/form/qoraxay"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Qoraxay Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Shabelle */}
               {hasAccessToRegion('Shabelle') && (
                         <NavLink
                           to="/teacher/form/shabelle"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Shabelle Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
               {/* Sitti */}
               {hasAccessToRegion('Sitti') && (
                         <NavLink
                           to="/teacher/form/shabelle"
                           className={({ isActive }) => 
                             `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                           }
                         >
                           <MdGroupAdd />
                           {isSidebarOpen && <span>Users (Sitti Region)</span>}
                           {!isSidebarOpen && <Tooltip content="Users" />}
                         </NavLink>
                       )}
            </>
          )}
 
        

          {/* User Links */}
          {userRole === 'User' && (
            <div className="space-y-2">
              <NavLink
                to="/userProfile"
                className={({ isActive }) => 
                  `flex items-center space-x-4 p-2 hover:bg-[#b19d60] transition-all rounded-md ${isActive ? 'bg-[#b19d60]' : 'bg-transparent'}`
                }
              >
                <FaRegListAlt />
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
            <FaTimes />
            {isSidebarOpen && <span>Sign Out</span>}
            {!isSidebarOpen && <Tooltip content="Sign Out" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
