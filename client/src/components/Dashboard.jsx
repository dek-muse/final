import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker

// Helper function to get week number of the year
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Line Chart Component
const LineChartComponent = ({ data, title }) => (
  <div className=" p-6 rounded-lg shadow-md border border-gray-300">
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for chart data
  const [dailyChartData, setDailyChartData] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Daily'); // Default chart type

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
        (!selectedTeacherType || teacher.teacherType === selectedTeacherType)
      );
    };

    setFilteredTeachers(filterByRegionAndDistrict());
  }, [selectedRegion, selectedDistrict, selectedTeacherType, teachers]);

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

  if (loading) return <div className=" ">
  
  
  <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
        
      </div>
    </div>



  </div>;
  if (error) return <div className="text-center text-red-600">{error}
  
  
  
  
  <div className="flex items-center justify-center w-[30em] h-[30em]">
      <div className="flex flex-col items-center justify-center mt-[5em] relative">
        <div className="w-[5em] h-[5em] rounded-full border-2 border-black bg-[#f27405] mb-[-6em] relative z-[-1]">
          <div className="absolute bg-transparent w-[50px] h-[56px] ml-[1.68em] rounded-full transform rotate-[140deg] border-4 border-transparent shadow-[inset_0px_16px_#a85103,inset_0px_16px_1px_1px_#a85103]" />
          <div className="absolute mt-[-9.4em] ml-[0.4em] rotate-[-25deg] w-[1em] h-[0.5em] rounded-full bg-[#f69e50]" />
          <div className="absolute mt-[0.2em] ml-[1.25em] rotate-[-20deg] w-[1.5em] h-[0.8em] rounded-full bg-[#f69e50]" />
        </div>
        <div className="w-[17em] h-[9em] mt-[3em] rounded-[15px] bg-[#d36604] flex justify-center border-2 border-[#1d0e01] shadow-[inset_0.2em_0.2em_#e69635] relative">
          <div className="absolute w-[17em] h-[9em] rounded-[15px] bg-[repeating-radial-gradient(#d36604_0_0.0001%,#00000070_0_0.0002%)] bg-[repeating-conic-gradient(#d36604_0_0.0001%,#00000070_0_0.0002%)] opacity-[0.09]" />
          <div className="flex items-center justify-center rounded-[15px] shadow-[3.5px_3.5px_0px_#e69635]">
            <div className="w-auto h-auto rounded-[10px]">
              <div className="w-[11em] h-[7.75em] flex items-center justify-center rounded-[10px]">
                <div className="w-[13em] h-[7.85em] border-2 border-[#1d0e01] bg-[repeating-radial-gradient(#000_0_0.0001%,#ffffff_0_0.0002%)] bg-[repeating-conic-gradient(#000_0_0.0001%,#ffffff_0_0.0002%)] bg-blend-difference animate-[b_0.2s_infinite_alternate] rounded-[10px] flex items-center justify-center font-bold text-[#252525] tracking-widest text-center">
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
    </div>
    </div>;

  return (
    <div className="p-6">
      {/* Summary Section */}
      <div className="mb-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div className="p-4 rounded-lg bg-white shadow-md">
    <h3 className="text-[14px] font-semibold text-gray-800 mb-2">Total Teachers</h3>
    <p className="text-gray-700 text-xl font-bold">{totalTeachers}</p>
  </div>

  <div className="p-4 rounded-lg bg-white shadow-md">
    <h3 className="text-[14px] font-semibold text-gray-800 mb-2">Gender Breakdown</h3>
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Male</span>
        <span className="text-gray-700 text-xl font-bold">{counts.sex.Male || 0}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Female</span>
        <span className="text-gray-700 text-xl font-bold">{counts.sex.Female || 0}</span>
      </div>
    </div>
  </div>

  <div className="p-4 rounded-lg bg-white shadow-md">
    <h3 className="text-[14px] font-semibold text-gray-800 mb-2">Native Status</h3>
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Native</span>
        <span className="text-gray-700 text-xl font-bold">{counts.nativeStatus.Native || 0}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Non-native</span>
        <span className="text-gray-700 text-xl font-bold">{counts.nativeStatus['Non-native'] || 0}</span>
      </div>
    </div>
  </div>

  <div className="p-4 rounded-lg     ">
  <h3 className="text-[16px] font-semibold text-gray-800 mb-4">Teacher Types</h3>
  <div className="flex   gap-4">
    {[
      { type: 'KG', count: counts.teacherType.Kg || 0 },
      { type: 'Primary', count: counts.teacherType.Primary || 0 },
      { type: 'Secondary', count: counts.teacherType.Secondary || 0 },
      { type: 'Preparatory', count: counts.teacherType.Preparatory || 0 },
      { type: 'University/Colleges', count: counts.teacherType['University/Colleges'] || 0 }
    ].map(({ type, count }) => (
      <div key={type} className="flex-1 min-w-[200px] flex justify-between items-center p-4 rounded-lg border border-gray-300 bg-gray-50">
        <span className="text-gray-700 font-medium">{type}</span>
        <span className="text-gray-900 text-lg font-bold">{count}</span>
      </div>
    ))}
  </div>
</div>

</div>


      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">Region:</label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Regions</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        {selectedRegion && (
          <div className="w-full sm:w-1/2 md:w-1/3">
            <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-700">District:</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Districts</option>
              {(DISTRICTS[selectedRegion] || []).map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        )}
        <div className="w-full sm:w-1/2 md:w-1/3">
          <label htmlFor="teacherType" className="block mb-2 text-sm font-medium text-gray-700">Teacher Type:</label>
          <select
            id="teacherType"
            value={selectedTeacherType}
            onChange={(e) => setSelectedTeacherType(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Types</option>
            {['Kg', 'Primary', 'Secondary', 'Preparatory', 'University/Colleges'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Date Range:</label>
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholderText="End Date"
          />
        </div>
      </div>

      {/* Chart Selector */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Select Chart Type:</label>
        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Daily">Daily Chart</option>
          <option value="Weekly">Weekly Chart</option>
          <option value="Monthly">Monthly Chart</option>
          <option value="Yearly">Yearly Chart</option>
        </select>
      </div>

      {/* Display Selected Chart */}
      {selectedChart === 'Daily' && <LineChartComponent data={dailyChartData} title="Daily Teacher Counts" />}
      {selectedChart === 'Weekly' && <LineChartComponent data={weeklyChartData} title="Weekly Teacher Counts" />}
      {selectedChart === 'Monthly' && <LineChartComponent data={monthlyChartData} title="Monthly Teacher Counts" />}
      {selectedChart === 'Yearly' && <LineChartComponent data={yearlyChartData} title="Yearly Teacher Counts" />}
    </div>
  );
};

export default Dashboard;
