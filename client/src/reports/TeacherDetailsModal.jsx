import React from 'react';
import { Bar } from 'react-chartjs-2';

const TeacherDetailsModal = ({ teacher, onClose }) => {
  const chartData = {
    labels: ['Subject 1', 'Subject 2', 'Subject 3'], // Replace with relevant data
    datasets: [
      {
        label: 'Performance',
        data: [teacher.performance1, teacher.performance2, teacher.performance3], // Example data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Teacher Details info</h2>
        <div className="border rounded-lg shadow-md p-4 bg-white" style={{ width: '3.375in', height: '2.125in' }}>
          <div className="flex items-center mb-2">
            <img 
              src={teacher.photo} 
              alt={`${teacher.name}'s photo`} 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-bold">{teacher.name}</h2>
              <p className="text-sm">Phone: {teacher.mobile}</p>
              <p className="text-sm">Email: {teacher.email}</p>
            </div>
          </div>
          <Bar data={chartData} options={{ responsive: true }} />
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

export default TeacherDetailsModal;
