import React, { useState, useEffect } from 'react';
import { storage } from '../firebase'; // Hubi inaad saxdo dariiqa import-ga haddii loo baahdo
import { ref, uploadBytes, getDownloadURL, getStorage, } from 'firebase/storage';
import { SiReacthookform } from "react-icons/si";

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TeacherForm = () => {
  // Helitaanka isticmaalaha hadda jira ee ka imanaya Redux
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate();

  // Qeexitaanka Goobaha iyo Degmooyinka
  const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];

  const DISTRICTS = {
    'Afdheer': ['Hargeelle', 'Dhaawac', 'Baarey', 'Limey Galbeed', 'Raaso (City)', 'Dollow Bay (City)', 'Ceelkari', 'Qooxle', 'Godgod', 'Dhiif'],
    'Daawo': ['Qadhadhumo', 'Hudet', 'Mooyale (City)', 'Mubarak', 'Ceel-huur'],
    'Doolo': ['Daraatole', 'Wardheer- Xarunta Gobalka (City)', 'Danood', 'Galxumur', 'Galaadi', 'Bookh', 'Lehel-yucub', 'Ceel-sheekh', 'Dhaqandhoor'],
    'Erar': ['Fiiq (City)', 'Xamaro', 'Waangay', 'Lagahida', 'Yoxob', 'Salaxaad', 'Mayu-Muluqo', 'Qubi', 'Ceel-bi'],
    'Faafan': ['Tuliguuled', 'Goljano (City)', 'Harooreys', 'Shabeleey', 'Harawo', 'Mula', 'Qabribayax (City)', 'Xarshin', 'Gursum', 'Babili', 'Awbare', 'Gabiley', 'Jigjiga (City)'],
    'Jarar': ['Daroor', 'Aware', 'Dhagax-buur (City)', 'Dhagax-madow', 'Gunagado', 'Gashamo', 'Birqod', 'Dig', 'Bilcil buur', 'Araarso', 'Yoocaale', 'Dhuure', 'Higlo'],
    'Liibaan': ['Filtu (City)', 'Dollo Adow', 'Qarsadula', 'Gura-dhamoole', 'Goora-Baqaqsa', 'Boqol maayo', 'Dekasuftu', 'Xamur'],
    'Nogob': ['Dhuxun', 'Gerbo (City)', 'Xaraarey', 'Ayun', 'Hor-shagah', 'Segeg', 'Ceelweyne', 'Karin', 'Dabqudhac'],
    'Qoraxay': ['Qabridahar (City)', 'Shilaabo', 'Dhobaweyn', 'Shaygoosh', 'Marsin', 'Ceel-ogaden (City)', 'Las-dharkeynle', 'Boodaley', 'Higlooley', 'Goglo/kudunbuur', 'Galadiid'],
    'Shabelle': ['Dhanan', 'Godey (City)', 'Qalafe', 'Beer caano', 'Feerfer', 'Iimey bari', 'Mustaxiil', 'Elele', 'Cadaadle', 'Abaqarow', 'Toosweyn'],
    'Sitti': ['Afdem', 'Ayshaca (City)', 'Mieso', 'Dembel', 'Erar', 'Shiniile (City)', 'Hadhagale', 'Biki', 'Geblalu', 'Dhuunya', 'Tuli Guled']
  };

  // Qeexitaanka Heerarka Waxbarashada iyo Kala-duwanaanshaha Mushaharka
  const EDUCATION_LEVELS = ['TTI', 'DIP', 'Deg', 'MA'];

  const SALARY_RANGES = {
    TTI: {
      'new employee': 3934,
      '2 year exp': 4609,
      '5 year exp': 5358,
      '8 year exp': 6193,
      '11 year exp': 7071,
      '14 year exp': 8017,
      '17 year exp': 9056,
    },
    DIP: {
      'new employee': 4609,
      '2 year exp': 5358,
      '5 year exp': 6193,
      '8 year exp': 7071,
      '11 year exp': 8017,
      '14 year exp': 9056,
      '17 year exp': 10150,
    },
    Deg: {
      'new employee': 5358,
      '2 year exp': 6193,
      '5 year exp': 7071,
      '8 year exp': 8017,
      '11 year exp': 9056,
      '14 year exp': 10150,
      '17 year exp': 11305,
    },
    MA: {
      'new employee': 6193,
      '2 year exp': 7071,
      '5 year exp': 8017,
      '8 year exp': 9056,
      '11 year exp': 10150,
      '14 year exp': 11305,
      '17 year exp': 12579,
    },
  };

  // Qeexitaanka Xulashooyinka Jinsi iyo Heerka Dhalashada
  const sexOptions = ['Male', 'Female'];
  const nativeStatusOptions = ['Region', 'Non-region'];
  const teacherTypes = ['Primary', 'Preprimary', 'Secondary', 'College', 'Boarding'];

  // Qeexitaanka Mawduucyada
  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'English' },
    { id: 4, name: 'History' },
    // Ku dar mawduucyo kale sida loo baahan yahay
  ];
  const SPECIAL_NEED_OPTIONS = [
    'Hearing Impairment',
    'Vision Impairment',
    'Physical Disability',
    'Learning Disability',
    'Other'
  ];
  const subjectsList = subjects.map(subject => subject.name); // Liiska magacyada mawduucyada

  // Dejinta State-ka Foomka
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    picture: null,
    region: '',
    district: '',
    educationLevel: '',
    experience: '',
    sex: '',
    nativeStatus: '', // Initialize as an empty string
    teacherType: '',
    joiningDate: '',
    birthDate: '',
    subjectsLearned: '',
    subjectsTech: '',
    salary: '',
    description: '',
    healthStatus: 'Yes', // Initialized as an empty string
    healthNote: '',   // Initialized as an empty string
    transfer: false,  // Change to Boolean
    transferReason: '', // Initialized as an empty string
    teacherId: 1,
    specialNeedDetail: '', // New field to capture special need details
    qualifications: '' // URL of the qualifications file


    // ... (initialize other fields)
  });

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false); // State-ka Loading
  const [error, setError] = useState(''); // State-ka Qalad
  const [errors, setErrors] = useState({}); // State-ka Validation Errors
  const [success, setSuccess] = useState(''); // State-ka Ogeysiiska Guusha
 
  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // This works for strings (like select and radio buttons)
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedValue = checked
      ? [...formData[name], value]
      : formData[name].filter((item) => item !== value);

    setFormData({
      ...formData, [name]: updatedValue,
      transfer: e.target.checked,
      transferReason: '', // Reset fields when toggled
      newRegion: '',
      newDistrict: ''
    });
  };

  // Function to handle file change
const handleFileChange = (e) => {
  const file = e.target.files[0]; // Get the first file from the input
  if (file) {
      // console.log('Selected file:', file.name); // Log the selected file for debugging

      // Update the form data with the selected file
      setFormData((prevData) => ({
          ...prevData,
          picture: file, // Assuming you want to save the file as "picture"
      }));

      // Clear any previous error related to the picture
      setErrors((prevErrors) => ({
          ...prevErrors,
          picture: null,
      }));

      // console.log('Form data updated with selected file:', { ...formData, picture: file }); // Log the updated form data
  } else {
      // console.warn('No file selected.'); // Warn if no file was selected
  }
};

const handleQualificationsChange = (e) => {
  const file = e.target.files[0]; // Get the first file from the input
  if (file) {
    // console.log('Selected qualifications file:', file.name); // Log for debugging
    setFormData((prevData) => ({
      ...prevData,
      qualifications: file, // Store the file in formData
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      qualifications: null, // Clear any previous error
    }));
  } else {
    // console.warn('No qualifications file selected.'); // Warn if no file was selected
  }
};


  // Function-ka Dib-u-dejinta Foomka
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      picture: null,
      region: '',
      district: '',
      educationLevel: '',
      experience: '',
      sex: '',
      nativeStatus: '',
      teacherType: '',
      joiningDate: '',
      birthDate: '',
      subjectsLearned: '',
      subjectsTech: '',
      salary: '',
      description: '',
      healthStatus: '', // Initialized as an empty string
      healthNote: '',   // Initialized as an empty string
      transfer: false,  // Change to Boolean
      transferReason: '', // Initialized as an empty string
      specialNeedDetail: '', // New field to capture special need details
      qualifications: '', // URL of the qualifications file
      teacherId: 1

      // ... (initialize other fields)
    });
    navigate('/teacher/form');
    setDistricts([]); // Nadiifi Degmooyinka
    setErrors({}); // Nadiifi Validation Errors
    setSuccess(''); // Nadiifi Ogeysiiska Guusha
    setError(''); // Nadiifi Qaladka
  };

  // Function-ka Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobile) newErrors.mobile = 'Mobile is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.subjectsLearned) newErrors.subjectsLearned = 'Subjects Learned are required';
    if (!formData.subjectsTech) newErrors.subjectsTech = 'Subjects Tech are required';
    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.nativeStatus) newErrors.nativeStatus = 'Native Status is required';
    if (!formData.educationLevel) newErrors.educationLevel = 'Education Level is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth Date is required';
    // if (!formData.description) newErrors.description = 'Birth Date is required';
    // Haddii aad rabto inaad ku darto validate for salary, hubi inuu si sax ah u xisaabmay

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function-ka Xisaabinta Mushaharka
  const getSalary = (educationLevel, experience) => {
    if (SALARY_RANGES[educationLevel] && SALARY_RANGES[educationLevel][experience]) {
      return SALARY_RANGES[educationLevel][experience];
    } else {
      return 'Salary data not available for this combination.';
    }
  };

  // useEffect si loo cusbooneysiiyo Mushaharka marka Education Level ama Experience isbedelaan
  useEffect(() => {
    if (formData.educationLevel && formData.experience) {
      const calculatedSalary = getSalary(formData.educationLevel, formData.experience);
      setFormData(prevData => ({
        ...prevData,
        salary: calculatedSalary,
      }));
      // console.log(`Calculated Salary: ${calculatedSalary}`);
    } else {
      setFormData(prevData => ({
        ...prevData,
        salary: '',
      }));
    }
  }, [formData.educationLevel, formData.experience]);

  // useEffect si loo cusbooneysiiyo liiska Degmooyinka marka Region isbedelaan
  useEffect(() => {
    if (formData.region) {
      setDistricts(DISTRICTS[formData.region] || []);
      setFormData(prevData => ({
        ...prevData,
        district: '', // Dib u dejinta District marka Region isbedesho
      }));
    } else {
      setDistricts([]);
    }
  }, [formData.region]);

  // Function-ka Dirista Foomka
 // Function to handle form submission
 const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission
  setLoading(true); // Set loading state to true
  setError(''); // Reset error state
  setSuccess(''); // Reset success state

  // Validate the form before submission
  if (!validate()) {
    setLoading(false);
    return; // Exit if validation fails
  }

  try {
    // console.log('Submitting form with data:', formData); // Log the form data before submission

    // Upload the profile picture if it exists
    let pictureURL = ''; // Initialize pictureURL
    if (formData.picture) { // Check if picture exists in formData
      const picturePath = `profilePictures/${formData.picture.name}`; // Define the storage path
      const pictureRef = ref(storage, picturePath); // Create a reference to the file
      // console.log(`Uploading picture to path: ${picturePath}`); // Log the upload path
      await uploadBytes(pictureRef, formData.picture); // Upload the file
      pictureURL = await getDownloadURL(pictureRef); // Get the download URL
      // console.log('Picture uploaded successfully, URL:', pictureURL); // Log the picture URL
    }

    // Upload the qualifications file if it exists
    let qualificationsURL = '';
    if (formData.qualifications) {
      const qualificationsPath = `qualifications/${formData.qualifications.name}`; // Define the storage path
      const qualificationsRef = ref(storage, qualificationsPath); // Create a reference to the file
      // console.log(`Uploading qualifications to path: ${qualificationsPath}`); // Log the upload path
      await uploadBytes(qualificationsRef, formData.qualifications); // Upload the file
      qualificationsURL = await getDownloadURL(qualificationsRef); // Get the download URL
      // console.log('Qualifications file uploaded successfully, URL:', qualificationsURL); // Log the qualifications URL
    }

    // Prepare the data to send
    const dataToSend = {
      ...formData,
      qualifications: qualificationsURL, // Use the URL of the uploaded qualifications file
      picture: pictureURL, // Use the URL of the uploaded picture
      createdBy: currentUser._id,
    };

    // Send data to the server
    // console.log('Sending data to the server:', dataToSend); // Log the data being sent
    const response = await fetch('https://finalbakend.vercel.app/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend), // Send as JSON
    });

    // Check for response errors
    if (!response.ok) {
      // console.error('Network response was not ok', response.statusText); // Log response error
      throw new Error('Network response was not ok');
    }

    // If successful, set success message
    setSuccess('Form submitted successfully!');
    // console.log('Form submission successful'); // Log successful submission
    resetForm(); // Reset form after successful submission
  } catch (err) {
    // console.error('Error during form submission:', err); // Log the error
    setError('Error submitting the form.'); // Set error message
  } finally {
    setLoading(false); // Reset loading state
  }
};


// Update the list of districts based on the selected region
useEffect(() => {
  if (formData.region) {
      const updatedDistricts = DISTRICTS[formData.region] || [];
      setDistricts(updatedDistricts); // Update districts based on selected region
      // console.log('Districts updated based on region:', updatedDistricts); // Log the updated districts
  } else {
      setDistricts([]); // Clear districts if no region selected
      // console.log('No region selected, clearing districts'); // Log that districts are cleared
  }
}, [formData.region]);

  // Generate a list of years from 1900 to the current year
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="max-w-7xl mx-auto p-8  ">
 
      <h1 className="text-4xl font-bold mb-6 flex gap-4 items-center">
        < SiReacthookform />
        Teacher Form
        </h1>

      {loading && <p>
        <div className="min-h-screen flex items-center justify-center -mt-6">
          <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 border-4 border-transparent text-[#f27405] text-4xl md:text-5xl lg:text-6xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-4 border-transparent text-2xl md:text-3xl lg:text-4xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
            </div>
          </div>
        </div>
      </p>}

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}

      <form onSubmit={handleSubmit}>
        {/* Shaqsiga (Personal Information): */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 '>
        <div className="space-y-6">
  {/* Name Field */}
  <div>
    <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Full Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      placeholder="Enter your full name"
      className={`w-full px-4 py-3 rounded-lg shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300 dark:border-gray-600`}
      value={formData.name}
      onChange={handleChange}
      required
      disabled={loading}
    />
    {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
  </div>

  {/* Email Field */}
  <div>
    <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Email:
    </label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="example@domain.com"
      className={`w-full px-4 py-3 rounded-lg shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300 dark:border-gray-600`}
      value={formData.email}
      onChange={handleChange}
      required
      disabled={loading}
    />
    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
  </div>

  {/* Mobile Field */}
  <div>
    <label htmlFor="mobile" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Mobile:
    </label>
    <input
      type="tel"
      id="mobile"
      name="mobile"
      placeholder="e.g., +1234567890"
      className={`w-full px-4 py-3 rounded-lg shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300 dark:border-gray-600`}
      value={formData.mobile}
      onChange={handleChange}
      required
      disabled={loading}
    />
    {errors.mobile && <p className="mt-2 text-sm text-red-500">{errors.mobile}</p>}
  </div>

  {/* Transfer Field */}
  <div>
    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Transfer:
    </label>
    <div className="flex items-center space-x-6">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="transfer"
          value="yes"
          checked={formData.transfer === true}
          onChange={() => setFormData({ ...formData, transfer: true })}
          className="form-radio h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
          disabled={loading}
        />
        <span className="text-lg">Yes</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="transfer"
          value="no"
          checked={formData.transfer === false}
          onChange={() => setFormData({ ...formData, transfer: false })}
          className="form-radio h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
          disabled={loading}
        />
        <span className="text-lg">No</span>
      </label>
    </div>

    {/* Transfer Reason */}
    {formData.transfer === true && (
      <div className="mt-4">
        <label htmlFor="transferReason" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
          Transfer Reason:
        </label>
        <input
          type="text"
          id="transferReason"
          name="transferReason"
          placeholder="Enter reason for transfer"
          value={formData.transferReason}
          onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300 dark:border-gray-600`}
          disabled={loading}
        />
        {errors.transferReason && <p className="mt-2 text-sm text-red-500">{errors.transferReason}</p>}
      </div>
    )}
  </div>

  {/* Region Dropdown */}
  <div>
    <label htmlFor="region" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Zone:
    </label>
    <select
      id="region"
      name="region"
      placeholder="Select your region"
      className={`w-full px-4 py-3 rounded-lg shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300 dark:border-gray-600`}
      value={formData.region}
      onChange={handleChange}
      required
      disabled={loading}
    >
      <option value="" disabled>
        Select a Zone
      </option>
      {REGIONS.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
    {errors.region && <p className="mt-2 text-sm text-red-500">{errors.region}</p>}
  </div>

  {/* District Dropdown */}
  <div>
    <label htmlFor="district" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      District:
    </label>
    <select
      id="district"
      name="district"
      placeholder="Select your district"
      className={`w-full px-4 py-3 rounded-lg shadow-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300 dark:border-gray-600`}
      value={formData.district}
      onChange={handleChange}
      required
      disabled={!formData.region || loading}
    >
      <option value="" disabled>
        Select a district
      </option>
      {districts.map((district) => (
        <option key={district} value={district}>
          {district}
        </option>
      ))}
    </select>
    {errors.district && <p className="mt-2 text-sm text-red-500">{errors.district}</p>}
  </div>

  {/* Sex Checkboxes */}
  <div>
    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Sex:
    </label>
    <div className="flex items-center space-x-6">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="sex"
          value="Male"
          checked={formData.sex === 'Male'}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          className="form-radio h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
          disabled={loading}
        />
        <span className="text-lg">Male</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="sex"
          value="Female"
          checked={formData.sex === 'Female'}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          className="form-radio h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
          disabled={loading}
        />
        <span className="text-lg">Female</span>
      </label>
    </div>
    {errors.sex && <p className="mt-2 text-sm text-red-500">{errors.sex}</p>}
  </div>
  {/* Native Status Checkboxes */}
<div>
  <label className="block font-semibold text-gray-700 mb-2">
    Native Status:
  </label>
  <div className="flex space-x-6">
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="nativeStatus"
        value="Region"
        checked={formData.nativeStatus === 'Region'}
        onChange={handleChange}
        disabled={loading}
        className="form-radio h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
      <span className="text-gray-700">Region</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="nativeStatus"
        value="Non-region"
        checked={formData.nativeStatus === 'Non-region'}
        onChange={handleChange}
        disabled={loading}
        className="form-radio h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
      <span className="text-gray-700">Non-region</span>
    </label>
  </div>
  {errors.nativeStatus && (
    <p className="text-red-600 text-sm mt-2">{errors.nativeStatus}</p>
  )}
</div>

{/* Health Status */}
  <div>
    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Health Status:
    </label>
    <div className="flex items-center space-x-6">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="healthStatus"
          value="Yes"
          checked={formData.healthStatus === 'Yes'}
          onChange={handleChange}
          className="form-radio h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
          disabled={loading}
        />
        <span className="text-lg">Yes</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="healthStatus"
          value="No"
          checked={formData.healthStatus === 'No'}
          onChange={handleChange}
          className="form-radio h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
          disabled={loading}
        />
        <span className="text-lg">No</span>
      </label>
    </div>
      {/* Birth Date Field */}
  <div className='mt-3'>
    <label htmlFor="birthDate" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Birth Date:
    </label>
    <input
      type="date"
      id="birthDate"
      name="birthDate"
      placeholder="Select your birth date"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.birthDate}
      onChange={handleChange}
      required
      disabled={loading}
    />
    {errors.birthDate && <p className="text-sm text-red-500 mt-1">{errors.birthDate}</p>}
  </div>

  {/* Profile Picture Upload */}
  <div className='mt-3'>
    <label htmlFor="picture" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Profile Picture:
    </label>
    <input
      type="file"
      id="picture"
      name="picture"
      accept="image/*"
      className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      onChange={handleFileChange}
      required
      disabled={loading}
    />
    {errors.picture && <p className="text-sm text-red-500 mt-1">{errors.picture}</p>}
  </div>
  </div>
  

  {/* Submit Button */}
   
</div>



          {/* Xirfadeedka (Professional Information): */}
          <div className="space-y-6">
  {/* Education Level Dropdown */}
  <div>
    <label htmlFor="educationLevel" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Education Level:
    </label>
    <select
      id="educationLevel"
      name="educationLevel"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.educationLevel}
      onChange={handleChange}
      required
      disabled={loading}
    >
      <option value="" disabled>
        Select education level
      </option>
      {EDUCATION_LEVELS.map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
      ))}
    </select>
    {errors.educationLevel && <p className="text-sm text-red-500 mt-1">{errors.educationLevel}</p>}
  </div>

  {/* Experience Dropdown */}
  <div>
    <label htmlFor="experience" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Years of Experience:
    </label>
    <select
      id="experience"
      name="experience"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.experience}
      onChange={handleChange}
      required
      disabled={loading}
    >
      <option value="" disabled>
        Select experience
      </option>
      {Object.keys(SALARY_RANGES[formData.educationLevel] || {}).map((exp) => (
        <option key={exp} value={exp}>
          {exp}
        </option>
      ))}
    </select>
    {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience}</p>}
  </div>

  {/* Teacher Type Dropdown */}
  <div>
    <label htmlFor="teacherType" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Teacher Type:
    </label>
    <select
      id="teacherType"
      name="teacherType"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.teacherType}
      onChange={handleChange}
      required
      disabled={loading}
    >
      <option value="" disabled>
        Select teacher type
      </option>
      {teacherTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
    {errors.teacherType && <p className="text-sm text-red-500 mt-1">{errors.teacherType}</p>}
  </div>

  {/* Joining Date Field */}
  <div>
    <label htmlFor="joiningYear" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Joining Year:
    </label>
    <select
      name="joiningYear"
      id="joiningYear"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.joiningDate}
      onChange={handleChange}
    >
      <option value="">Select a year</option>
      {generateYears().map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>

  {/* Subjects Learned Dropdown */}
  <div>
    <label htmlFor="subjectsLearned" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Subjects Learned:
    </label>
    <select
      id="subjectsLearned"
      name="subjectsLearned"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.subjectsLearned}
      onChange={handleChange}
      required
      disabled={loading}
    >
      <option value="" disabled>
        Select subjects learned
      </option>
      {subjectsList.map((subject) => (
        <option key={subject} value={subject}>
          {subject}
        </option>
      ))}
    </select>
    {errors.subjectsLearned && <p className="text-sm text-red-500 mt-1">{errors.subjectsLearned}</p>}
  </div>

  {/* Subjects Taught Dropdown */}
  <div>
    <label htmlFor="subjectsTech" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Subjects Taught:
    </label>
    <select
      id="subjectsTech"
      name="subjectsTech"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.subjectsTech}
      onChange={handleChange}
      required
      disabled={loading}
    >
      <option value="" disabled>
        Select subjects taught
      </option>
      {subjectsList.map((subject) => (
        <option key={subject} value={subject}>
          {subject}
        </option>
      ))}
    </select>
    {errors.subjectsTech && <p className="text-sm text-red-500 mt-1">{errors.subjectsTech}</p>}
  </div>

  {/* Salary Field (Read-Only) */}
  <div>
    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Salary:
    </label>
    <input
      type="text"
      name="salary"
      placeholder="Salary will be calculated automatically"
      className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
      value={formData.salary}
      readOnly
    />
    {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary}</p>}
  </div>

  {/* Description Field */}
  <div>
    <label htmlFor="description" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Description:
    </label>
    <textarea
      id="description"
      name="description"
      placeholder="Enter a brief description"
      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      value={formData.description}
      onChange={handleChange}
      disabled={loading}
    />
  </div>

  {/* Qualifications Field */}
  <div>
    <label htmlFor="qualifications" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
      Qualifications (PDF/Word):
    </label>
    <input
      type="file"
      name="qualifications"
      accept=".pdf, .doc, .docx"
      onChange={handleQualificationsChange}
      className="w-full px-4 py-2 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.qualifications && <p className="text-sm text-red-500 mt-1">{errors.qualifications}</p>}
  </div>
</div>


        </div>

        {/* Submit and Reset Buttons */}
<div className="flex justify-between space-x-4 mt-6">
  <button
    type="submit"
    className={`w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105`}
    disabled={loading}
  >
    {loading ? 'Submitting...' : 'Submit'}
  </button>

  <button
    type="button"
    className="w-full sm:w-auto bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
    onClick={resetForm}
    disabled={loading}
  >
    Reset
  </button>
</div>

      </form>
    </div>


  );
};

export default TeacherForm;