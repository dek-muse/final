import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import { IoDownload, IoPersonAdd, IoPencil, IoTrash, IoSearch } from 'react-icons/io5';
import TeacherDetailsCard from './TeacherDetailsCard';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

// Ensure Firebase is initialized in your project
// import { firebaseApp } from '../firebase'; // Import your Firebase configuration

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(30);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('https://finalbakend.vercel.app/');
        const teachersWithImages = await Promise.all(response.data.map(async (teacher) => {
          if (teacher.picture) {
            try {
              const imageRef = ref(storage, teacher.picture); // Get reference to the image
              const imageUrl = await getDownloadURL(imageRef); // Get download URL
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
  }, [storage]);

  const handleUpdate = (id) => {
    navigate(`/update-teacher/${id}`);
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`https://finalbakend.vercel.app/${id}`);
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
      <div className="min-h-screen flex items-center justify-center -mt-6">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
          <div className="w-16 h-16 border-4 border-transparent  text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
        </div>
      </div>
    </div>

      
    );

  if (error)
    return <p className="text-center text-red-500">
  <div className="flex items-center justify-center w-[30em] h-[30em]">
      <div className="flex flex-col items-center justify-center mt-[5em] relative">
        <div className="w-[5em] h-[5em] rounded-full border-2 border-black bg-[#f27405] mb-[-6em] relative z-[-1]">
          <div className="absolute bg-transparent w-[50px] h-[56px] ml-[1.68em] rounded-full transform rotate-[140deg] border-4 border-transparent shadow-[inset_0px_16px_#a85103,inset_0px_16px_1px_1px_#a85103]" />
          <div className="absolute mt-[-9.4em] ml-[0.4em] rotate-[-25deg] w-[1em] h-[0.5em] rounded-full bg-[#f69e50]" />
          <div className="absolute mt-[0.2em] ml-[1.25em] rotate-[-20deg] w-[1.5em] h-[0.8em] rounded-full bg-[#f69e50]" />
        </div>
        <div className="w-[17em] h-[9em] mt-[3em] rounded-[15px] bg-[#d36604] flex justify-center border-2 border-[#1d0e01] shadow-[inset_0.2em_0.2em_#e69635] relative">
          <div className="absolute w-[17em] h-[9em] rounded-[15px]   bg-[repeating-conic-gradient(#d36604_0_0.0001%,#00000070_0_0.0002%)] opacity-[0.09]" />
          <div className="flex items-center justify-center rounded-[15px] shadow-[3.5px_3.5px_0px_#e69635]">
            <div className="w-auto h-auto rounded-[10px]">
              <div className="w-[11em] h-[7.75em] flex items-center justify-center rounded-[10px]">
                <div className="w-[13em] h-[7.85em] border-2 border-[#1d0e01]   bg-[repeating-conic-gradient(#000_0_0.0001%,#ffffff_0_0.0002%)] bg-blend-difference animate-[b_0.2s_infinite_alternate] rounded-[10px] flex items-center justify-center font-bold text-[#252525] tracking-widest text-center">
                  Check Your Network :(
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center self-end space-y-[0.5em]">
            <div className="w-[4.25em] h-[8em] bg-[#e69635] border-2 border-[#1d0e01] p-[0.6em] rounded-[10px] flex flex-col items-center justify-center space-y-[0.75em] shadow-[3px_3px_0px_#e69635]">
              <div className="w-[1.65em] h-[1.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_2px_2px_1px_#b49577,-2px_0px_#513721,-2px_0px_0px_1px_black] relative">
                <div className="absolute mt-[1em] ml-[0.5em] rotate-[47deg] w-[0.1em] h-[0.4em] bg-[#000000]" />
                <div className="absolute mt-[0.9em] ml-[0.8em] rotate-[47deg] w-[0.1em] h-[0.55em] bg-[#000000]" />
                <div className="absolute mt-[-0.1em] ml-[0.65em] rotate-[45deg] w-[0.15em] h-[1.5em] bg-[#000000]" />
              </div>
              <div className="w-[1.65em] h-[1.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_2px_2px_1px_#b49577,-2px_0px_#513721,-2px_0px_0px_1px_black] relative">
                <div className="absolute mt-[1.05em] ml-[0.8em] rotate-[-45deg] w-[0.15em] h-[0.4em] bg-[#000000]" />
                <div className="absolute mt-[-0.1em] ml-[0.65em] rotate-[-45deg] w-[0.15em] h-[1.5em] bg-[#000000]" />
              </div>
            </div>
            <div className="flex flex-col space-y-[0.5em]">
              <div className="flex space-x-[0.25em]">
                <div className="w-[0.65em] h-[0.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                <div className="w-[0.65em] h-[0.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                <div className="w-[0.65em] h-[0.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
              </div>
              <div className="w-auto h-[2px] bg-[#171717]" />
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center space-x-[8.7em]">
          <div className="w-[2em] h-[1em] border-2 border-[#171717] bg-[#4d4d4d] mt-[-0.15em] z-[-1]" />
          <div className="w-[2em] h-[1em] border-2 border-[#171717] bg-[#4d4d4d] mt-[-0.15em] z-[-1]" />
          <div className="absolute h-[0.15em] w-[17.5em] bg-[#171717] mt-[0.8em]" />
        </div>
      </div>
    </div></p>;

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-lg  shadow-2xl border shadow-[#b19d60] border-[#b19d60]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 bg-[#b19d60] p-6 rounded-md">
        <h2 className="text-3xl font-bold  dark:text-white uppercase">Teachers List</h2>
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
          <label className="  ">Show</label>
          <select 
            value={entriesPerPage} 
            onChange={(e) => setEntriesPerPage(Number(e.target.value))} 
            className="border rounded p-2  dark:text-white bg-white text-black dark:bg-gray-800"
          >
            <option value="30">30</option>
            <option value="90">90</option>
            <option value="120">120</option>
            {/* <option value="100">100</option> */}
          </select>
          <label className=" ">entries</label>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <IoSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name..."  
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded pl-10 pr-4 py-2 w-full sm:w-64    dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full  border border-gray-300 ">
          <thead className="  border-b border-gray-300 ">
            <tr cl>
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
                <tr key={teacher._id} className="border-b border-gray-200   hover:bg-gray-100 dark:hover:bg-gray-700 ">
                  <td className="py-4 px-4  ">{indexOfFirstEntry + index + 1}</td>
                  <td className="py-4 px-4 flex items-center">
                    {teacher.picture ? (
                      <img
                        src={teacher.picture}
                        alt={teacher.name}
                        className="w-12 h-12 object-cover rounded-full border border-gray-200 "
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full border border-gray-200 dark:bg-gray-600 "></div>
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
                <td colSpan="6" className="text-center py-4  ">
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
              className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 '} hover:bg-blue-500 hover:text-white transition duration-150`}
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
