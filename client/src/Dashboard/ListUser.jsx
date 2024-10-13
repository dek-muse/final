import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

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
      } catch (error) {
        // console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again later.');
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
        { role: selectedUser.role, region: selectedUser.region, email: selectedUser.email, username: selectedUser.username },
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
      <div className="p-6 rounded-lg shadow-lg w-full max-w-6xl ">
        <h2 className="text-2xl font-bold mb-4 ">User Management</h2>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-4 py-2 w-full sm:w-auto"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border rounded-md px-4 py-2 w-full sm:w-auto"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border rounded-md px-4 py-2 w-full sm:w-auto"
          >
            <option value="">All Regions</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="">Total Users: <span className="font-bold">{userCount}</span></p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <Button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-600 text-white">
                      <FaEdit className="mr-2" />
                    </Button>
                    <Button onClick={() => confirmDelete(user._id)} className="bg-red-500 hover:bg-red-600 text-white">
                      <FaTrashAlt className="mr-2" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold  mb-6">Edit User</h3>
            <form onSubmit={confirmUpdate} className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium ">Role</label>
                <select
                  id="role"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Update</Button>
                <Button onClick={() => setSelectedUser(null)} className="bg-gray-300 hover:bg-gray-400 ">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Are you sure you want to {actionType} this user?</p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={actionType === 'delete' ? handleConfirmDelete : handleConfirmUpdate}
                className="bg-red-600 hover:bg-red-700 text-white mr-2"
              >
                Yes
              </Button>
              <Button onClick={() => setShowConfirmation(false)} className="bg-gray-500 hover:bg-gray-600 text-white">No</Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="text-white text-lg">Loading...</div>
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
