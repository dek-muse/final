// src/TeachersInfo.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeDropper } from 'react-icons/fa';
import { FaEyeLowVision } from 'react-icons/fa6';

  // Qeexitaanka Goobaha iyo Degmooyinka
  const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

  const DISTRICTS = {
    'Afdheer': ['Hargeelle', 'Dhaawac', 'Baarey', 'Limey Galbeed', 'Raaso', 'Dollow Bay', 'Ceelkari', 'Qooxle', 'Godgod'],
    'Daawo': ['Qadhadhumo', 'Hudet', 'Mooyale', 'Mubarak'],
    'Doolo': ['Daraatole', 'Wardheer- Xarunta Gobalka', 'Danood', 'Galxumur', 'Galaadi', 'Bookh', 'Lehel-yucub'],
    'Erar': ['Fiiq', 'Xamaro', 'Waangay', 'Lagahida', 'Yoxob', 'Salaxaad', 'Mayu-Muluqo', 'Qubi'],
    'Faafan': ['Tuliguuled', 'Goljano', 'Harooreys', 'Shabeleey', 'Harawo', 'Mula', 'Qabribayax', 'Xarshin', 'Gursum', 'Babili', 'Awbare'],
    'Jarar': ['Daroor', 'Aware', 'Dhagax-buur', 'Dhagax-madow', 'Gunagado', 'Gashamo', 'Birqod', 'Dig', 'Bilcil buur', 'Araarso', 'Yoocaale'],
    'Liibaan': ['Filtu', 'Dollo Adow', 'Qarsadula', 'Gura-dhamoole', 'Goora-Baqaqsa', 'Boqol maayo', 'Dekasuftu'],
    'Nogob': ['Dhuxun', 'Gerbo', 'Xaraarey', 'Ayun', 'Hor-shagah', 'Segeg', 'Ceelweyne'],
    'Qoraxay': ['Qabridahar', 'Shilaabo', 'Dhobaweyn', 'Shaygoosh', 'Marsin', 'Ceel-ogaden', 'Las-dharkeynle', 'Boodaley', 'Higlooley', 'Goglo/kudunbuur'],
    'Shabelle': ['Dhanan', 'Godey', 'Qalafe', 'Beer caano', 'Feerfer', 'Iimey bari', 'Mustaxiil', 'Elele', 'Cadaadle', 'Abaqarow'],
    'Sitti': ['Afdem', 'Ayshaca', 'Mieso', 'Dembel', 'Erar', 'Shiniile', 'Hadhagale', 'Biki', 'Geblalu', 'Dhuunya'],
  }; 
   // Replace with actual data
const educationLevels = ['Primary', 'Secondary', 'Tertiary']; // Replace with actual data
const teacherType = ['Permanent', 'Contract']; // Replace with actual data
const sexOptions = ['Male', 'Female', 'Other']; // Replace with actual data
const nativeLevels = ['Native', 'Non-Native']; // Replace with actual data

function TeachersInfo() {
  const [teachers, setTeachers] = useState([]); // All teacher data
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // For search functionality
  const [sortBy, setSortBy] = useState(''); // For sorting functionality
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [filters, setFilters] = useState({
    region: '',
    district: '',
    educationLevel: '',
    teacherType: '',
    yearJoined: '',
    sex: '', // Added new filter for sex
    nativeLevel: '' // Added new filter for native level
  });
  const itemsPerPage = 50;

  useEffect(() => {
    axios.get('https://finalbakend.vercel.app/')
      .then(response => {
        setTeachers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      region: '',
      district: '',
      educationLevel: '',
      teacherType: '',
      yearJoined: '',
      sex: '', // Reset new filter for sex
      nativeLevel: '' // Reset new filter for native level
    });
  };

  // Filter and sort teachers based on search query, selected sort, and filters
  const filteredTeachers = teachers
    .filter((teacher) => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjectsLearned.join(', ').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = filters.region ? teacher.region === filters.region : true;
      const matchesDistrict = filters.district ? teacher.district === filters.district : true;
      const matchesEducationLevel = filters.educationLevel ? teacher.educationLevel === filters.educationLevel : true;
      const matchesTeacherType = filters.teacherType ? teacher.teacherType === filters.teacherType : true;
      const matchesYearJoined = filters.yearJoined ? teacher.yearJoined === filters.yearJoined : true;
      const matchesSex = filters.sex ? teacher.sex === filters.sex : true; // Match by sex
      const matchesNativeLevel = filters.nativeLevel ? teacher.nativeLevel === filters.nativeLevel : true; // Match by native level

      return matchesSearch && matchesRegion && matchesDistrict && matchesEducationLevel && matchesTeacherType && matchesYearJoined && matchesSex && matchesNativeLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'joiningDate') {
        return new Date(a.joiningDate) - new Date(b.joiningDate);
      } else if (sortBy === 'experience') {
        return parseInt(a.experience) - parseInt(b.experience);
      }
      return 0;
    });

  // Paginate the filtered results
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return  <div className="min-h-screen flex items-center justify-center -mt-6">
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
        <div className="w-16 h-16 border-4 border-transparent  text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
      </div>
    </div>
  </div>;
  }

  return (
    <div className="container  px-0">

      {/* Filters Section */}
      <div className="p-6 max-w-[2200px] mx-auto rounded-lg shadow-lg border mb-6 bg-[#b19d60] shadow-gray-700 border-gray-900">
      <div className='flex gap-12'>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-start ">Teacher Information</h1>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-start">Filters</h2>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Region</label>
            <select
              name="region"
              value={filters.region}
              onChange={handleFilterChange}
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Regions</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium">District</label>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!filters.region}
            >
              <option value="">All Districts</option>
              {filters.region && DISTRICTS[filters.region]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Education Level</label>
            <select
              name="educationLevel"
              value={filters.educationLevel}
              onChange={handleFilterChange}
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Education Levels</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Teacher Type</label>
            <select
              name="teacherType"
              value={filters.teacherType}
              onChange={handleFilterChange}
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Teacher Types</option>
              {teacherType.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Year Joined</label>
            <input
              type="number"
              name="yearJoined"
              value={filters.yearJoined}
              onChange={handleFilterChange}
              placeholder="Enter Year 1960"
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Sex</label>
            <select
              name="sex"
              value={filters.sex}
              onChange={handleFilterChange}
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Sexes</option>
              {sexOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Native Level</label>
            <select
              name="nativeLevel"
              value={filters.nativeLevel}
              onChange={handleFilterChange}
              className="mt-1 block w-full border text-gray-800 bg-gray-200 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Native Levels</option>
              {nativeLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end mt-4">
            <button
              onClick={handleResetFilters}
              className="bg-red-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-red-700 transition duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

    

      {/* Teacher List in Table Format */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className=" ">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Mobile</th>
              <th className="border px-4 py-2 ">Region</th>
              <th className="border px-4 py-2 ">District</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeachers.map((teacher) => (
              <tr key={teacher._id} className=" ">
                <td className="border px-4 py-2 uppercase">{teacher.name}</td>
                <td className="border px-4 py-2">{teacher.mobile}</td>
                <td className="border px-4 py-2 uppercase">{teacher.region}</td>
                <td className="border px-4 py-2 uppercase">{teacher.district}</td>
                <td className="border px-4 py-2">{teacher.teacherType}</td>
                <td className="border px-4 py-2">
                  <Link to={`/teachers/${teacher._id}`} className=" text-center  px-3 py-2   transition">
                   
                    < FaEye size={22} color='blue' />
                     
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center my-4">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-3 py-2 mx-1 rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage * itemsPerPage >= filteredTeachers.length}
          className="bg-blue-500 text-white px-3 py-2 mx-1 rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TeachersInfo;
