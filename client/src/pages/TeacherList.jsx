import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import { IoDownload, IoPersonAdd, IoPencil, IoTrash, IoSearch } from 'react-icons/io5';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions

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
        const response = await axios.get('https://finalbakend.vercel.app/');
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
        setError('Failed to fetch teachers');
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
        await axios.delete(`https://finalbakend.vercel.app/${id}`);
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

  const filteredTeachers = teachers
    .filter((teacher) => {
      const name = teacher.name ? teacher.name.toLowerCase() : '';
      const term = searchTerm ? searchTerm.toLowerCase() : '';
      return name.includes(term);
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
      Name: teacher.name || '',
      Email: teacher.email || '',
      Mobile: teacher.mobile || '',
      'Created By': teacher.createdBy?.username || 'N/A', // Added Created By
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
    <div className="max-w-[90rem] mx-auto p-6 rounded-lg shadow-2xl border shadow-[#b19d60] border-[#b19d60]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 bg-[#2d1346] dark:bg-[#b19d60] text-white p-6 rounded-md">
        <h2 className="text-3xl font-bold dark:text-white uppercase">Teachers List</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/teacher/form')}
            className="py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2 transition duration-150"
          >
            <IoPersonAdd size={20} />
            Add Teacher
          </button>
          <button
            onClick={exportToExcel}
            className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition duration-150"
          >
            <IoDownload size={20} />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        {/* Entries Per Page */}
        <div className="flex items-center gap-2">
          <label>Show</label>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border rounded p-2 dark:text-white bg-white text-black dark:bg-gray-800"
          >
            <option value="30">30</option>
            <option value="90">90</option>
            <option value="120">120</option>
          </select>
          <label>entries</label>
        </div>

        {/* Search and Created By Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <IoSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded pl-10 pr-4 py-2 w-full sm:w-64 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          {/* Created By Filter */}
          <div className="flex items-center gap-2">
            <label>Created By:</label>
            <select
              value={filterCreatedBy}
              onChange={handleCreatedByFilterChange}
              className="border rounded p-2 dark:text-white bg-white text-black dark:bg-gray-800"
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
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Profile</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Name</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Mobile</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Created By</th> {/* New Column */}
              <th className="py-3 px-4 text-left hidden md:table-cell">Updated By</th> {/* New Column */}
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher, index) => (
                <tr key={teacher._id} className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-4 px-4">{indexOfFirstEntry + index + 1}</td>
                  <td className="py-4 px-4 flex items-center">
                    {teacher.picture ? (
                      <img
                        src={teacher.picture}
                        alt={teacher.name}
                        className="w-20 h-20 object-cover rounded-full border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full border border-gray-200 dark:bg-gray-600"></div>
                    )}
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <button
                      onClick={() => navigate(`/teacher/details/${teacher._id}`)} // Navigate to teacher details
                      className="text-blue-600 uppercase hover:text-blue-700 text-sm font-semibold"
                    >
                      {teacher.name}
                    </button>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">{teacher.email}</td>
                  <td className="py-4 px-4 hidden md:table-cell">{teacher.mobile}</td>
                  <td className="py-4 px-4 hidden md:table-cell">{teacher.createdBy?.username || 'N/A'}</td> {/* Display Created By */}
                  <td className="py-4 px-4 hidden md:table-cell">{teacher.updatedBy?.username || 'N/A'}</td> {/* Display Created By */}
                  <td className="py-4 px-4 flex gap-2">

                    <button
                      onClick={() => handleUpdate(teacher._id)}
                      className="text-white bg-[#2d1346] hover:bg-[#9a7d4e] text-sm py-1 px-2 border rounded flex items-center gap-1 transition duration-150"
                      title="Update"
                    >
                      <IoPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher._id)}
                      className="text-red-600 hover:text-red-700 text-sm py-1 px-2 border rounded flex items-center gap-1 transition duration-150"
                      title="Delete"
                    >
                      <IoTrash size={16} />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
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
          className={`bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TeacherList;