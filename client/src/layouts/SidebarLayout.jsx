import React from 'react';
import Sidebare from '../common/Sidebare'; // Import your Sidebar component

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebare />
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;
