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
        const response = await axios.get('https://finalbakend.vercel.app', {
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
      await axios.delete(`https://finalbakend.vercel.app${userIdToDelete}`, {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedUser({ ...selectedUser, profilePicture: file });
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
      let profilePictureUrl = selectedUser.profilePicture;

      // If a new file is selected, upload it and get the URL
      if (profilePictureUrl instanceof File) {
        const formData = new FormData();
        formData.append('file', profilePictureUrl);
        const uploadResponse = await axios.post('https://finalbakend.vercel.app', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        profilePictureUrl = uploadResponse.data.url;
      }

      await axios.put(
        `https://finalbakend.vercel.app${selectedUser._id}`,
        { role: selectedUser.role, region: selectedUser.region, profilePicture: profilePictureUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setMessage('User updated successfully');
      setUsers(users.map((user) => (user._id === selectedUser._id ? { ...selectedUser, profilePicture: profilePictureUrl } : user)));
      setFilteredUsers(filteredUsers.map((user) => (user._id === selectedUser._id ? { ...selectedUser, profilePicture: profilePictureUrl } : user)));
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
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Profile</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Name</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Mobile</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <img
                      src={user.profilePicture || 'default-profile.png'}
                      alt={`${user.username}'s profile`}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                    {user.mobile || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <Button onClick={() => handleEdit(user)} className="bg-[#b19d60] hover:bg-blue-700 text-white">
                      <FaEdit className="mr-2" />
                    </Button>
                    <Button onClick={() => confirmDelete(user._id)} className="bg-red-600 hover:bg-red-700 text-white">
                      <FaTrashAlt className="mr-2" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to {actionType} this user?</p>
            <button onClick={actionType === 'delete' ? handleConfirmDelete : handleConfirmUpdate}>Confirm</button>
            <button onClick={() => setShowConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
};

export default UserManagement;
