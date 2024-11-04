import React from 'react';

const NoSidebarLayout = ({ children }) => {
  return (
    <div className="flex-grow p-4">{children}</div>
  );
};

export default NoSidebarLayout;
