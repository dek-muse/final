import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import { IoDownload, IoPersonAdd, IoPencil, IoTrash, IoSearch } from 'react-icons/io5';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions
import { PiExportBold } from "react-icons/pi";
import { FaUser } from 'react-icons/fa';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(30);
  const [filterStatus, setFilterStatus] = useState('all');
   const [filterCreatedBy, setFilterCreatedBy] = useState('all'); // New state for Created By filter
  const navigate = useNavigate();
  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/finalapi/');
        const teachersWithImages = await Promise.all(
          response.data.map(async (teacher) => {
            if (teacher.picture) {
              try {
                const imageRef = ref(storage, teacher.picture); // Get reference to the image
                const imageUrl = await getDownloadURL(imageRef); // Get download URL
                return { ...teacher, picture: imageUrl };
              } catch (error) {
                // console.error('Error fetching image URL:', error);
                return teacher; // Return teacher without the image
              }
            }
            return teacher;
          })
        );
        setTeachers(teachersWithImages);
      } catch (err) {
        setError('Waan ka xumanahay interner kaga ayaa xun  ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [storage]);

  const handleUpdate = (id) => {
    navigate(`/update-teacher/${id}`);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`/finalapi/${id}`);
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
      } catch (err) {
        // console.error('Failed to delete teacher', err);
        setError('Failed to delete teacher');
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleCreatedByFilterChange = (event) => {
    setFilterCreatedBy(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const name = teacher.name ? teacher.name.toLowerCase() : '';
    const teacherId = teacher.teacherId ? teacher.teacherId.toLowerCase() : ''; // Assuming _id is the teacher ID
    const term = searchTerm ? searchTerm.toLowerCase() : '';
    return name.includes(term) || teacherId.includes(term);
  })  
    .filter((teacher) => {
      if (filterStatus === 'all') return true;
      return teacher.status === filterStatus;
    })
    .filter((teacher) => {
      if (filterCreatedBy === 'all') return true;
      return teacher.createdBy?.username === filterCreatedBy;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent out-of-bounds
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const data = filteredTeachers.map((teacher, index) => ({
      No: index + 1,
      id: teacher.teacherId || '',
      Name: teacher.name || '',
      Email: teacher.email || '',
      Mobile: teacher.mobile || '',
      'Created By': teacher.createdBy?.username || 'N/A', // Added Created By
      '	Updated By': teacher.	updatedBy?.username || 'N/A', // Added 	Updated By
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Teachers');
    writeFile(workbook, 'Teachers_List.xlsx');
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center -mt-6">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
          <div className="w-16 h-16 border-4 border-transparent  text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
        </div>
      </div>
    </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );

  return (
    <div className="mx-auto p-6">

  {/* Header Section */}
  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-6 sm:space-y-0">
    <h2 className="flex items-center gap-4 text-3xl font-semibold ">
      <FaUser className="text-indigo-600" />
      Teachers List
    </h2>
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => navigate('/teacher/form')}
        className="py-3 px-6 rounded-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 flex items-center gap-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
      >
        <IoPersonAdd size={20} />
        Add Teacher
      </button>
      <button
        onClick={exportToExcel}
        className="py-3 px-6 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 flex items-center gap-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
      >
        <PiExportBold size={20} />
        Export to Excel
      </button>
    </div>
  </div>

  {/* Filters and Search */}
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-6 sm:space-y-0">
    {/* Entries Per Page */}
    <div className="flex items-center gap-4">
      <label className="text-lg text-gray-700 dark:text-white">Show</label>
      <select
        value={entriesPerPage}
        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
        className="border rounded p-3 dark:text-white dark:bg-gray-800 text-black dark:bg-gray-800 focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
      >
        <option value="30">30</option>
        <option value="90">90</option>
        <option value="120">120</option>
      </select>
     </div>

    {/* Search and Created By Filter */}
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Search Bar */}
      <div className="flex mb-4 sm:mb-0 w-full sm:w-64">
        <input
          type="text"
          placeholder="Search by Name or Teacher ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg pl-10 pr-4 py-3 w-full  dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
      </div>

      {/* Created By Filter */}
      <div className="flex items-center gap-2">
        <label className="text-lg text-gray-700 dark:text-white">Created By:</label>
        <select
          value={filterCreatedBy}
          onChange={handleCreatedByFilterChange}
          className="border rounded-lg p-3 dark:text-white dark:bg-gray-800 text-black dark:bg-gray-800 focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          <option value="all">All</option>
          {Array.from(new Set(teachers.map((teacher) => teacher.createdBy?.username))).map((creator, index) => (
            creator && <option key={index} value={creator}>{creator}</option>
          ))}
        </select>
      </div>
    </div>
  </div>

  {/* Teachers Table */}
  <div className="overflow-x-auto dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-500">
    <table className="min-w-full border border-gray-200 rounded-lg bg-gradient-to-tl from-blue-100 via-indigo-200 to-purple-100">
      <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md">
        <tr>
          <th className="py-4 px-6 text-left font-bold text-lg">Id</th>
          <th className="py-4 px-6 text-left font-bold text-lg">Profile</th>
          <th className="py-4 px-6 text-left font-bold text-lg hidden md:table-cell">Name</th>
          <th className="py-4 px-6 text-left font-bold text-lg hidden md:table-cell">Email</th>
          <th className="py-4 px-6 text-left font-bold text-lg hidden md:table-cell">Mobile</th>
          <th className="py-4 px-6 text-left font-bold text-lg hidden md:table-cell">Created By</th>
          <th className="py-4 px-6 text-left font-bold text-lg hidden md:table-cell">Updated By</th>
          <th className="py-4 px-6 text-left font-bold text-lg">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentTeachers.length > 0 ? (
          currentTeachers.map((teacher) => (
            <tr
              key={teacher._id}
              className="transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-800 dark:bg-gray-800 border-b border-gray-200 hover:shadow-xl"
            >
              <td className="py-4 px-6 hidden md:table-cell">{teacher.teacherId}</td>
              <td className="py-4 px-6 flex items-center justify-center">
                {teacher.picture ? (
                  <img
                    src={teacher.picture}
                    alt={teacher.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-indigo-300 shadow-lg transform transition-all duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full border-2 border-indigo-300 shadow-lg"></div>
                )}
              </td>
              <td className="py-4 px-6 hidden md:table-cell">
                <button
                  onClick={() => navigate(`/teacher/details/${teacher._id}`)}
                  className="text-indigo-700 font-semibold hover:text-indigo-900 text-sm transition-all duration-200 transform hover:scale-105"
                >
                  {teacher.name}
                </button>
              </td>
              <td className="py-4 px-6 hidden md:table-cell">{teacher.email}</td>
              <td className="py-4 px-6 hidden md:table-cell">{teacher.mobile}</td>
              <td className="py-4 px-6 hidden md:table-cell">{teacher.createdBy?.username || 'N/A'}</td>
              <td className="py-4 px-6 hidden md:table-cell">{teacher.updatedBy?.username || 'N/A'}</td>
              <td className="py-4 px-6 flex justify-center gap-4">
                <button
                  onClick={() => handleUpdate(teacher._id)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm py-2 px-4 rounded-md transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  title="Update"
                >
                  <IoPencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(teacher._id)}
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm py-2 px-4 rounded-md transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  title="Delete"
                >
                  <IoTrash size={16} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-6 text-gray-500">
              No teachers found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination Controls */}
  <div className="flex justify-between items-center my-4">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      Previous
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      Next
    </button>
  </div>
</div>

  );
};

export default TeacherList;