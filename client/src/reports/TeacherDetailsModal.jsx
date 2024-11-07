import React from 'react';
import { Bar } from 'react-chartjs-2';

const TeacherDetailsModal = ({ teacher, onClose }) => {
  const chartData = {
    labels: ['Subject 1', 'Subject 2', 'Subject 3'], // Replace with relevant data
    datasets: [
      {
        label: 'Performance',
        data: [teacher.performance1, teacher.performance2, teacher.performance3], // Example data
        backgroundColor: 'red',
      },
    ],
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center   bg-white">
  <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
    {/* Modal Header */}
    <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
      Teacher Details
    </h2>

    {/* Teacher Info Card */}
    <div 
      className="border border-gray-200 rounded-lg shadow-lg p-5 bg-gray-50 mx-auto mb-6" 
      style={{ width: '3.375in', height: '2.125in' }}
    >
      <div className="flex items-center mb-3 ">
        {/* Teacher Image */}
        <img 
          src={teacher.photo} 
          alt={`${teacher.name}'s photo`} 
          className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-700 uppercase">{teacher.name}</h2>
          <p className="text-sm text-gray-600">📞 {teacher.mobile}</p>
          <p className="text-sm text-gray-600">📧 {teacher.email}</p>
        </div>
      </div>
      {/* Teacher Data Chart */}
      <div className="flex justify-center">
        <Bar 
          data={chartData} 
          options={{ responsive: true, maintainAspectRatio: false }}
          style={{ height: '80px', width: '100%' }}
        />
      </div>
    </div>

    {/* Close Button */}
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
      >
        Close
      </button>
    </div>
  </div>
</div>

  );
};

export default TeacherDetailsModal;
