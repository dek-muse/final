import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Button component for reuse
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
        console.error('Error fetching users:', error);
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
        filtered = filtered.filter(
          (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedRole) {
        filtered = filtered.filter((user) => user.role === selectedRole);
      }

      setFilteredUsers(filtered);
      setUserCount(filtered.length);
    };

    applyFilters();
  }, [searchQuery, selectedRole, users]);

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
      setUsers(users.filter((user) => user._id !== userIdToDelete));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userIdToDelete));
      setMessage('User deleted successfully');
      setUserCount(userCount - 1);
    } catch (error) {
      console.error('Error deleting user:', error);
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
    setShowConfirmation(false);
    setIsLoading(true);
    try {
      // Only update role and region
      await axios.put(
        `https://tuserapi.vercel.app/${selectedUser._id}`,
        { role: selectedUser.role, region: selectedUser.region },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('User updated successfully');
      setUsers(users.map((user) => (user._id === selectedUser._id ? selectedUser : user)));
      setFilteredUsers(filteredUsers.map((user) => (user._id === selectedUser._id ? selectedUser : user)));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 shadow-2xl border shadow-[#b19d60] border-[#b19d60] rounded-md">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <div className="mb-7 items-center rounded-lg flex justify-between gap-4 p-6 bg-[#b19d60]">
          <h2 className="text-2xl font-bold text-start">User Management</h2>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2 py-1 h-10 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 text-lg">
          <p>
            Total Users: <span className="font-bold">{userCount}</span>
          </p>
        </div>

        <div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.region || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <Button
                      onClick={() => handleEdit(user)}
                      className="bg-[#b19d60] hover:bg-blue-700 text-white"
                    >
                      <FaEdit className="mr-2" />
                    </Button>
                    <Button
                      onClick={() => confirmDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <FaTrashAlt className="mr-2" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12">
    
          {isLoading && 
          <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-gray-800 text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
            
          </div>
        </div>
        }
          {error && <p className="text-center text-red-600">:</p>}
          {message && <p className="text-center text-green-600">{message}</p>}
        </div>

        {/* Edit User Modal */}
        {selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center  k bg-opacity-50 z-50">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Edit User</h2>
              <form onSubmit={confirmUpdate}>
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <select
                    id="region"
                    value={selectedUser.region || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, region: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                  >
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#b19d60] hover:bg-[#8e793f] text-white">
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center  k bg-opacity-50 z-50">
            <div className="  p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">
                {actionType === 'delete' ? 'Confirm Delete' : 'Confirm Update'}
              </h2>
              <p className="mb-4">
                Are you sure you want to {actionType === 'delete' ? 'delete' : 'update'} this user?
              </p>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowConfirmation(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                  Cancel
                </Button>
                <Button
                  onClick={actionType === 'delete' ? handleConfirmDelete : handleConfirmUpdate}
                  className="bg-[#b19d60] hover:bg-[#8e793f] text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
