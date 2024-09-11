import { React, useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Define constants
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

// Filters Component
const Filters = ({
  subjectFilter, setSubjectFilter,
  sexFilter, setSexFilter,
  regionFilter, setRegionFilter,
  districtFilter, setDistrictFilter,
  regions, districts
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 p-4   rounded shadow-md">
    <div className="p-4   bg-white rounded   shadow-sm dark:bg-gray-800  shadow-[#b19d60] ">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Filter by Subject</h2>
      <input
        type="text"
        placeholder="Search by subject..."
        value={subjectFilter}
        onChange={e => setSubjectFilter(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="p-4   dark:bg-gray-800 rounded bg-[#b19d60] shadow-sm shadow-[#b19d60]">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Filter by Sex</h2>
      <select
        value={sexFilter}
        onChange={e => setSexFilter(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
    <div className="p-4  dark:bg-gray-800 rounded bg-[#b19d60] shadow-sm shadow-[#b19d60]">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 ">Filter by Region</h2>
      <select
        value={regionFilter}
        onChange={e => {
          setRegionFilter(e.target.value);
          setDistrictFilter(''); // Reset district filter when region changes
        }}
        className="p-2 border border-gray-300 rounded-md w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        {regions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
    <div className="p-4  dark:bg-gray-800 rounded   bg-[#b19d60] shadow-sm shadow-[#b19d60]">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Filter by District</h2>
      <select
        value={districtFilter}
        onChange={e => setDistrictFilter(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!regionFilter} // Disable if no region is selected
      >
        <option value="">All</option>
        {(DISTRICTS[regionFilter] || []).map(district => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// TotalTeachersCard Component
const TotalTeachersCard = ({ total, nativeCount, nonNativeCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200 ">Total Teachers</h2>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{total}</p>
    </div>
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Native Teachers</h2>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{nativeCount}</p>
    </div>
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Non-native Teachers</h2>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{nonNativeCount}</p>
    </div>
  </div>
);

// PieChartComponent Component
const PieChartComponent = ({ data, colors }) => (
  <div className="w-full max-w-4xl mx-auto">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Legend />
        <RechartsTooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// LineChartComponent Component
const LineChartComponent = ({ data, title }) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 w-full max-w-4xl mx-auto">
    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <RechartsTooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const Dashboard = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [pieData, setPieData] = useState([
    { name: 'Native', value: 0 },
    { name: 'Non-native', value: 0 },
  ]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [selectedChart, setSelectedChart] = useState('Pie'); // State for selected chart

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://finalbakend.vercel.app/');
        const data = response.data;
        setTeacherData(data);

        // Apply filters
        const filteredData = data.filter(
          teacher =>
            (!subjectFilter || teacher.subjects.includes(subjectFilter)) &&
            (!sexFilter || teacher.sex === sexFilter) &&
            (!regionFilter || teacher.region === regionFilter) &&
            (!districtFilter || teacher.district === districtFilter)
        );

        // Calculate counts
        const total = filteredData.length;
        const nativeCount = filteredData.filter(teacher => teacher.nativeStatus === 'Native').length;
        const nonNativeCount = filteredData.filter(teacher => teacher.nativeStatus === 'Non-native').length;

        setPieData([
          { name: 'Native', value: nativeCount },
          { name: 'Non-native', value: nonNativeCount },
        ]);

        // Process data for charts
        const dailyCounts = filteredData.reduce((acc, teacher) => {
          const date = new Date(teacher.joiningDate);
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', teacher.joiningDate);
            return acc;
          }
          const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
          if (!acc[formattedDate]) {
            acc[formattedDate] = 0;
          }
          acc[formattedDate]++;
          return acc;
        }, {});

        const weeklyCounts = filteredData.reduce((acc, teacher) => {
          const date = new Date(teacher.joiningDate);
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', teacher.joiningDate);
            return acc;
          }
          const weekNumber = getWeekNumber(date);
          if (!acc[weekNumber]) {
            acc[weekNumber] = 0;
          }
          acc[weekNumber]++;
          return acc;
        }, {});

        const monthlyCounts = filteredData.reduce((acc, teacher) => {
          const date = new Date(teacher.joiningDate);
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', teacher.joiningDate);
            return acc;
          }
          const month = date.toISOString().split('-')[1]; // MM
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month]++;
          return acc;
        }, {});

        const yearlyCounts = filteredData.reduce((acc, teacher) => {
          const date = new Date(teacher.joiningDate);
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', teacher.joiningDate);
            return acc;
          }
          const year = date.getFullYear().toString();
          if (!acc[year]) {
            acc[year] = 0;
          }
          acc[year]++;
          return acc;
        }, {});

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

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectFilter, sexFilter, regionFilter, districtFilter]);

  const getWeekNumber = date => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="p-6  min-h-screen">
      <Filters
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        sexFilter={sexFilter}
        setSexFilter={setSexFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        regions={REGIONS}
        districts={DISTRICTS}
      />
      <TotalTeachersCard
        total={teacherData.length}
        nativeCount={pieData.find(item => item.name === 'Native').value}
        nonNativeCount={pieData.find(item => item.name === 'Non-native').value}
      />
      <div className="mb-4">
        <label className="mr-2 text-lg font-semibold   ">Select Chart Type:</label>
        <select
          value={selectedChart}
          onChange={e => setSelectedChart(e.target.value)}
          className="p-2 border border-gray-300 rounded-md dark:textt-gray-800  dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pie">Pie Chart</option>
          <option value="Daily">Daily Joining Data</option>
          <option value="Weekly">Weekly Joining Data</option>
          <option value="Monthly">Monthly Joining Data</option>
          <option value="Yearly">Yearly Joining Data</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-4">
        {selectedChart === 'Pie' && (
          <PieChartComponent
            data={pieData}
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
    </div>
  );
};

export default Dashboard;
