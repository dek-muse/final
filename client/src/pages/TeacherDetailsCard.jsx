import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaFacebookSquare, FaCheck } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';

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
  const storage = getStorage();

  useEffect(() => {
    const fetchTeacher = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://finalbakend.vercel.app/${id}`);
        const teacherData = response.data;

        // Calculate age
        teacherData.age = calculateAge(teacherData.birthDate);

        // Determine retirement status
        const retirementAge = 60;
        if (teacherData.age >= retirementAge) {
          teacherData.isRetire = true;
          teacherData.yearsToRetirement = 0;
        } else {
          teacherData.isRetire = false;
          teacherData.yearsToRetirement = retirementAge - teacherData.age;
        }

        if (teacherData.picture) {
          try {
            const imageRef = ref(storage, teacherData.picture);
            const imageUrl = await getDownloadURL(imageRef);
            teacherData.picture = imageUrl;
          } catch (err) {
            console.error('Error fetching teacher image:', err);
          }
        }

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

  const downloadWord = () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(`Name: ${teacher.name}`),
              new TextRun({ text: '\nEmail: ' + teacher.email }),
              new TextRun({ text: '\nMobile: ' + teacher.mobile }),
              new TextRun({ text: '\nAddress: ' + teacher.address }),
              new TextRun({ text: '\nEducation Level: ' + teacher.educationLevel }),
              new TextRun({ text: '\nSalary: ' + (teacher.salary ? `$${teacher.salary}` : 'N/A') }),
              new TextRun({ text: '\nDescription: ' + (teacher.description || 'N/A') }),
              new TextRun({ text: '\nExperience: ' + (teacher.experience || 'N/A') }),
              new TextRun({ text: '\nRetirement Status: ' + (teacher.isRetire ? 'Retired' : 'Active') }),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${teacher.name}-CV.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-[210mm] mx-auto my-10 p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105" id="cv-content">
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
            <h1 className="text-3xl font-bold text-blue-800">{teacher.name}</h1>
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
          <p className="flex items-center">
            <FaMapMarkerAlt size={20} />
              {teacher.region}, {teacher.district}
          </p>
          <div className="flex gap-2 mt-2">
            
             
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Birth Date:</strong> {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Sex:</strong> {teacher.sex ? teacher.sex.join(', ') : 'N/A'}</p>
            <p><strong>Age:</strong> {teacher.age !== null ? teacher.age : 'N/A'}</p>
          </div>
          <div>
            <p><strong>Native Status:</strong> {teacher.nativeStatus ? teacher.nativeStatus.join(', ') : 'N/A'}</p>
            <p><strong>Retirement Status:</strong> {teacher.isRetire ? 'Retired' : 'Active'} (Years to Retirement: {teacher.yearsToRetirement})</p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Education</h2>
        <p><strong>Highest Education Level:</strong> {teacher.educationLevel || 'N/A'}</p>
        {/* <p><strong>Qualifications:</strong> {teacher.qualifications || 'N/A'}</p> */}
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Experience</h2>
        <p><strong>Years of Experience:</strong> {teacher.experience || 'N/A'}</p>
        <p><strong>Joining Date:</strong> {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Subjects Taught:</strong> {teacher.subjectsTech && teacher.subjectsTech.length > 0 ? teacher.subjectsTech.join(', ') : 'N/A'}</p>
        <p><strong>Subjects Learned:</strong> {teacher.subjectsLearned && teacher.subjectsLearned.length > 0 ? teacher.subjectsLearned.join(', ') : 'N/A'}</p>
      </section>

        {/* Skills
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Skills</h2>
          <ul className="list-disc pl-5">
            {teacher.skills && teacher.skills.length > 0 ? (
              teacher.skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaCheck size={16} className="text-green-600" /> {skill}
                </li>
              ))
            ) : (
              <p>No skills listed</p>
            )}
          </ul>
        </section> */}

      {/* Additional Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Additional Information</h2>
        <p><strong>Description:</strong> {teacher.description || 'N/A'}</p>
        <p><strong>Salary:</strong> {teacher.salary ? `${teacher.salary} Birr` : 'N/A'}</p>
      </section>

      {/* Attachments */}
      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Attachments</h2>
        {teacher.fileAttachment ? (
          <a
            href={teacher.fileAttachment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
          >
            View Attachment
          </a>
        ) : (
          <p>No file attached</p>
        )}
      </section> */}

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button onClick={() => navigate(-1)} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
          Back
        </button>
        <div className="flex gap-4">
          <button onClick={downloadPDF} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Download as PDF
          </button>
          {/* <button onClick={downloadWord} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Download CV as Word
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsCV;