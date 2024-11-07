/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Constants
const subjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'English' },
  { id: 4, name: 'History' },
  // Add more subjects as needed
];

const sexOptions = ['Male', 'Female'];
const nativeStatusOptions = ['Region', 'Non-region'];
const healthStatusOptions = ['No', 'Yes'];
const specialNeedOptions = ['Hearing Impairment',
  'Vision Impairment',
  'Physical Disability',
  'Learning Disability',
  'Other'];


const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];
const DISTRICTS = {
  'Afdheer': ['Hargeelle', 'Dhaawac', 'Baarey', 'limey galbeed', 'Raaso', 'Dollow Bay', 'Ceelkari', 'Qooxle', 'Godgod'],
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

const teacherType = ['Primary', 'Preprimary', 'Secondary', 'College', 'Boarding']
const educationLevels = ['TTI', 'DIP', 'Deg', 'MA'];
const transferOptions = ['Yes', 'No'];

const subjectsLearnedOptions = ['Math', 'Science', 'History', 'Language Arts'];
const subjectsTechOptions = ['Math', 'Science', 'History', 'Language Arts'];



// filtered
// Filters Component
const Filters = ({ filters, onFilterChange, onResetFilters }) => {
  const [showFilters, setShowFilters] = useState(false); // Toggle filter section visibility
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    onResetFilters();
  };

  return (
    <div className="p-6 max-w-[2200px] mx-auto  mb-6   border-gray-900">
      <div className='flex justify-between'>
        <h2
          className="text-2xl flex items-center gap-4 font-bold mb-6 text-gray-800 text-start"
        >
          < FaUserCheck />
          Teacher report</h2>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className=" flex items-center gap-4 font-bold mb-6 text-gray-800 text-start bg-gray-600 text-white px-4 py-2 rounded-md shadow-md mb-4"
        >
          < FaFilter />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

      </div>

      <div className="container mx-auto p-6">


        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-medium">Region</label>
              <select
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium">Health Status</label>
              <select
                name="healthStatus"
                value={filters.healthStatus}
                onChange={handleFilterChange}
                className="mt-1 block w-full border  dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" className=' '>All Health Status</option>
                {healthStatusOptions.map(status => (

                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium">Special Needs</label>
              <select
                name="specialNeed"
                value={filters.specialNeed}
                onChange={handleFilterChange}
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Special Needs</option>
                {specialNeedOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {/* Subjects Learned Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium">Subjects Learned</label>
              <select
                name="subjectsLearned"
                value={filters.subjectsLearned}
                onChange={handleFilterChange}
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Subjects Learned</option>
                {subjectsLearnedOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Subjects Teaching Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium">Subjects Teaching</label>
              <select
                name="subjectsTech"
                value={filters.subjectsTech}
                onChange={handleFilterChange}
                className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Subjects Teaching</option>
                {subjectsTechOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>




            <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end mt-4">
              <button
                onClick={handleResetFilters}
                className="bg-red-600 flex gap-4 text-white px-6 py-2 rounded-md shadow-sm hover:bg-red-700 transition duration-200"
              >
                < MdRestore size={24} />
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Rest of the component */}
      </div>



    </div>

  );
};

// TeacherList Component
const TeacherList = ({ teachers, onViewDetails }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border shadow-[#b19d60] border-[#b19d60]">
  <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-gray-100 via-gray-200 to-white">
    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90 shadow-md text-white">
      <tr>
        {['#', 'Name', 'Email', 'Mobile', 'Region', 'District', 'Birth Date', 'Subjects Learned', 'Subjects Teaching', 'Sex', 'Native Status', 'Teacher Type', 'Level', 'Salary', 'Experience', 'Age', 'Retirement Status', 'Years to Retirement', 'Joining Date', 'Health Status', 'Special Need'].map((header) => (
          <th key={header} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-white min-w-[100px]">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white">
      {teachers.map((teacher, index) => (
        <tr key={index} className="transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-700 border-b border-gray-300">
          <td className="px-4 py-2 text-sm font-medium leading-tight">{index + 1}</td>
          <td className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 min-w-[250px] leading-tight">
            <button onClick={() => onViewDetails(teacher)} className="uppercase">{teacher.name}</button>
          </td>
          <td className="px-4 py-2 text-sm min-w-[200px] text-gray-600 leading-tight">{teacher.email}</td>
          <td className="px-4 py-2 text-sm min-w-[130px] text-gray-600 leading-tight">{teacher.mobile}</td>
          <td className="px-4 py-2 text-sm min-w-[100px] text-gray-700 uppercase leading-tight">{teacher.region}</td>
          <td className="px-4 py-2 text-sm min-w-[100px] text-gray-700 uppercase leading-tight">{teacher.district}</td>
          <td className="px-4 py-2 text-sm min-w-[110px] text-gray-700 leading-tight">{new Date(teacher.birthDate).getFullYear()}</td>
          <td className="px-4 py-2 text-sm min-w-[150px] text-gray-700 leading-tight">{teacher.subjectsLearned}</td>
          <td className="px-4 py-2 text-sm min-w-[150px] text-gray-700 leading-tight">{teacher.subjectsTech}</td>
          <td className="px-4 py-2 text-sm min-w-[70px] text-gray-700 leading-tight">{teacher.sex}</td>
          <td className="px-4 py-2 text-sm min-w-[120px] text-gray-700 leading-tight">{teacher.nativeStatus}</td>
          <td className="px-4 py-2 text-sm font-semibold min-w-[130px] uppercase text-gray-800 leading-tight">{teacher.teacherType}</td>
          <td className="px-4 py-2 text-sm min-w-[110px] text-gray-700 leading-tight">{teacher.educationLevel}</td>
          <td className="px-4 py-2 text-sm min-w-[100px] text-gray-700 leading-tight">{teacher.salary}</td>
          <td className="px-4 py-2 text-sm min-w-[110px] text-gray-700 leading-tight">{teacher.experience}</td>
          <td className="px-4 py-2 text-sm min-w-[80px] text-gray-700 leading-tight">{teacher.age}</td>
          <td className="px-4 py-2 text-sm min-w-[150px] text-gray-700 leading-tight">{teacher.isRetired ? 'Retired' : 'Active'}</td>
          <td className="px-4 py-2 text-sm min-w-[150px] text-gray-700 leading-tight">{teacher.isRetired ? '0' : teacher.yearsToRetirement}</td>
          <td className="px-4 py-2 text-sm min-w-[120px] text-gray-700 leading-tight">{new Date(teacher.joiningDate).getFullYear()}</td>
          <td className="px-4 py-2 text-sm min-w-[130px] text-gray-700 leading-tight">{teacher.healthStatus}</td>
          <td className="px-4 py-2 text-sm min-w-[130px] text-gray-700 leading-tight">{teacher.specialNeed}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


  );
};

// TeacherDetailsModal Component
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBookOpen, FaUser, FaFilter } from 'react-icons/fa';
import { FaFileExport, FaUserCheck } from 'react-icons/fa6';
import { MdRestore } from 'react-icons/md';

const TeacherDetailsModal = ({ teacher, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col items-center p-4"
      style={{ width: '3.375in', height: '2.125in' }}
    >
      {/* Header Section: Profile Picture and Basic Info */}
      <div className="flex items-center mb-2 w-full justify-center">
        <img
          src={teacher.photoUrl || 'default-photo-url.jpg'}
          alt={teacher.name}
          className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md"
        />
        <div className="flex flex-col ml-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white uppercase">{teacher.name}</h2>
          <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
            <FaEnvelope className="mr-1 text-blue-500" /> {teacher.email}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
            <FaPhone className="mr-1 text-blue-500" /> {teacher.mobile}
          </span>
        </div>
      </div>
  
      {/* Location Information */}
      <div className="text-center text-xs mb-2">
        <span className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
          <FaMapMarkerAlt className="mr-1 text-blue-500" /> {teacher.region}, {teacher.district}
        </span>
      </div>
  
      {/* Additional Details */}
      <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-col items-center border-t border-gray-300 dark:border-gray-700 w-full pt-2 mt-2">
        <p className="flex items-center mb-1">
          <FaUser className="mr-1 text-blue-500" /> Age: {teacher.age}
        </p>
        <p className="mb-1">Description: {teacher.description}</p>
        <p className="mb-1">Status: {teacher.isRetired ? 'Retired' : 'Active'}</p>
      </div>
  
      {/* Subjects Section */}
      <div className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 w-full pt-2 mt-2 text-center">
        <span className="flex items-center justify-center">
          <FaBookOpen className="mr-1 text-blue-500" /> Subjects: {teacher.subjectsLearned.join(', ')}
        </span>
      </div>
  
      {/* Close Button */}
      <button
        onClick={onClose}
        className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md hover:bg-blue-700 transition duration-200 mt-4"
      >
        Close
      </button>
    </div>
  </div>
  


  );
};


// App Component
const App = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filters, setFilters] = useState({ name: '', subject: '', region: '', district: '', teacherType: '', yearJoined: '', sex: '', nativeStatus: '', educationLevel: '', });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const response = await axios.get('https://finalbakend.vercel.app/');
        if (Array.isArray(response.data)) {
          const currentYear = new Date().getFullYear();
          const currentDate = new Date();

          const teachersWithDetails = response.data.map(teacher => {
            const birthDate = new Date(teacher.birthDate);
            const age = currentYear - birthDate.getFullYear();
            const isRetired = age >= 60;
            const yearsToRetirement = isRetired ? 0 : 60 - age;

            return {
              ...teacher,
              // experience: currentYear - new Date(teacher.joiningDate).getFullYear(),

              age,
              isRetired,
              yearsToRetirement,
            };
          });

          setTeachers(teachersWithDetails);
          setFilteredTeachers(teachersWithDetails);
        }
      } catch (err) {
        // console.error('Failed to fetch data', err);
      }
    };

    fetchTeachersData();
  }, []);


  useEffect(() => {
    const filtered = teachers.filter(teacher => {
      const joiningYear = new Date(teacher.joiningDate).getFullYear();
      return (
        (filters.region ? teacher.region === filters.region : true) &&
        (filters.district ? teacher.district === filters.district : true) &&
        (filters.teacherType ? teacher.teacherType === filters.teacherType : true) &&
        (filters.yearJoined ? joiningYear === parseInt(filters.yearJoined, 10) : true) &&
        (filters.name ? teacher.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
        (filters.subject ? teacher.subjectsLearned.toLowerCase().includes(filters.subject.toLowerCase()) : true) &&
        (filters.sex ? teacher.sex === filters.sex : true) &&
        (filters.nativeStatus ? teacher.nativeStatus === filters.nativeStatus : true) &&
        (filters.educationLevel ? teacher.educationLevel === filters.educationLevel : true) &&
        (filters.experience ? teacher.experience >= parseInt(filters.experience, 10) : true) &&
        (filters.isRetired ? (filters.isRetired === "true" ? teacher.isRetired : !teacher.isRetired) : true) &&
        (filters.transfer ? teacher.transfer === filters.transfer : true) && // Add this line
        (filters.healthStatus ? teacher.healthStatus === filters.healthStatus : true) &&
        (filters.specialNeed ? teacher.specialNeed === filters.specialNeed : true) && // Add this line
        (filters.subjectsLearned ? teacher.subjectsLearned.includes(filters.subjectsLearned) : true) && // Filter by subjects learned
        (filters.subjectsTech ? teacher.subjectsTech.includes(filters.subjectsTech) : true) // Filter by subjects teaching
        //

      );
    });
    setFilteredTeachers(filtered);
    setPage(1); // Reset page on filter change
  }, [filters, teachers]);


  const paginatedTeachers = filteredTeachers.slice((page - 1) * pageSize, page * pageSize);
  const handleFilterChange = (newFilters) => {
    if (newFilters.region !== filters.region) {
      newFilters.district = ''; // Reset district when region changes
    }
    setFilters(newFilters);
  };


  const handleResetFilters = () => {
    setFilters({
      name: '',
      subject: '',
      region: '',
      district: '',
      teacherType: '',
      yearJoined: '',
      sex: '',
      nativeStatus: '',
      educationLevel: '',
      transfer: '', // Add this line
      healthStatus: '',
      specialNeed: '', // Filter cusub
      subjectsLearned: '',  // Add this line
      subjectsTech: '',     // Add this line
    });
    setPage(1);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(paginatedTeachers.map(teacher => ({
      Name: teacher.name,
      Email: teacher.email,
      Mobile: teacher.mobile,
      City: teacher.city,
      Address: teacher.address,
      Region: teacher.region,
      District: teacher.district,
      BirthDate: new Date(teacher.birthDate).getFullYear(),
      SubjectsLearned: teacher.subjectsLearned,
      subjectsTech: teacher.subjectsTech,
      Description: teacher.description,
      Sex: teacher.sex,
      NativeStatus: teacher.nativeStatus,
      TeacherType: teacher.teacherType,
      Level: teacher.educationLevel,
      salary: teacher.salary,
      Age: teacher.age,
      isRetire: teacher.isRetire,
      yearsToRetirement: teacher.yearsToRetirement,
      JoiningDate: new Date(teacher.joiningDate).getFullYear(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
    XLSX.writeFile(wb, 'TeachersList.xlsx');
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
  };

  // Calculate dynamic counts based on filteredTeachers
  const getCounts = () => {
    const counts = {
      sex: { Male: 0, Female: 0 },
      nativeStatus: { 'Region': 0, 'Non-region': 0 },

    };
    filteredTeachers.forEach(teacher => {
      counts.sex[teacher.sex] = (counts.sex[teacher.sex] || 0) + 1;
      counts.nativeStatus[teacher.nativeStatus] = (counts.nativeStatus[teacher.nativeStatus] || 0) + 1;
    });
    return counts;
  };
  const getRetirementCounts = () => {
    const counts = { active: 0, retired: 0 };
    filteredTeachers.forEach(teacher => {
      if (teacher.isRetired) {
        counts.retired += 1;
      } else {
        counts.active += 1;
      }
    });
    return counts;
  };

  const retirementCounts = getRetirementCounts();


  const totalTeachers = filteredTeachers.length;
  const counts = getCounts();

  return (
    <div className="container mx-auto p-6">
      <Filters filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <button
          onClick={handleExport}
          className="bg-blue-600 flex gap-2 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-200 mb-2 md:mb-0"
        >
          < FaFileExport size={20} />
          Export to Excel
        </button>

        <div className="flex flex-col md:flex-row md:space-x-4 -mt-7">
          <div className="flex flex-col md:flex-row md:space-x-4 mt-6">
            <div className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200">
              <div className="font-medium text-xs sm:text-[14px]">Total Teachers:</div>
              <div className="font-semibold text-lg sm:text-[18px]">{totalTeachers}</div>
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-4 md:mb-0"> </div>

            <div className="flex flex-wrap space-x-4 mt-2">
              {/* Active Teachers Card */}
              <div className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200">
                <div className="font-medium text-xs sm:text-sm">Active</div>
                <div className="font-semibold text-lg sm:text-xl">{retirementCounts.active}</div>
              </div>

              {/* Retired Teachers Card */}
              <div className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-200">
                <div className="font-medium text-xs sm:text-sm">Retired</div>
                <div className="font-semibold text-lg sm:text-xl">{retirementCounts.retired}</div>
              </div>

              {/* Male Teachers Card */}
              <div className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                <div className="font-medium text-xs sm:text-sm">Male</div>
                <div className="font-semibold text-lg sm:text-xl">{counts.sex.Male || 0}</div>
              </div>

              {/* Female Teachers Card */}
              <div className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-200">
                <div className="font-medium text-xs sm:text-sm">Female</div>
                <div className="font-semibold text-lg sm:text-xl">{counts.sex.Female || 0}</div>
              </div>

              {/* Region Teachers Card */}
              <div className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition duration-200">
                <div className="font-medium text-xs sm:text-sm">Region</div>
                <div className="font-semibold text-lg sm:text-xl">{counts.nativeStatus.Region || 0}</div>
              </div>

              {/* Non-region Teachers Card */}
              <div className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200">
                <div className="font-medium text-xs sm:text-[14px]">Non-region</div>
                <div className="font-semibold text-lg sm:text-[18px]">{counts.nativeStatus['Non-region'] || 0}</div>
              </div>
            </div>
          </div>

        </div>
      </div>


      <TeacherList teachers={paginatedTeachers} onViewDetails={handleViewDetails} />

      {selectedTeacher && (
        <TeacherDetailsModal teacher={selectedTeacher} onClose={handleCloseModal} />
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 transition duration-200 mb-2 md:mb-0"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * pageSize >= filteredTeachers.length}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>

  );
};

export default App;
