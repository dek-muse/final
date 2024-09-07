import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const DashSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab')?.toLowerCase() || ''; // Ensure it's always a string
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // New sign out handler that clears localStorage and redirects to sign-in
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    dispatch(signoutSuccess()); // Update the state with signout success
    navigate('/signin'); // Redirect to the sign-in page
  };

  const activeClass = 'bg-blue-500 text-white';
  const hoverClass = 'hover:bg-blue-100 hover:text-blue-700';

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label="User"
              labelColor="dark"
              className={`${tab === 'profile' ? activeClass : hoverClass} rounded-lg p-2`}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          
          <Sidebar.Item
            icon={HiArrowSmRight}
            className={`${hoverClass} rounded-lg p-2 cursor-pointer`}
            onClick={handleSignOut} // Use the new sign out handler
          >
            Sign Out
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
