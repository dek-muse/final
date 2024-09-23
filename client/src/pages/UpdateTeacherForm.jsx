import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
const subjects = ['Math', 'Science', 'History', 'English']; // Replace with actual subjects
const EDUCATION_LEVELS = ['High School', 'Master\'s Degree', 'Doctorate'];
const SALARY_RANGES = {
  'High School': [7000, 8000],
  'Master\'s Degree': [9000, 10000],
  'Doctorate': [11000, 12000],
};

const UpdateTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    sex: '',
    nativeStatus: '',
    region: '',
    district: '',
    subjectsLearned: '',
    subjectsTech: '',
    description: '',
    joiningDate: '',
    birthDate: '',
    salary: '',
    educationLevel: ''
  });
  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`https://finalbakend.vercel.app/${id}`);
        setTeacher(response.data); // Set initial state with fetched data
        if (response.data.region) {
          setDistricts(DISTRICTS[response.data.region] || []);
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
        setErrors({ fetch: 'Could not fetch teacher data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prevTeacher) => ({
      ...prevTeacher,
      [name]: value,
    }));

    // Handle region change and reset districts
    if (name === 'region') {
      setDistricts(DISTRICTS[value] || []);
      setTeacher((prevTeacher) => ({
        ...prevTeacher,
        district: '', // Reset district when region changes
      }));
    }

    // Handle education level change and reset salary
    if (name === 'educationLevel') {
      setTeacher((prevTeacher) => ({
        ...prevTeacher,
        salary: '', // Reset salary when education level changes
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!teacher.name) newErrors.name = 'Name is required';
    if (!teacher.email) newErrors.email = 'Email is required';
    if (!teacher.mobile) newErrors.mobile = 'Mobile is required';
    if (!teacher.educationLevel) newErrors.educationLevel = 'Education Level is required';
    if (!teacher.salary) newErrors.salary = 'Salary is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await axios.put(`https://finalbakend.vercel.app/${id}`, teacher);
      navigate('/teachers');
    } catch (error) {
      console.error('Error updating teacher:', error);
      setErrors({ submit: 'Could not update teacher. Please try again.' });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-[210mm] mx-auto p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Teacher</h2>
      {errors.fetch && <p className="text-red-500 text-center mb-4">{errors.fetch}</p>}
      {errors.submit && <p className="text-red-500 text-center mb-4">{errors.submit}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
          <input type="text" name="name" id="name" value={teacher.name} onChange={handleChange} placeholder="Name" required className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block text-gray-700 mb-1">Birth Date</label>
          <input type="date" name="birthDate" id="birthDate" value={teacher.birthDate} onChange={handleChange} required className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input type="email" name="email" id="email" value={teacher.email} onChange={handleChange} placeholder="Email" required className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="mobile" className="block text-gray-700 mb-1">Mobile</label>
          <input type="tel" name="mobile" id="mobile" value={teacher.mobile} onChange={handleChange} placeholder="Mobile" required className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
          {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-gray-700 mb-1">Address</label>
          <input type="text" name="address" id="address" value={teacher.address} onChange={handleChange} placeholder="Address" required className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
        </div>

        {/* Sex */}
        <div>
          <label htmlFor="sex" className="block text-gray-700 mb-1">Sex</label>
          <select name="sex" id="sex" value={teacher.sex} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Native Status */}
        <div>
          <label htmlFor="nativeStatus" className="block text-gray-700 mb-1">Native Status</label>
          <select name="nativeStatus" id="nativeStatus" value={teacher.nativeStatus} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
            <option value="">Select Native Status</option>
            <option value="Native">Native</option>
            <option value="Non-Native">Non-Native</option>
          </select>
        </div>

        {/* Region */}
        <div>
          <label htmlFor="region" className="block text-gray-700 mb-1">Region</label>
          <select name="region" id="region" value={teacher.region} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
            <option value="">Select Region</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label htmlFor="district" className="block text-gray-700 mb-1">District</label>
          <select name="district" id="district" value={teacher.district} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Subjects Learned */}
        <div>
          <label htmlFor="subjectsLearned" className="block text-gray-700 mb-1">Subjects Learned</label>
          <select name="subjectsLearned" id="subjectsLearned" value={teacher.subjectsLearned} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Subjects Taught */}
        <div>
          <label htmlFor="subjectsTech" className="block text-gray-700 mb-1">Subjects Taught</label>
          <input type="text" name="subjectsTech" id="subjectsTech" value={teacher.subjectsTech} onChange={handleChange} placeholder="Subjects Taught" className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
        </div>

        {/* Education Level */}
        <div>
          <label htmlFor="educationLevel" className="block text-gray-700 mb-1">Education Level</label>
          <select name="educationLevel" id="educationLevel" value={teacher.educationLevel} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
            <option value="">Select Education Level</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.educationLevel && <p className="text-red-600 text-xs mt-1">{errors.educationLevel}</p>}
        </div>

        {/* Salary */}
        {teacher.educationLevel && (
          <div>
            <label htmlFor="salary" className="block text-gray-700 mb-1">Salary</label>
            <select name="salary" id="salary" value={teacher.salary} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800">
              <option value="">Select Salary</option>
              {SALARY_RANGES[teacher.educationLevel].map((range, index) => (
                <option key={index} value={range}>{range}</option>
              ))}
            </select>
            {errors.salary && <p className="text-red-600 text-xs mt-1">{errors.salary}</p>}
          </div>
        )}

        {/* Joining Date */}
        <div>
          <label htmlFor="joiningDate" className="block text-gray-700 mb-1">Joining Date</label>
          <input type="date" name="joiningDate" id="joiningDate" value={teacher.joiningDate} onChange={handleChange} required className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800" />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-1">Description</label>
          <textarea name="description" id="description" value={teacher.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded-lg bg-white shadow-sm text-gray-800"></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Update Teacher
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTeacher;
