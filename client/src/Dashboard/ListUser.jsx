import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaFilter, FaSearch, FaTrashAlt, FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';   


const Button = ({ type = 'button', onClick, disabled, className, children }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`font-bold py-2 px-4 rounded transition duration-200 ease-in-out ${className}`}
  >
    {children}
  </button>
);

const roles = ['Admin', 'SuperAdmin', 'User'];
const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(''); 
   const { currentUser } = useSelector((state) => state.user);
   const [usernames, setUsernames] = useState({}); // New state for usernames
   const [filtersVisible, setFiltersVisible] = useState(true); // State for toggling filter visibility



   const fetchUsernamesByIds = async (userIds) => {
    try {
      const response = await axios.get('https://tuserapi.vercel.app/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const users = response.data.reduce((acc, user) => {
        acc[user._id] = user.username; // Map user ID to username
        return acc;
      }, {});
      return users;
    } catch (error) {
      // console.error('Error fetching usernames:', error);
      return {error};
    }
  };
  

   useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://tuserapi.vercel.app/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setUserCount(response.data.length);
        
        // Fetch usernames for updatedBy field
        const userIds = response.data.map(user => user.updatedBy).filter(Boolean); // Get unique IDs
        const usernames = await fetchUsernamesByIds(userIds);
        setUsernames(usernames);
      } catch (error) {
        setError('Failed your network. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = users;

      if (searchQuery) {
        filtered = filtered.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      if (selectedRole) {
        filtered = filtered.filter(user => user.role === selectedRole);
      }

      if (selectedRegion) {
        filtered = filtered.filter(user => user.region === selectedRegion);
      }

      setFilteredUsers(filtered);
      setUserCount(filtered.length);
    };

    applyFilters();
  }, [searchQuery, selectedRole, selectedRegion, users]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setMessage('');
  };

  const confirmDelete = (userId) => {
    setShowConfirmation(true);
    setActionType('delete');
    setUserIdToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    try {
      await axios.delete(`https://tuserapi.vercel.app/${userIdToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.filter(user => user._id !== userIdToDelete));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userIdToDelete));
      setMessage('User deleted successfully');
      setUserCount(userCount - 1);
    } catch (error) {
      // console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
    } finally {
      setIsLoading(false);
      setUserIdToDelete(null);
    }
  };

  const confirmUpdate = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
    setActionType('update');
  };

  const handleConfirmUpdate = async () => {
    if (!selectedUser) return; // Safety check

    setShowConfirmation(false);
    setIsLoading(true);

    try {
      const response = await axios.put(
        `https://tuserapi.vercel.app/${selectedUser._id}`,
        { 
          role: selectedUser.role, 
          region: selectedUser.region, 
          email: selectedUser.email, 
          username: selectedUser.username,
          updatedBy: currentUser._id // Add the updatedBy field
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setMessage('User updated successfully!');
      setUsers(users.map(user => (user._id === selectedUser._id ? response.data : user)));
      setFilteredUsers(filteredUsers.map(user => (user._id === selectedUser._id ? response.data : user)));

      setSelectedUser(null); // Clear the selected user
    } catch (error) {
      // console.error('Error updating user:', error);
      setError('Failed to update user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 ">
     <div className="p-6 space-y-6 w-full max-w-8xl ">
     <div className='flex flex-col sm:flex-row justify-between gap-8'>
  {/* Title Section */}
  <h2 className="text-4xl font-bold  mb-6 flex items-center gap-4">
    <FaUsers size={28} className="text-indigo-600" />
    User Management
  </h2>

  {/* Search & Filter Section */}
  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
    
    {/* Search Input */}
    <div className="flex items-center gap-4">
    <FaSearch className="text-gray-600" />
    <input
      type="text"
      placeholder="Search by username..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border rounded-md px-4 py-2 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500"
    />
  </div>

    {/* Toggle Button */}
    <button
      onClick={() => setFiltersVisible(!filtersVisible)}
      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
    >
      <FaFilter size={20} />
      {filtersVisible ? 'Hide Filter' : 'Show Filter'}
    </button>

    {/* Filter Section */}
    {filtersVisible && (
      <div className="flex gap-4 items-center">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border rounded-md px-4 py-2 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border rounded-md px-4 py-2 w-full sm:w-auto focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Zone</option>
          {REGIONS.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>
    )}
  </div>
</div>


  {/* User Count Display */}
  <div className="mb-6">
    <p className="text-lg ">
      Total Users: <span className="font-semibold">{userCount}</span>
    </p>
  </div>

  {/* User Table */}
  <div className="overflow-x-auto   rounded-lg shadow-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 ">
        <tr>
          {['No', 'Profile Picture', 'Username', 'Email', 'Role', 'Region', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredUsers.map((user, index) => (
          <tr key={user._id} className="hover:bg-indigo-300 hover:text-black">
            <td className="px-6 py-4 text-sm">{index + 1}</td>
            <td className="px-6 py-4 text-sm">
              <img src={user.profilePicture || '/default-profile.png'} alt="Profile" className="h-12 w-12 rounded-full" />
            </td>
            <td className="px-6 py-4 text-sm">{user.username}</td>
            <td className="px-6 py-4 text-sm">{user.email}</td>
            <td className="px-6 py-4 text-sm">{user.role}</td>
            <td className="px-6 py-4 text-sm">{user.region}</td>
            <td className="px-6 py-4 text-sm font-medium flex gap-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                onClick={() => confirmDelete(user._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md flex items-center"
              >
                <FaTrashAlt className="mr-2" />
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


{selectedUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Edit User</h3>
      <form onSubmit={confirmUpdate} className="space-y-6">
        <div>
          <label htmlFor="role" className="block text-sm font-medium ">Role</label>
          <select
            id="role"
            value={selectedUser.role}
            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium ">Region</label>
          <select
            id="region"
            value={selectedUser.region}
            onChange={(e) => setSelectedUser({ ...selectedUser, region: e.target.value })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200">
            Update
          </Button>
          <Button onClick={() => setSelectedUser(null)} className="bg-gray-300 hover:bg-gray-400  py-2 px-4 rounded-md shadow-md transition duration-200">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

{showConfirmation && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <p className="text-lg font-medium ">Are you sure you want to {actionType} this user?</p>
      <div className="flex justify-end mt-6 space-x-4">
        <Button
          onClick={actionType === 'delete' ? handleConfirmDelete : handleConfirmUpdate}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
        >
          Yes
        </Button>
        <Button
          onClick={() => setShowConfirmation(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
        >
          No
        </Button>
      </div>
    </div>
  </div>
)}


      {isLoading && (
        <div className="min-h-screen flex items-center justify-center -mt-6">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
            <div className="w-16 h-16 border-4 border-transparent  text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
          </div>
        </div>
      </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg z-20">
          {error}
        </div>
      )}

      {message && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg z-20">
          {message}
        </div>
      )}
    </div>
  );
};

export default UserManagement;