import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader';

// Regions and Districts Constants
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

// Subjects Constants
const subjectsList = [
  'Mathematics',
  'Science',
  'English',
  'History',
  // Add more subjects as needed
];

// Description Options Example
const descriptionOptions = [
  'Experienced teacher with over 10 years of teaching.',
  'Newly certified teacher specializing in Science.',
  'Expert in integrating technology into the classroom.',
  // Add more descriptions as needed
];

const UpdateTeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    address: '',
    region: '',
    district: '',
    subjectsLearned: '',
    subjectsTech: '',
    description: '',
    sex: '',
    nativeStatus: '',
    picture: null,
    joiningDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`https://finalbakend.vercel.app/${id}`);
        setTeacher(response.data);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        alert('Error fetching teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  useEffect(() => {
    if (teacher.region) {
      setDistricts(DISTRICTS[teacher.region] || []);
    }
  }, [teacher.region]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setTeacher({ ...teacher, [name]: files[0] });
    } else {
      setTeacher({ ...teacher, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!teacher.name) newErrors.name = 'Name is required';
    if (!teacher.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(teacher.email)) newErrors.email = 'Email is invalid';
    if (!teacher.mobile) newErrors.mobile = 'Mobile is required';
    if (!teacher.city) newErrors.city = 'City is required';
    if (!teacher.address) newErrors.address = 'Address is required';
    if (!teacher.region) newErrors.region = 'Region is required';
    if (!teacher.district) newErrors.district = 'District is required';
    if (!teacher.subjectsLearned) newErrors.subjectsLearned = 'Subjects Learned is required';
    if (!teacher.subjectsTech) newErrors.subjectsTech = 'Subjects Taught is required';
    if (!teacher.description) newErrors.description = 'Description is required';
    if (!teacher.sex) newErrors.sex = 'Sex is required';
    if (!teacher.nativeStatus) newErrors.nativeStatus = 'Native Status is required';
    if (!teacher.joiningDate) newErrors.joiningDate = 'Joining Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const formData = new FormData();
    Object.keys(teacher).forEach((key) => {
      formData.append(key, teacher[key]);
    });

    try {
      const response = await axios.put(`https://finalbakend.vercel.app/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update response:', response.data); // Debugging information
      setSuccessMessage('Teacher updated successfully!');
      setTimeout(() => {
        navigate('/teachersList');
      }, 2000);
    } catch (error) {
      console.error('Update error:', error); // Debugging information
      alert('Error updating teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/teachersList');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-2xl border shadow-[#b19d60] border-[#b19d60]">
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center bg-[#b19d60] rounded-lg p-3 uppercase">Update Teacher</h2>
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={teacher.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.name ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  /> 
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={teacher.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium mb-1">
                    Mobile:
                  </label>
                  <input
                    id="mobile"
                    type="text"
                    name="mobile"
                    value={teacher.mobile}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.mobile ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium mb-1">
                    Region:
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={teacher.region}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.region ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  >
                    <option value="">Select Region</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>

                {/* District */}
                <div>
                  <label htmlFor="district" className="block text-sm font-medium mb-1">
                    District:
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={teacher.district}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.district ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                {/* Picture */}
                <div>
                  <label htmlFor="picture" className="block text-sm font-medium mb-1">
                    Picture:
                  </label>
                  <input
                    id="picture"
                    type="file"
                    name="picture"
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.picture ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  />
                  {errors.picture && <p className="text-red-500 text-sm mt-1">{errors.picture}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City:
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={teacher.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.city ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address:
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={teacher.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.address ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Subjects Learned */}
                <div>
                  <label htmlFor="subjectsLearned" className="block text-sm font-medium mb-1">
                    Subjects Learned:
                  </label>
                  <select
                    id="subjectsLearned"
                    name="subjectsLearned"
                    value={teacher.subjectsLearned}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.subjectsLearned ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  >
                    <option value="">Select Subjects Learned</option>
                    {subjectsList.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subjectsLearned && <p className="text-red-500 text-sm mt-1">{errors.subjectsLearned}</p>}
                </div>

                {/* Subjects Taught */}
                <div>
                  <label htmlFor="subjectsTech" className="block text-sm font-medium mb-1">
                    Subjects Taught:
                  </label>
                  <select
                    id="subjectsTech"
                    name="subjectsTech"
                    value={teacher.subjectsTech}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.subjectsTech ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  >
                    <option value="">Select Subjects Taught</option>
                    {subjectsList.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subjectsTech && <p className="text-red-500 text-sm mt-1">{errors.subjectsTech}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={teacher.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.description ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                    rows="4"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Sex */}
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium mb-1">
                    Sex:
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={teacher.sex}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.sex ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                </div>

                {/* Native Status */}
                <div>
                  <label htmlFor="nativeStatus" className="block text-sm font-medium mb-1">
                    Native Status:
                  </label>
                  <select
                    id="nativeStatus"
                    name="nativeStatus"
                    value={teacher.nativeStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.nativeStatus ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  >
                    <option value="">Select Native Status</option>
                    <option value="Native">Native</option>
                    <option value="Non-native">Non-native</option>
                  </select>
                  {errors.nativeStatus && <p className="text-red-500 text-sm mt-1">{errors.nativeStatus}</p>}
                </div>

                {/* Joining Date */}
                <div>
                  <label htmlFor="joiningDate" className="block text-sm font-medium mb-1">
                    Joining Date:
                  </label>
                  <input
                    id="joiningDate"
                    type="date"
                    name="joiningDate"
                    value={teacher.joiningDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.joiningDate ? 'border-red-500' : 'border-[#b19d60]'
                    } rounded-md shadow-sm focus:outline-none dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:ring-[#b19d60]`}
                  />
                  {errors.joiningDate && <p className="text-red-500 text-sm mt-1">{errors.joiningDate}</p>}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-md bg-transparent hover:bg-red-500 hover:text-white focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#b19d60] text-white rounded-md hover:bg-[#8a7f51] focus:outline-none"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateTeacherForm;