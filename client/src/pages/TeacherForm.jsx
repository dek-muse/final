import React, { useState, useEffect } from 'react';
import { storage } from '../firebase'; // Hubi inaad saxdo dariiqa import-ga haddii loo baahdo
import { ref, uploadBytes, getDownloadURL, getStorage, } from 'firebase/storage';

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
  const [qualificationsFile, setQualificationsFile] = useState(null); // Define this state

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
      // Update the form data with the selected file
      setFormData((prevData) => ({
        ...prevData,
        picture: file, // Assuming you want to save the file as "picture"
      }));

      // Also set the qualificationsFile state for upload
      setQualificationsFile(file);

      // Clear any previous error related to qualifications
      setErrors((prevErrors) => ({
        ...prevErrors,
        qualifications: null,
      }));

      // Optional: Log the selected file for debugging
      // console.log('Selected file:', file.name);
    }
  };

  const uploadQualifications = async () => {
    if (!qualificationsFile) {
      console.error("No qualifications file selected.");
      return null; // Return early if no file is selected
    }

    const storage = getStorage(); // Initialize Firebase Storage
    const storageRef = ref(storage, `qualifications/${qualificationsFile.teacher.name}`); // Create a reference to the file location

    try {
      console.log('Uploading qualifications to Firebase Storage...');
      await uploadBytes(storageRef, qualificationsFile); // Upload the file
      console.log('Qualifications uploaded successfully:', qualificationsFile.name);

      // Get the download URL
      const qualificationsURL = await getDownloadURL(storageRef);
      console.log('Qualifications download URL:', qualificationsURL);
      return qualificationsURL; // Return the URL
    } catch (error) {
      console.error('Error uploading qualifications:', error);
      throw error; // Rethrow the error for further handling in the calling function
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
      console.log(`Calculated Salary: ${calculatedSalary}`);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submission initiated with data:', formData);

    // Call handleCheckboxChange if needed
    // handleCheckboxChange(); // Uncomment if this function needs to be called

    // Validate the form before submitting
    if (!validate()) {
      console.log('Validation failed with errors:', errors);
      return; // Exit if validation fails
    }

    setLoading(true); // Start loading state
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    let pictureURL = '';
    let qualificationsURL = '';

    // Handle qualifications upload and get the URL
    try {
      qualificationsURL = await uploadQualifications(); // Function to upload qualifications
      if (!qualificationsURL) {
        throw new Error("Failed to upload qualifications."); // Handle if the upload fails
      }
    } catch (error) {
      console.error("Error uploading qualifications: ", error);
      setError('Error uploading qualifications.'); // Set error message
      setLoading(false); // Stop loading state
      return; // Exit to prevent further actions
    }

    // Handle picture upload if it exists
    if (formData.picture) { 
      const storageRef = ref(storage, `images/${formData.picture.teacher.name}`);
      console.log('Uploading picture to Firebase Storage...');

      try {
        await uploadBytes(storageRef, formData.picture);
        console.log('Picture uploaded successfully:', formData.picture.name);
        pictureURL = await getDownloadURL(storageRef);
        console.log('Picture download URL:', pictureURL);
      } catch (error) {
        console.error('Error uploading picture:', error);
        setError('Error uploading picture.'); // Set error message
        setLoading(false); // Stop loading state
        return; // Exit to prevent further actions
      }
    }

    // Prepare the data to send to the API
    const dataToSend = {
      ...formData,
      qualifications: qualificationsURL, // Add qualifications URL to form data
      picture: pictureURL, // Add picture URL to form data
      createdBy: currentUser._id, // Add the createdBy field
    };

    console.log('Data to send to API:', JSON.stringify(dataToSend, null, 2));

    // Send data to your TeacherForm API
    try {
      const response = await fetch('https://finalbakend.vercel.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent:', responseData);
        setSuccess('Form submitted successfully!'); // Set success message
        // Optionally reset the form
        resetForm(); // Reset the form fields
        setQualificationsFile(null); // Reset qualifications file
      } else {
        const responseText = await response.text();
        console.error('Response error message:', responseText);
        setError('Error sending data .'); // Set error message
      }

      console.log('API response status:', response.status);
    } catch (error) {
      console.error('Error sending data to API:', error);
      setError('Error sending data .'); // Set error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

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
    <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-2xl border shadow-[#b19d60] border-[#b19d60]">
      <h1 className="text-3xl font-bold mb-6">Teacher Form</h1>

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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@domain.com"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>

            {/* Mobile Field */}
            <div className="mb-4">
              <label htmlFor="mobile" className="block font-semibold mb-1">
                Mobile:
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="e.g., +1234567890"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.mobile}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.mobile && <p style={{ color: 'red' }}>{errors.mobile}</p>}
            </div>

            {/* Transfer Field */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Transfer:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="transfer"
                    value="yes"
                    checked={formData.transfer === true}
                    onChange={() => setFormData({ ...formData, transfer: true })} // Set to true
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled={loading}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="transfer"
                    value="no"
                    checked={formData.transfer === false}
                    onChange={() => setFormData({ ...formData, transfer: false })} // Set to false
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled={loading}
                  />
                  <span>No</span>
                </label>
              </div>

              {/* Conditional Transfer Reason Field */}
              {formData.transfer === true && (
                <div className="mt-2">
                  <label htmlFor="transferReason" className="block font-semibold mb-1">
                    Transfer Reason:
                  </label>
                  <input
                    type="text"
                    id="transferReason"
                    name="transferReason"
                    placeholder='Enter reason for transfer'
                    value={formData.transferReason}
                    onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                    className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={loading}
                  />
                  {errors.transferReason && <p style={{ color: 'red' }}>{errors.transferReason}</p>}
                </div>
              )}
            </div>

            {/* Region Dropdown */}
            <div className="mb-4">
              <label htmlFor="region" className="block font-semibold mb-1">
                Zone:
              </label>
              <select
                id="region"
                name="region"
                placeholder="Select your region"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {errors.region && <p style={{ color: 'red' }}>{errors.region}</p>}
            </div>

            {/* District Dropdown */}
            <div className="mb-4">
              <label htmlFor="district" className="block font-semibold mb-1">
                District:
              </label>
              <select
                id="district"
                name="district"
                placeholder="Select your district"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.region || loading} // Disable if no region selected or loading
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
              {errors.district && <p style={{ color: 'red' }}>{errors.district}</p>}
            </div>

            {/* Sex Checkboxes */}
            {/* Sex Field */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Sex:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sex"
                    value="Male"
                    checked={formData.sex === 'Male'}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled={loading}
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sex"
                    value="Female"
                    checked={formData.sex === 'Female'}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled={loading}
                  />
                  <span>Female</span>
                </label>
              </div>
              {errors.sex && <p style={{ color: 'red' }}>{errors.sex}</p>}
            </div>

            {/* Native Status Checkboxes */}
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-gray-700">Native Status:</label>
              <div className="flex items-center mb-2">
                <label className="flex items-center mr-4">
                  <input
                    type="radio"
                    name="nativeStatus"
                    value="Region"
                    checked={formData.nativeStatus === 'Region'}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">Region</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nativeStatus"
                    value="Non-region"
                    checked={formData.nativeStatus === 'Non-region'}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">Non-region</span>
                </label>
              </div>
              {errors.nativeStatus && <p className="text-red-600 text-sm mt-1">{errors.nativeStatus}</p>}
            </div>

            {/* Health Status */}
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Health Status:</label>
              <div className="flex items-center mb-2">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="healthStatus"
                    value="Yes"
                    checked={formData.healthStatus === 'Yes'}
                    onChange={handleChange}
                    className="mr-1"
                    disabled={loading}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="healthStatus"
                    value="No"
                    checked={formData.healthStatus === 'No'}
                    onChange={handleChange}
                    className="mr-1"
                    disabled={loading}
                  />
                  No
                </label>
              </div>
              {errors.healthStatus && <p className="text-red-600">{errors.healthStatus}</p>}
            </div>

            {formData.healthStatus === 'No' && (
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Special Need Detail:</label>
                <div className="flex items-center mb-2">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="specialNeedDetail"
                      value="Special Need"
                      checked={formData.specialNeedDetail === 'Special Need'}
                      onChange={handleChange}
                      className="mr-1"
                      disabled={loading}
                    />
                    Special Need
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="specialNeedDetail"
                      value="Dead"
                      checked={formData.specialNeedDetail === 'Dead'}
                      onChange={handleChange}
                      className="mr-1"
                      disabled={loading}
                    />
                    Dead
                  </label>
                </div>
                {errors.specialNeedDetail && <p className="text-red-600">{errors.specialNeedDetail}</p>}
              </div>
            )}

            {formData.healthStatus === 'No' && formData.specialNeedDetail === 'Special Need' && (
              <div className="mb-4">
                <label htmlFor="specialNeed" className="block mb-2 text-gray-700">Select Special Need:</label>
                <select
                  name="specialNeed"
                  value={formData.specialNeed}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={loading}
                >
                  <option value="">Select a special need</option>
                  {SPECIAL_NEED_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.specialNeed && <p className="text-red-600">{errors.specialNeed}</p>}
              </div>
            )}

            {formData.healthStatus === 'No' && (formData.specialNeedDetail === 'Dead' || formData.specialNeedDetail === 'Special Need') && (
              <div className="mb-4">
                <label htmlFor="healthNote" className="block mb-2 text-gray-700">Health Note:</label>
                <textarea
                  name="healthNote"
                  value={formData.healthNote}
                  onChange={handleChange}
                  placeholder='Enter health note'
                  className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={loading}
                />
                {errors.healthNote && <p className="text-red-600">{errors.healthNote}</p>}
              </div>
            )}

            {/* Birth Date Field */}
            <div className="mb-4">
              <label htmlFor="birthDate" className="block font-semibold mb-1">
                Birth Date:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                placeholder="Select your birth date"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.birthDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate}</p>}
            </div>

            {/* Profile Picture Upload */}
            <div className="mb-4">
              <label htmlFor="picture" className="block font-semibold mb-1">
                Profile Picture:
              </label>
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                placeholder="Upload your profile picture"
                className="w-full"
                onChange={handleFileChange}
                required
                disabled={loading}
              />
              {errors.picture && <p style={{ color: 'red' }}>{errors.picture}</p>}
            </div>
          </div>

          {/* Xirfadeedka (Professional Information): */}
          <div>
            {/* Education Level Dropdown */}
            <div className="mb-4">
              <label htmlFor="educationLevel" className="block font-semibold mb-1">
                Education Level:
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                placeholder="Select your education level"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {errors.educationLevel && <p style={{ color: 'red' }}>{errors.educationLevel}</p>}
            </div>

            {/* Experience Dropdown */}
            <div className="mb-4">
              <label htmlFor="experience" className="block font-semibold mb-1">
                Years of Experience:
              </label>
              <select
                id="experience"
                name="experience"
                placeholder="Select your years of experience"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {errors.experience && <p style={{ color: 'red' }}>{errors.experience}</p>}
            </div>

            {/* Teacher Type Dropdown */}
            <div className="mb-4">
              <label htmlFor="teacherType" className="block font-semibold mb-1">
                Teacher Type:
              </label>
              <select
                id="teacherType"
                name="teacherType"
                placeholder="Select teacher type"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {errors.teacherType && <p style={{ color: 'red' }}>{errors.teacherType}</p>}
            </div>

            {/* Joining Date Field */}
            <div className="mb-4">
              <label htmlFor="joiningYear" className="block font-semibold mb-1">
                Joining Year:
              </label>
              <select
                name="joiningYear"
                id="joiningYear"
                value={formData.joiningDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <div className="mb-4">
              <label htmlFor="subjectsLearned" className="block font-semibold mb-1">
                Subjects Learned:
              </label>
              <select
                id="subjectsLearned"
                name="subjectsLearned"
                placeholder="Select subjects you have learned"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {errors.subjectsLearned && <p style={{ color: 'red' }}>{errors.subjectsLearned}</p>}
            </div>

            {/* Subjects Taught Dropdown */}
            <div className="mb-4">
              <label htmlFor="subjectsTech" className="block font-semibold mb-1">
                Subjects Taught:
              </label>
              <select
                id="subjectsTech"
                name="subjectsTech"
                placeholder="Select subjects you teach"
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {errors.subjectsTech && <p style={{ color: 'red' }}>{errors.subjectsTech}</p>}
            </div>

            {/* Salary Field (Read-Only) */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Salary:
              </label>
              <input
                type="text"
                name="salary"
                placeholder="Salary will be calculated automatically"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out`}
                value={formData.salary}
                readOnly
              />
              {errors.salary && <p style={{ color: 'red' }}>{errors.salary}</p>}
            </div>

            {/* Description Field */}
            <div className="mb-5">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter a brief description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white    focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-gray-700">Qualifications:</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded w-full"
                disabled={loading}

              />
              {errors.qualifications && <p className="text-red-600 text-sm mt-1">{errors.qualifications}</p>}
            </div>
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
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