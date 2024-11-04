import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './printcv.css'; // Import the print stylesheet

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const TeacherDetailsCV = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQualifications, setShowQualifications] = useState(false); // State to toggle qualifications display
  const storage = getStorage();

  useEffect(() => {
    const fetchTeacher = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://finalbakend.vercel.app/${id}`);
        const teacherData = response.data;

        teacherData.age = calculateAge(teacherData.birthDate);

        const retirementAge = 60;
        if (teacherData.age >= retirementAge) {
          teacherData.isRetire = true;
          teacherData.yearsToRetirement = 0;
        } else {
          teacherData.isRetire = false;
          teacherData.yearsToRetirement = retirementAge - teacherData.age;
        }

        // Fetch teacher picture from Firebase
        if (teacherData.picture) {
          try {
            const imageRef = ref(storage, teacherData.picture);
            const imageUrl = await getDownloadURL(imageRef);
            teacherData.picture = imageUrl;
          } catch (err) {
            console.error('Error fetching teacher image:', err);
          }
        }

        // Handle qualifications URL
        teacherData.qualifications = teacherData.qualifications || null; // Ensure qualifications is set

        setTeacher(teacherData);
      } catch (err) {
        setError('Failed to fetch teacher details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id, storage]);

  const downloadPDF = () => {
    const input = document.getElementById('cv-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${teacher.name}-CV.pdf`);
    });
  };

  const toggleQualifications = () => {
    setShowQualifications(prevState => !prevState); // Toggle qualifications display
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-[210mm] mx-auto my-10 p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105 printable-area" id="cv-content">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-6">
          <div className="w-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg">
            {teacher.picture ? (
              <img src={teacher.picture} alt={teacher.name} className="rounded-full w-[7rem] h-[8rem]" />
            ) : (
              <div className="bg-gray-300 rounded-full"></div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 uppercase">{teacher.name}</h1>
            <p className="text-2xl">{teacher.teacherType}</p>
          </div>
        </div>
        <div className="text-right space-y-3 ml-2">
          <p className="flex items-center gap-2">
            <FaEnvelope size={20} />
            {teacher.email}
          </p>
          <p className="flex items-center gap-2">
            <FaPhone size={20} />
            {teacher.mobile}
          </p>
          <p className="flex items-center uppercase">
            <FaMapMarkerAlt size={20} />
            {teacher.region}, {teacher.district}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 uppercase">
          <div>
            <p><strong>Birth Date:</strong> {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Sex:</strong> {teacher.sex || 'N/A'}</p>
            <p><strong>Age:</strong> {teacher.age !== null ? teacher.age : 'N/A'}</p>
            <p><strong>Native Status:</strong> {teacher.nativeStatus || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Retirement Status:</strong> {teacher.isRetire ? 'Retired' : 'Active'} (Years to Retirement: {teacher.yearsToRetirement})</p>
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      {teacher.qualifications && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Qualifications</h2>
          <button onClick={toggleQualifications} className="text-blue-600 underline">
            {showQualifications ? 'Hide Qualifications' : 'View Qualifications'}
          </button>
          {showQualifications && (
            <div className="mt-4">
              <iframe
                src={teacher.qualifications}
                title="Qualifications PDF"
                width="100%"
                height="500px"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          )}
        </section>
      )}

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button onClick={() => navigate(-1)} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
          Back
        </button>
        <div className="flex gap-4">
          <button onClick={downloadPDF} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Download as PDF
          </button>
          <button onClick={() => window.print()} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
            Print CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsCV;
