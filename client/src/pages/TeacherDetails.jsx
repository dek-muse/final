// src/TeacherDetails.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './print.css'; // Import print styles

function TeacherDetails() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    axios.get(`https://finalbakend.vercel.app/${id}`)
      .then(response => {
        setTeacher(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teacher details:', error);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center -mt-6">
  <div className="flex-col gap-4 w-full flex items-center justify-center">
    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 border-4 border-transparent text-[#f27405] text-4xl md:text-5xl lg:text-6xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
      <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-4 border-transparent text-2xl md:text-3xl lg:text-4xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
    </div>
  </div>
</div>;

  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
        <h1 className='text-3xl font-semibold '>Teacher Information</h1>
        <button 
          onClick={handlePrint} 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition duration-200"
        >
          Print
        </button>
      </div>

      <div className="printable-area"> {/* This is the printable area */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={teacher.picture || 'https://via.placeholder.com/150'}
            alt={`${teacher.name}'s Profile`}
            className="w-40 h-40 rounded-full border-4 border-blue-300 shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold ">{teacher.name}</h1>
            <p className="text-lg text-gray-500"><strong>Mobile:</strong> {teacher.mobile}</p>
            <p className="text-lg text-gray-500"><strong>Email:</strong> {teacher.email}</p>
            <p className="text-lg text-gray-500"><strong>Address:</strong> {teacher.region}, {teacher.district}</p>
          </div>
        </div>

        {/* Teacher Details */}
        <div className=" p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold  mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Type:</strong> {teacher.teacherType}</p>
            <p><strong>Qualifications:</strong> {teacher.qualifications}</p>
            <p><strong>Experience:</strong> {teacher.experience}</p>
            <p><strong>Subjects Learned:</strong> {teacher.subjectsLearned.join(', ')}</p>
            <p><strong>Subjects Taught:</strong> {teacher.subjectsTech.join(', ')}</p>
            <p><strong>Description:</strong> {teacher.description}</p>
            <p><strong>Joining Date:</strong> {new Date(teacher.joiningDate).toLocaleDateString()}</p>
            <p><strong>Salary:</strong> {teacher.salary}</p>
            <p><strong>Education Level:</strong> {teacher.educationLevel}</p>
            <p><strong>Birth Date:</strong> {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Life Status:</strong> {teacher.lifeStatus}</p>
            <p><strong>Health Status:</strong> {teacher.healthStatus}</p>
            <p><strong>Sex:</strong> {teacher.sex.join(', ')}</p>
            <p><strong>Native Status:</strong> {teacher.nativeStatus.join(', ')}</p>
          </div>
        </div>

        {/* Transfer Information */}
        <div className=" p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold  mb-4">Transfer Information</h2>
          <p><strong>Transfer Status:</strong> {teacher.transfer ? 'Transferred' : 'Not Transferred'}</p>
          {teacher.transfer && (
            <>
              <p><strong>New Region:</strong> {teacher.newRegion}</p>
              <p><strong>New District:</strong> {teacher.newDistrict}</p>
            </>
          )}
        </div>

        {/* Update History */}
        {teacher.updateHistory && teacher.updateHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold  mb-2">Update History</h2>
            {showMore ? (
              teacher.updateHistory.map((update, index) => (
                <div key={index} className="border p-4 my-2 rounded-lg  shadow-sm">
                  <p><strong>Region:</strong> {update.region}</p>
                  <p><strong>District:</strong> {update.district}</p>
                  <p><strong>Updated At:</strong> {new Date(update.updatedAt).toLocaleString()}</p>
                  <p><strong>Updated By:</strong> {update.updatedBy?.username || 'Unknown'}</p>
                  <p><strong>Transfer Reason:</strong> {update.transferReason || 'N/A'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Click "More..." to see update history.</p>
            )}
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-2 text-blue-500 underline"
            >
              {showMore ? 'Less...' : 'More...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDetails;
