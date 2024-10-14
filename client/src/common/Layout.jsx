// src/common/Layout.jsx
import React from 'react';
import { useSelector } from 'react-redux';
// import Header from './Header';   // Ensure the path is correct
import Sidebare from '../common/Sidebare'; // Ensure the path is correct
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const { currentUser } = useSelector((state) => state.user); // Access user state
  const isHomePage = location.pathname === '/';

  const isHomePage = location.pathname === '/';


  return (
    <div className="flex flex-col h-screen">
      {/* <Header /> Header is always visible */}
      <div className="flex flex-1">
        {currentUser && !isHomePage && <Sidebare />} {/* Sidebar is conditionally rendered */}
        <main className={`flex-1 p-6 overflow-auto ${currentUser ? 'ml-20 md:ml-64' : 'ml-0'}`}>
          <Outlet /> {/* Render nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
