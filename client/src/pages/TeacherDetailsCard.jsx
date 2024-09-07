  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';

  const TeacherDetailsCard = ({ teacher, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    if (!teacher) return null;

    const toggleDetails = () => setIsExpanded(!isExpanded);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out ">
        <div className="relative w-[900px] max-w-128 h-[580px] bg-white rounded-lg shadow-lg p-8 mx-4 sm:mx-6 lg:mx-8 transition-transform transform scale-100 hover:scale-105 hover:bg-[#b19d60]  hover:text-white ">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-2xl "
          >
            &times;
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6  ">
            <div className="flex-shrink-0">
              {teacher.picture ? (
                <img
                  src={teacher.picture}
                  alt={teacher.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md transition-transform duration-300 transform hover:scale-110"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-gray-200"></div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-primary mb-2">{teacher.name}</h2>
              <p className="text-lg mb-1">Email: <span className="font-semibold">{teacher.email || 'N/A'}</span></p>
              <p className="text-lg mb-1">Mobile: <span className="font-semibold">{teacher.mobile || 'N/A'}</span></p>
              <p className="text-lg mb-1">City: <span className="font-semibold">{teacher.city || 'N/A'}</span></p>
              <p className="text-lg mb-1">Address: <span className="font-semibold">{teacher.address || 'N/A'}</span></p>
              <p className="text-lg mb-1">Region: <span className="font-semibold">{teacher.region || 'N/A'}</span></p>
              <p className="text-lg mb-1">District: <span className="font-semibold">{teacher.district || 'N/A'}</span></p>
              <p className="text-lg mb-1">Subjects Learned: <span className="font-semibold">{teacher.subjectsLearned || 'N/A'}</span></p>
              <p className="text-lg mb-1">Subjects Taught: <span className="font-semibold">{teacher.subjectsTech || 'N/A'}</span></p>
              <p className="text-lg mb-1">Description: <span className="font-semibold">{teacher.description || 'N/A'}</span></p>
              <p className="text-lg mb-1">Sex: <span className="font-semibold">{teacher.sex || 'N/A'}</span></p>
              <p className="text-lg mb-1">Native Status: <span className="font-semibold">{teacher.nativeStatus || 'N/A'}</span></p>
              <p className="text-lg mb-1">Teacher Type: <span className="font-semibold">{teacher.teacherType || 'N/A'}</span></p>
              {isExpanded ? (
                <>
                  <p className="text-lg text-gray-600 mb-1">Joining Date: <span className="font-semibold">{teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}</span></p>
                </>
              ) : (
                <button
                  onClick={toggleDetails}
                  className="text-blue-600 hover:text-blue-700 mt-2 transition-colors duration-200"
                >
                  Show More
                </button>
              )}
              <div className="mt-4 flex flex-wrap gap-4">
                {teacher.resume && (
                  <a
                    href={teacher.resume}
                    download
                    className="inline-flex items-center py-2 px-4 rounded-md text-white bg-secondary hover:bg-yellow-700 transition-colors duration-200"
                  >
                    Download Resume
                  </a>
                )}
                 
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Last Updated: <span className="font-semibold">{teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}</span>
              </p>
            </div>
          </div>
          <div className="-mt-[90px] ml-[600px] flex gap-4 ">
            <button
              onClick={() => navigate(`/update-teacher/${teacher._id}`)}
              className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default TeacherDetailsCard;
