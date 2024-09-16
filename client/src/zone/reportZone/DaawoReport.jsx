import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Constants
const REGIONS = ['Daawo' ];
const DISTRICTS = {
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
;
const teacherType = ['Kg', 'Primary', 'Secondary', 'Preparatory', 'University/Colleges'];

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
    <div className="p-6 rounded-lg shadow-lg border mb-6 bg-[#b19d60] shadow-gray-700 border-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <label className="block text-sm font-medium">Region</label>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="mt-1 block w-full border dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
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
        <div>
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
        <div>
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
    <div className="overflow-x-auto shadow-lg rounded-lg border shadow-[#b19d60] border-[#b19d60]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#b19d60] opacity-75">
          <tr>
            {['#', 'Name', 'Email', 'Mobile', 'Region', 'District', 'Subjects Learned', 'Subjects Teaching', 'Description', 'Sex', 'Native Status', 'Teacher Type', 'Joining Date', 'Details'].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {teachers.map((teacher, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{teacher.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.mobile}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.region}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.district}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.subjectsLearned}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.subjectsTeaching}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.sex}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.nativeStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.teacherType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(teacher.joiningDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onViewDetails(teacher)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// TeacherDetailsModal Component
const TeacherDetailsModal = ({ teacher, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 text-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>
        <div className="space-y-4">
          <p><strong>Name:</strong> {teacher.name}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Mobile:</strong> {teacher.mobile}</p>
          <p><strong>City:</strong> {teacher.city}</p>
          <p><strong>Address:</strong> {teacher.address}</p>
          <p><strong>Region:</strong> {teacher.region}</p>
          <p><strong>District:</strong> {teacher.district}</p>
          <p><strong>Subjects Learned:</strong> {teacher.subjectsLearned}</p>
          <p><strong>Subjects Teaching:</strong> {teacher.subjectsTeaching}</p>
          <p><strong>Description:</strong> {teacher.description}</p>
          <p><strong>Sex:</strong> {teacher.sex}</p>
          <p><strong>Native Status:</strong> {teacher.nativeStatus}</p>
          <p><strong>Teacher Type:</strong> {teacher.teacherType}</p>
          <p><strong>Joining Date:</strong> {new Date(teacher.joiningDate).toLocaleDateString()}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
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
  const [filters, setFilters] = useState({ name: '', subject: '', region: 'Daawo', district: '', teacherType: '', yearJoined: '', sex: '', nativeStatus: '' });
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
          setTeachers(response.data);
          setFilteredTeachers(response.data.filter(teacher => teacher.region === 'Daawo')); // Filter to only Daawo region
        } else {
          setError('Data format error');
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
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
        (filters.nativeStatus ? teacher.nativeStatus === filters.nativeStatus : true)
      );
    });
    setFilteredTeachers(filtered);
    setPage(1); // Reset page on filter change
  }, [filters, teachers]);

  const totalTeachers = filteredTeachers.length;

  const counts = filteredTeachers.reduce((acc, teacher) => {
    acc.sex[teacher.sex] = (acc.sex[teacher.sex] || 0) + 1;
    acc.nativeStatus[teacher.nativeStatus] = (acc.nativeStatus[teacher.nativeStatus] || 0) + 1;
    return acc;
  }, { sex: {}, nativeStatus: {} });

  const paginatedTeachers = filteredTeachers.slice((page - 1) * pageSize, page * pageSize);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ name: '', subject: '', region: 'Daawo', district: '', teacherType: '', yearJoined: '', sex: '', nativeStatus: '' });
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseDetails = () => {
    setSelectedTeacher(null);
  };

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredTeachers);
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
    XLSX.writeFile(wb, 'teachers.xlsx');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Filters filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
      <button
        onClick={handleExportToExcel}
        className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 mb-6"
      >
        Export to Excel
      </button>
      <div className="mb-6">
        <div>
          <span className="text-lg font-medium  ">Total Teachers: {totalTeachers}</span>
          <span className="text-sm   ml-4">Male: {counts.sex.Male || 0}</span>
          <span className="text-sm   ml-4">Female: {counts.sex.Female || 0}</span>
          <span className="text-sm   ml-4">Native: {counts.nativeStatus.Native || 0}</span>
          <span className="text-sm   ml-4">Non-native: {counts.nativeStatus['Non-native'] || 0}</span>
        </div>
      </div>
      <TeacherList teachers={paginatedTeachers} onViewDetails={handleViewDetails} />
      {selectedTeacher && <TeacherDetailsModal teacher={selectedTeacher} onClose={handleCloseDetails} />}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page => Math.max(page - 1, 1))}
          disabled={page === 1}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
        >
          Previous
        </button>
        <span className="mx-4 text-lg">
          Page {page} of {Math.ceil(filteredTeachers.length / pageSize)}
        </span>
        <button
          onClick={() => setPage(page => Math.min(page + 1, Math.ceil(filteredTeachers.length / pageSize)))}
          disabled={page === Math.ceil(filteredTeachers.length / pageSize)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
