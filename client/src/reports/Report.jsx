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
  const nativeStatusOptions = ['Native', 'Non-native'];

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

  const teacherType = ['Kg','primary', 'secondary', 'preparatory' , 'university/colleges']
  const educationLevels = ['High School', 'Master\'s Degree', 'Doctorate'];

  // filtered
  // Filters Component
  const Filters = ({ filters, onFilterChange, onResetFilters }) => {
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      onFilterChange({ ...filters, [name]: value });
    };

    const handleResetFilters = () => {
      onResetFilters();
    };

    return (
      <div className="  p-6 rounded-lg shadow-lg border   mb-6 bg-[#b19d60] shadow-gray-700 border-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ">
          <div>
            <label className="block text-sm font-medium ">Region</label>
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
          <div>
            <label className="block text-sm font-medium ">District</label>
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
          <div>
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

          <div>
            <label className="block text-sm font-medium ">Teacher Type</label>
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
          <div>
            <label className="block text-sm font-medium ">Year Joined</label>
            <input
              type="number"
              name="yearJoined"
              value={filters.yearJoined}
              onChange={handleFilterChange}
              placeholder="Enter Year 1960"
              className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end space-x-4">
            <button
              onClick={handleResetFilters}
              className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    );
  };
 
  // TeacherList Component
  const TeacherList = ({ teachers, onViewDetails }) => {
    return (
      <div className="overflow-x-auto e shadow-lg rounded-lg border  shadow-[#b19d60] border-[#b19d60] ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className=" bg-[#b19d60]  opacity-75">
            <tr>
              {['#', 'Name', 'Email', 'Mobile', 'Region', 'District', 'Birth Date', 'Subjects Learned', 'Subjects Teaching', 'Description', 'Sex', 'Native Status', 'Teacher Type', 'Level', 'salary','experience',  'Age', 'Retirement Status', 'Years to Retirement', 'Joining Date',  ].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium  text-white dark:border-gray-900 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" e divide-y divide-gray-200">
            {teachers.map((teacher, index) => (
              <tr key={index} className="">
                <td className="px-6 py-4 whitespace-nowrap text-sm ">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(teacher)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                <td className="px-6 py-4 whitespace-nowrap text-[14px]  font-semibold">{teacher.name}</td>

                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.region}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.district}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{new Date(teacher.birthDate).getFullYear()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.subjectsLearned}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.subjectsTech}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.sex}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.nativeStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.teacherType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.educationLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.salary}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.experience}</td> {/* Display experience */}
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.isRetired ? 'Retired' : 'Active'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{teacher.isRetired ? 'N/A' : teacher.yearsToRetirement}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  ">{new Date(teacher.joiningDate).getFullYear()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // TeacherDetailsModal Component
  import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBookOpen, FaUser } from 'react-icons/fa';

  const TeacherDetailsModal = ({ teacher, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <img
              src={teacher.photoUrl || 'default-photo-url.jpg'}
              alt={teacher.name}
              className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 shadow-md"
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800">{teacher.name}</h2>
              <span className="flex items-center text-gray-600">
                <FaEnvelope className="mr-1" /> {teacher.email}
              </span>
              <span className="flex items-center text-gray-600">
                <FaPhone className="mr-1" /> {teacher.mobile}
              </span>
              <span className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-1" /> {teacher.region}, {teacher.district}
              </span>
            </div>
          </div>
  
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Subjects</h3>
          <p className="text-gray-600 flex items-center">
            <FaBookOpen className="mr-1" /> {teacher.subjectsLearned.join(', ')}
          </p>
  
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Details</h3>
          <p className="text-gray-600 flex items-center">
            <FaUser className="mr-1" /> Age: {teacher.age}
          </p>
          <p className="text-gray-600">Description: {teacher.description}</p>
          <p className="text-gray-600">
            Retirement Status: {teacher.isRetired ? 'Retired' : 'Active'}
          </p>
  
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Close
            </button>
          </div>
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
                experience: currentYear - new Date(teacher.joiningDate).getFullYear(),

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
          // (filters.educationLevel ? teacher.educationLevel === filters.educationLevel : true) // New line
          (filters.yearJoined ? joiningYear === parseInt(filters.yearJoined, 10) : true) &&
          (filters.name ? teacher.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
          (filters.subject ? teacher.subjectsLearned.toLowerCase().includes(filters.subject.toLowerCase()) : true) &&
          (filters.sex ? teacher.sex === filters.sex : true) &&
          (filters.nativeStatus ? teacher.nativeStatus === filters.nativeStatus : true) &&
          (filters.educationLevel ? teacher.educationLevel === filters.educationLevel : true) // New line

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
      setFilters({ name: '', subject: '', region: '', district: '', teacherType: '', yearJoined: '', sex: '', nativeStatus: '', educationLevel: '',});
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
        nativeStatus: { 'Native': 0, 'Non-native': 0 },
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
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
      >
        Export to Excel
      </button>
      <div>
        <span className="text-lg font-medium">Total Teachers: {totalTeachers}</span>
        <span className="text-sm ml-4">Active: {retirementCounts.active}</span>
        <span className="text-sm ml-4">Retired: {retirementCounts.retired}</span>
        <span className="text-sm ml-4">Male: {counts.sex.Male || 0}</span>
        <span className="text-sm ml-4">Female: {counts.sex.Female || 0}</span>
        <span className="text-sm ml-4">Native: {counts.nativeStatus.Native || 0}</span>
        <span className="text-sm ml-4">Non-native: {counts.nativeStatus['Non-native'] || 0}</span>
      </div>
    </div>
    <TeacherList teachers={paginatedTeachers} onViewDetails={handleViewDetails} />
    {selectedTeacher && (
      <TeacherDetailsModal teacher={selectedTeacher} onClose={handleCloseModal} />
    )}
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400"
      >
        Previous
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page * pageSize >= filteredTeachers.length}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400"
      >
        Next
      </button>
    </div>
  </div>
    );
  };

  export default App;
