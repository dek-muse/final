import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../Dashboard/DashSidebar'; // Update the correct path if needed
import DashProfile from '../Dashboard/DashProfile'; // Ensure this path is correct

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile component rendering based on tab */}
      {tab === 'profile' && <DashProfile />}
    </div>
  );
};

export default Dashboard;
