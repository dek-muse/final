// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Constants for regions and districts
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

const Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const response = await axios.get('https://finalbakend.vercel.app/'); // Replace with your API endpoint
        if (Array.isArray(response.data)) {
          setTeachers(response.data);
          setFilteredTeachers(response.data); // Initialize filtered list
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
    const filterByRegionAndDistrict = () => {
      return teachers.filter(teacher => 
        (!selectedRegion || teacher.region === selectedRegion) &&
        (!selectedDistrict || teacher.district === selectedDistrict)
      );
    };

    setFilteredTeachers(filterByRegionAndDistrict());
  }, [selectedRegion, selectedDistrict, teachers]);

  const getCounts = () => {
    const counts = {
      sex: { Male: 0, Female: 0 },
      nativeStatus: { Native: 0, 'Non-native': 0 },
    };
    filteredTeachers.forEach(teacher => {
      if (teacher.sex) counts.sex[teacher.sex] = (counts.sex[teacher.sex] || 0) + 1;
      if (teacher.nativeStatus) counts.nativeStatus[teacher.nativeStatus] = (counts.nativeStatus[teacher.nativeStatus] || 0) + 1;
    });
    return counts;
  };

  const totalTeachers = filteredTeachers.length;
  const counts = getCounts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 mb-6">
        <h2 className="text-xl font-semibold mb-4">Teacher Statistics</h2>

        {/* Region Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Select Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedDistrict(''); // Reset district when region changes
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Regions</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Select District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
            disabled={!selectedRegion}
          >
            <option value="">All Districts</option>
            {selectedRegion && DISTRICTS[selectedRegion]?.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-900"><strong>Total Teachers:</strong> {totalTeachers}</p>
          <div>
            <span className="text-sm text-gray-600 mr-4">Male: {counts.sex.Male || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Female: {counts.sex.Female || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Native: {counts.nativeStatus.Native || 0}</span>
            <span className="text-sm text-gray-600">Non-native: {counts.nativeStatus['Non-native'] || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
