import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MdHistory, MdSwapHoriz } from 'react-icons/md'; // Importing icons from react-icons
import './print.css'; // Import print styles

function TeacherDetails() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateHistory, setShowUpdateHistory] = useState(false);
  const [showTransferHistory, setShowTransferHistory] = useState(false);

  useEffect(() => {
    // Fetch teacher data by ID
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

  if (loading) return <div> <div className="min-h-screen flex items-center justify-center -mt-6">
  <div className="flex-col gap-4 w-full flex items-center justify-center">
    <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
      <div className="w-16 h-16 border-4 border-transparent  text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
    </div>
  </div>
</div></div>;

  // Ensure teacher data is available
  if (!teacher) {
    return <div>No teacher data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
        <h1 className='text-3xl font-semibold'>Teacher Information</h1>
        <button 
          onClick={handlePrint} 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition duration-200"
        >
          Print
        </button>
      </div>

      <div className="printable-area">
        {/* Teacher profile and basic info */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={teacher.picture || 'https://via.placeholder.com/150'}
            alt={`${teacher.name}'s Profile`}
            className="w-40 h-40 rounded-full border-4 border-blue-300 shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold">{teacher.name}</h1>
            <p className="text-lg text-gray-500"><strong>Mobile:</strong> {teacher.mobile}</p>
            <p className="text-lg text-gray-500"><strong>Email:</strong> {teacher.email}</p>
            <p className="text-lg text-gray-500"><strong>Address:</strong> {teacher.region}, {teacher.district}</p>
          </div>
        </div>

        {/* Additional details */}
        <div className="p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Description:</strong> {teacher.description}</p>
            <p><strong>Type:</strong> {teacher.teacherType}</p>
            <p><strong>Experience:</strong> {teacher.experience}</p>
            <p><strong>Subjects Learned:</strong> {Array.isArray(teacher.subjectsLearned) ? teacher.subjectsLearned.join(', ') : 'N/A'}</p>
            <p><strong>Subjects Taught:</strong> {Array.isArray(teacher.subjectsTech) ? teacher.subjectsTech.join(', ') : 'N/A'}</p>
            <p><strong>Joining Date:</strong> {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Salary:</strong> {teacher.salary}</p>
            <p><strong>Education Level:</strong> {teacher.educationLevel}</p>
            <p><strong>Birth Date:</strong> {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Health Status:</strong> {teacher.healthStatus}</p>
            <p><strong>Sex:</strong> {teacher.sex}</p>
            <p><strong>Health Status:</strong> {teacher.nativeStatus}</p>
           </div>
        </div>

        {/* Transfer Information */}
        <div className="p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Transfer Information</h2>
          <p><strong>Transfer Status:</strong> {teacher.transfer ? 'Transferred' : 'Not Transferred'}</p>
          {teacher.transfer && (
            <>
              <p><strong>New Region:</strong> {teacher.region}</p>
              <p><strong>New District:</strong> {teacher.district}</p>
            </>
          )}
        </div>

        {/* Buttons for toggling histories */}
        <div className="flex justify-between mt-6 mb-4">
          <button 
            onClick={() => setShowUpdateHistory(prev => !prev)} 
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700 transition duration-200"
          >
            <MdHistory className="mr-2" /> {/* Using React Icon */}
            {showUpdateHistory ? 'Hide Update History' : 'Show Update History'}
          </button>
          <button 
            onClick={() => setShowTransferHistory(prev => !prev)} 
            className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded shadow-lg hover:bg-yellow-700 transition duration-200"
          >
            <MdSwapHoriz className="mr-2" /> {/* Using React Icon */}
            {showTransferHistory ? 'Hide Transfer History' : 'Show Transfer History'}
          </button>
        </div>

        {/* Update history */}
        {showUpdateHistory && (
          <div className="p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Update History</h2>
            {teacher.updateHistory && teacher.updateHistory.length > 0 ? (
              teacher.updateHistory.map((update, index) => (
                <div key={index} className="border p-4 my-2 rounded-lg shadow-sm">
                  <p><strong>Region:</strong> {update.newRegion}</p>
                  <p><strong>District:</strong> {update.newDistrict}</p>
                  <p><strong>Updated At:</strong> {new Date(update.updatedAt).toLocaleString()}</p>
                  <p><strong>Updated By:</strong> {teacher.updatedBy?.username || 'Unknown'}</p>
                  {/* <p><strong>Transfer Reason:</strong> {update.transferReason || 'N/A'}</p> */}
                </div>
              ))
            ) : (
              <p>No update history available.</p>
            )}
          </div>
        )}

        {/* Transfer history (if applicable) */}
        {showTransferHistory && teacher.transferHistory && teacher.transferHistory.length > 0 && (
          <div className="p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Transfer History</h2>
            {teacher.transferHistory.map((transfer, index) => (
              <div key={index} className="border p-4 my-2 rounded-lg shadow-sm">
                <p><strong>Previous Region:</strong> {transfer.previousRegion}</p>
                <p><strong>Previous District:</strong> {transfer.previousDistrict}</p>
                <p><strong>Transfer Date:</strong> {new Date(transfer.transferDate).toLocaleString()}</p>
                <p><strong>Transfer Reason:</strong> {transfer.transferReason || 'N/A'}</p>
                <p><strong>Transferred By:</strong> {teacher.updatedBy?.username || 'Unknown'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDetails;
