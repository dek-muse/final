import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker

// Helper function to get week number of the year
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Pie Chart Component
const PieChartComponent = ({ data, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

// Line Chart Component
const LineChartComponent = ({ data, title }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];
const DISTRICTS = {
  'Afdheer': ['Hargeelle', 'Dhaawac', 'Baarey', 'limey galbeed', 'Raaso', 'Dollow Bay', 'Ceelkari', 'Qooxle', 'Godgod'],
  // ... other regions and their districts
};

// Dashboard Component
const Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTeacherType, setSelectedTeacherType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for chart data
  const [dailyChartData, setDailyChartData] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Pie'); // State for selected chart

  // States for date range filtering
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const response = await axios.get('https://finalbakend.vercel.app/'); // Replace with your API endpoint
        if (Array.isArray(response.data)) {
          setTeachers(response.data);
          setFilteredTeachers(response.data); // Initialize filtered list

          // Process data for charts
          const filteredData = response.data;

          // Filter by date range
          const filterByDateRange = (data) => {
            if (!startDate || !endDate) return data;
            return data.filter(teacher => {
              const date = new Date(teacher.createdAt);
              return date >= new Date(startDate) && date <= new Date(endDate);
            });
          };

          const dateFilteredData = filterByDateRange(filteredData);

          // Daily Counts
          const dailyCounts = dateFilteredData.reduce((acc, teacher) => {
            const date = new Date(teacher.createdAt);
            if (isNaN(date.getTime())) {
              console.error('Invalid date:', teacher.createdAt);
              return acc;
            }
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
            if (!acc[formattedDate]) {
              acc[formattedDate] = 0;
            }
            acc[formattedDate]++;
            return acc;
          }, {});

          // Weekly Counts
          const weeklyCounts = dateFilteredData.reduce((acc, teacher) => {
            const date = new Date(teacher.createdAt);
            if (isNaN(date.getTime())) {
              console.error('Invalid date:', teacher.createdAt);
              return acc;
            }
            const weekNumber = getWeekNumber(date);
            if (!acc[weekNumber]) {
              acc[weekNumber] = 0;
            }
            acc[weekNumber]++;
            return acc;
          }, {});

          // Monthly Counts
          const monthlyCounts = dateFilteredData.reduce((acc, teacher) => {
            const date = new Date(teacher.createdAt);
            if (isNaN(date.getTime())) {
              console.error('Invalid date:', teacher.createdAt);
              return acc;
            }
            const month = date.toISOString().split('-')[1]; // MM
            if (!acc[month]) {
              acc[month] = 0;
            }
            acc[month]++;
            return acc;
          }, {});

          // Yearly Counts
          const yearlyCounts = dateFilteredData.reduce((acc, teacher) => {
            const date = new Date(teacher.createdAt);
            if (isNaN(date.getTime())) {
              console.error('Invalid date:', teacher.createdAt);
              return acc;
            }
            const year = date.getFullYear().toString();
            if (!acc[year]) {
              acc[year] = 0;
            }
            acc[year]++;
            return acc;
          }, {});

          // Set chart data
          setDailyChartData(
            Object.keys(dailyCounts).map(date => ({ name: date, value: dailyCounts[date] }))
          );
          setWeeklyChartData(
            Object.keys(weeklyCounts).map(week => ({ name: `Week ${week}`, value: weeklyCounts[week] }))
          );
          setMonthlyChartData(
            Object.keys(monthlyCounts).map(month => ({ name: month, value: monthlyCounts[month] }))
          );
          setYearlyChartData(
            Object.keys(yearlyCounts).map(year => ({ name: year, value: yearlyCounts[year] }))
          );

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
  }, [startDate, endDate]); // Dependency array includes date range to re-fetch data on change

  useEffect(() => {
    const filterByRegionAndDistrict = () => {
      return teachers.filter(teacher => 
        (!selectedRegion || teacher.region === selectedRegion) &&
        (!selectedDistrict || teacher.district === selectedDistrict) &&
        (!selectedTeacherType || teacher.teacherType === selectedTeacherType) &&
        (!searchTerm || teacher.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    };

    setFilteredTeachers(filterByRegionAndDistrict());
  }, [selectedRegion, selectedDistrict, selectedTeacherType, searchTerm, teachers]);

  const getCounts = () => {
    const counts = {
      sex: { Male: 0, Female: 0 },
      nativeStatus: { Native: 0, 'Non-native': 0 },
      teacherType: { Kg: 0, Primary: 0, Secondary: 0, Preparatory: 0, 'University/Colleges': 0 }
    };
    filteredTeachers.forEach(teacher => {
      if (teacher.sex) counts.sex[teacher.sex] = (counts.sex[teacher.sex] || 0) + 1;
      if (teacher.nativeStatus) counts.nativeStatus[teacher.nativeStatus] = (counts.nativeStatus[teacher.nativeStatus] || 0) + 1;
      if (teacher.teacherType) counts.teacherType[teacher.teacherType] = (counts.teacherType[teacher.teacherType] || 0) + 1;
    });
    return counts;
  };

  const counts = getCounts();
  const totalTeachers = filteredTeachers.length;

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Select Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Regions</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900"
              disabled={!selectedRegion}
            >
              <option value="">All Districts</option>
              {selectedRegion && DISTRICTS[selectedRegion]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Select Teacher Type</label>
            <select
              value={selectedTeacherType}
              onChange={(e) => setSelectedTeacherType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900"
            >
              <option value="">All Teacher Types</option>
              <option value="Kg">Kg</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Preparatory">Preparatory</option>
              <option value="University/Colleges">University/Colleges</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Search by Name</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="mb-6 mt-6">
          <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200">Select Chart Type:</label>
          <select
            value={selectedChart}
            onChange={e => setSelectedChart(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pie">Pie Chart</option>
            <option value="Daily">Daily Joining Data</option>
            <option value="Weekly">Weekly Joining Data</option>
            <option value="Monthly">Monthly Joining Data</option>
            <option value="Yearly">Yearly Joining Data</option>
          </select>
        </div>

        {/* Chart Rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6">
          {selectedChart === 'Pie' && (
            <PieChartComponent
              data={[
                { name: 'Male', value: counts.sex.Male || 0 },
                { name: 'Female', value: counts.sex.Female || 0 }
              ]}
              colors={['#0088FE', '#00C49F']}
            />
          )}
          {selectedChart === 'Daily' && (
            <LineChartComponent data={dailyChartData} title="Daily Joining Data" />
          )}
          {selectedChart === 'Weekly' && (
            <LineChartComponent data={weeklyChartData} title="Weekly Joining Data" />
          )}
          {selectedChart === 'Monthly' && (
            <LineChartComponent data={monthlyChartData} title="Monthly Joining Data" />
          )}
          {selectedChart === 'Yearly' && (
            <LineChartComponent data={yearlyChartData} title="Yearly Joining Data" />
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
          <p className="text-lg font-medium text-gray-900"><strong>Total Teachers:</strong> {totalTeachers}</p>
          <div className="mt-2">
            <span className="text-sm text-gray-600 mr-4">Male: {counts.sex.Male || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Female: {counts.sex.Female || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Native: {counts.nativeStatus.Native || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Non-native: {counts.nativeStatus['Non-native'] || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Kg: {counts.teacherType.Kg || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Primary: {counts.teacherType.Primary || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Secondary: {counts.teacherType.Secondary || 0}</span>
            <span className="text-sm text-gray-600 mr-4">Preparatory: {counts.teacherType.Preparatory || 0}</span>
            <span className="text-sm text-gray-600">University/Colleges: {counts.teacherType['University/Colleges'] || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
