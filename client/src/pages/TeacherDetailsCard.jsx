import React, { useState, useEffect, useMemo } from 'react';
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
  const [showQualifications, setShowQualifications] = useState(false); // State to toggle qualifications visibility
  const storage = getStorage();

  useEffect(() => {
    const fetchTeacher = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://finalbakend.vercel.app/${id}`);
        const teacherData = response.data;

        teacherData.age = calculateAge(teacherData.birthDate);
        teacherData.isRetire = teacherData.age >= 60;
        teacherData.yearsToRetirement = teacherData.isRetire ? 0 : 60 - teacherData.age;

        if (teacherData.picture) {
          const imageRef = ref(storage, teacherData.picture);
          teacherData.picture = await getDownloadURL(imageRef);
        }

        setTeacher(teacherData);
      } catch (err) {
        console.error('Error fetching teacher details:', err);
        setError('Failed to fetch teacher details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id, storage]);

  const age = useMemo(() => calculateAge(teacher?.birthDate), [teacher?.birthDate]);

  const downloadPDF = (sectionId, fileName) => {
    const input = document.getElementById(sectionId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, (canvas.height * 190) / canvas.width);
      pdf.save(`${fileName}.pdf`);
    });
  };

  const printSection = (sectionId) => {
    const content = document.getElementById(sectionId);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
          <style>
            @media print {
              button {
                display: none; /* Hide buttons when printing */
              }
            }
          </style>
        </head>
        <body>
           ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Toggle function for qualifications
  const toggleQualifications = () => {
    setShowQualifications(prev => !prev);
  };

  if (isLoading) return <div> <div className="min-h-screen flex items-center justify-center -mt-6">
  <div className="flex-col gap-4 w-full flex items-center justify-center">
    <div className="w-20 h-20 border-4 border-transparent text-[#f27405] text-4xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
      <div className="w-16 h-16 border-4 border-transparent  text-2xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
    </div>
  </div>
</div></div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto my-10">
      {/* Teacher Information Layout */}
      <div id="cv-content" className="max-w-[210mm] mx-auto p-8 shadow-xl rounded-lg printable-area mb-8">
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
            <p className="flex items-center gap-2"><FaEnvelope size={20} /> {teacher.email}</p>
            <p className="flex items-center gap-2"><FaPhone size={20} /> {teacher.mobile}</p>
            <p className="flex items-center uppercase"><FaMapMarkerAlt size={20} /> {teacher.region}, {teacher.district}</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 uppercase">
            <div>
              <p><strong>Birth Date:</strong> {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Sex:</strong> {teacher.sex || 'N/A'}</p>
              <p><strong>Age:</strong> {age !== null ? age : 'N/A'}</p>
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

        <div className="flex justify-between gap-4">
          <button onClick={() => navigate(-1)} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">Back</button>
          <button onClick={() => { downloadPDF('cv-content', `${teacher.name}-CV`); }} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Download CV as PDF</button>
          <button onClick={() => printSection('cv-content')} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Print CV</button>
        </div>
      </div>

     {/* Notification Letter Section */}
     <div id="notification-content" className="notification-letter max-w-[210mm] mx-auto p-8 shadow-lg mb-8">
        <header className="text-center mb-4">
          <h2>Somali Regional State</h2>
          <p className="font-bold">Education Bureau</p>
        </header>

        <hr className="h-2 bg-gray-600" />

 
        <p className="justify-end flex">Ref: <strong>______________________</strong></p>
        <p className=' justify-end flex'>Date: <strong>______________________</strong></p>
        
        
        <h3 className="text-center my-4 font-bold underline">Ujeedo: Meeleyn Bare</h3>

        <p>Og: Xafiiska Maamulka & horumarinta ee ...</p>
        <p>Og: Xafiiska Waxbarashada Degmada {teacher.region}</p>
        <p>Og: Geedi-hoosadka Maamulka Degmada {teacher.region}</p>

        <p className="my-4">Sida tooska ah loogu socodsiinayo, waxaan idin la socodsiinaynaa magaca macallinka hoos ku xusan kaas oo aan ku meeleynay goobta sare:</p>
        <p className="justify-end flex">
  Date: <strong>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
</p>
                <table className="w-full border-collapse my-4 text-sm">
          <thead>
            <tr className="border-b">
              <th className="border px-4 py-2">Magaca Baraha</th>
              <th className="border px-4 py-2">H. Waxb</th>
              <th className="border px-4 py-2">S. Shaqada</th>
              <th className="border px-4 py-2">Mushaharka</th>
              <th className="border px-4 py-2">Incentive</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 uppercase">{teacher.name}</td>
              <td className="border px-4 py-2">{teacher.educationLevel}</td>
              <td className="border px-4 py-2">2016</td>
              <td className="border px-4 py-2">{teacher.salary}</td>
              <td className="border px-4 py-2">500</td>
              <td className="border px-4 py-2">5109</td>
            </tr>
          </tbody>
        </table>

 
        <div className="flex justify-between gap-4">
          <button onClick={() => downloadPDF('notification-content', 'Notification-Letter')} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Download Notification as PDF</button>
          <button onClick={() => printSection('notification-content')} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Print Notification</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsCV;
