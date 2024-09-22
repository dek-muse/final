import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { IoMail, IoCall, IoLocation, IoLogoLinkedin, IoLogoFacebook, IoCheckmark } from 'react-icons/io5';

const TeacherDetailsCV = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const storage = getStorage();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`https://finalbakend.vercel.app/${id}`);
        const teacherData = response.data;

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

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-r from-blue-200 to-white max-w-[210mm] mx-auto my-10 p-8 shadow-xl rounded-lg transition-transform transform hover:scale-105">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg">
            {teacher.picture ? (
              <img src={teacher.picture} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-800">{teacher.name}</h1>
            <p className="text-lg text-gray-700">{teacher.teacherType}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="flex items-center gap-2 text-gray-600">
            <IoMail size={20} />
            {teacher.email}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <IoCall size={20} />
            {teacher.mobile}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <IoLocation size={20} />
            {teacher.address}, {teacher.region}, {teacher.district}
          </p>
          <div className="flex gap-2 mt-2">
            {teacher.linkedin && (
              <a href={teacher.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300">
                <IoLogoLinkedin size={20} />
              </a>
            )}
            {teacher.facebook && (
              <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300">
                <IoLogoFacebook size={20} />
              </a>
            )}
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
          </div>
          <div>
            <p><strong>Native Status:</strong> {teacher.nativeStatus ? teacher.nativeStatus.join(', ') : 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Education</h2>
        <p><strong>Highest Education Level:</strong> {teacher.educationLevel || 'N/A'}</p>
        <p><strong>Qualifications:</strong> {teacher.qualifications || 'N/A'}</p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Experience</h2>
        <p><strong>Years of Experience:</strong> {teacher.experience || 'N/A'}</p>
        <p><strong>Joining Date:</strong> {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Subjects Taught:</strong> {teacher.subjectsTech && teacher.subjectsTech.length > 0 ? teacher.subjectsTech.join(', ') : 'N/A'}</p>
        <p><strong>Subjects Learned:</strong> {teacher.subjectsLearned && teacher.subjectsLearned.length > 0 ? teacher.subjectsLearned.join(', ') : 'N/A'}</p>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Skills</h2>
        <ul className="list-disc pl-5">
          {teacher.skills && teacher.skills.length > 0 ? (
            teacher.skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2">
                <IoCheckmark size={16} className="text-green-600" /> {skill}
              </li>
            ))
          ) : (
            <p>No skills listed</p>
          )}
        </ul>
      </section>

      {/* Additional Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Additional Information</h2>
        <p><strong>Description:</strong> {teacher.description || 'N/A'}</p>
        <p><strong>Salary:</strong> {teacher.salary ? `$${teacher.salary}` : 'N/A'}</p>
      </section>

      {/* Attachments */}
      <section className="mb-8">
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
      </section>
    </div>
  );
};

export default TeacherDetailsCV;