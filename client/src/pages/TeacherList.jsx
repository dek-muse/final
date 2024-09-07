import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx'; 
import { IoDownload, IoPersonAdd, IoPencil, IoTrash, IoSearch } from 'react-icons/io5';
import TeacherDetailsCard from './TeacherDetailsCard';
// import { storage } from '../firebase';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(17);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('https://finalbakend.vercel.app/');
        const teachersWithImages = await Promise.all(response.data.map(async (teacher) => {
          if (teacher.picture) {
            try {
              const imageUrl = await storage.refFromURL(teacher.picture).getDownloadURL();
              return { ...teacher, picture: imageUrl };
            } catch (error) {
              console.error('Error fetching image URL:', error);
              return teacher; // Return teacher without the image
            }
          }
          return teacher;
        }));
        setTeachers(teachersWithImages);
      } catch (err) {
        setError('Failed to fetch teachers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update-teacher/${id}`);
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`https://backend-pink-beta.vercel.app/api/teachers/${id}`);
        setTeachers(teachers.filter(teacher => teacher._id !== id));
      } catch (err) {
        console.error('Failed to delete teacher', err);
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

  const filteredTeachers = teachers
    .filter((teacher) => {
      const name = teacher.name ? teacher.name.toLowerCase() : '';
      const term = searchTerm ? searchTerm.toLowerCase() : '';
      return name.includes(term);
    })
    .filter((teacher) => {
      if (filterStatus === 'all') return true;
      return teacher.status === filterStatus;
    });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToExcel = () => {
    const data = filteredTeachers.map((teacher, index) => ({
      No: index + 1,
      Name: teacher.name || '',
      Email: teacher.email || '',
      Mobile: teacher.mobile || '',
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Teachers');
    writeFile(workbook, 'Teachers_List.xlsx');
  };

  if (isLoading) 
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <div className="flex justify-center items-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );

  if (error) 
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-lg bg-white dark:bg-gray-800 shadow-2xl border shadow-[#b19d60] border-[#b19d60]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 bg-[#b19d60] p-6 rounded-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white uppercase">Teacher List</h2>
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-300">Show</label>
          <select 
            value={entriesPerPage} 
            onChange={(e) => setEntriesPerPage(Number(e.target.value))} 
            className="border rounded p-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value="17">17</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <label className="text-gray-600 dark:text-gray-300">entries</label>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <IoSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name..."  
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded pl-10 pr-4 py-2 w-full sm:w-64 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Profile</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Name</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Mobile</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher, index) => (
                <tr key={teacher._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{indexOfFirstEntry + index + 1}</td>
                  <td className="py-4 px-4 flex items-center">
                    {teacher.picture ? (
                      <img
                        src={teacher.picture}
                        alt={teacher.name}
                        className="w-12 h-12 object-cover rounded-full border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full border border-gray-200 dark:bg-gray-600 dark:border-gray-700"></div>
                    )}
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <button
                      onClick={() => handleViewDetails(teacher)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold truncate w-full text-left"
                      title="View Details"
                    >
                      {teacher.name}
                    </button>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell truncate">{teacher.email}</td>
                  <td className="py-4 px-4 hidden md:table-cell truncate">{teacher.mobile}</td>
                  <td className="py-4 px-4 flex gap-2">
                    <button
                      onClick={() => handleUpdate(teacher._id)}
                      className="text-white bg-[#b19d60] hover:bg-[#9a7d4e] text-sm py-1 px-2 border rounded flex items-center gap-1 transition duration-150"
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
                <td colSpan="6" className="text-center py-4 text-gray-600 dark:text-gray-300">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredTeachers.length > entriesPerPage && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[...Array(Math.ceil(filteredTeachers.length / entriesPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              } hover:bg-blue-500 hover:text-white transition duration-150`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      {selectedTeacher && (
        <TeacherDetailsCard 
          teacher={selectedTeacher} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}
    </div>
  );
};

export default TeacherList;
