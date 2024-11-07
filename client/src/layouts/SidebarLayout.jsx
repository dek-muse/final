import React from 'react';
import Sidebare from '../common/Sidebare'; // Import your Sidebar component

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex ">
      <div className='-mt-6 -ml-6'>
      <Sidebare />
      </div>
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;
