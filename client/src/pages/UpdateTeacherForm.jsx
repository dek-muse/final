import React, { useState, useEffect } from 'react';
import { storage } from '../firebase'; // Ensure the import path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SiReacthookform } from 'react-icons/si';

const UpdateTeacherForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using react-router for dynamic routing
  const [previousPictureURL, setPreviousPictureURL] = useState('');
  const [previousDistrict, setPreviousDistrict] = useState('');
  const [previousBirthDate, setPreviousBirthDate] = useState('');
  const [previousJoiningDate, setPreviousJoiningDate] = useState('');
  const [picturePreview, setPicturePreview] = useState(null); // State for picture preview
  const [previousQualificationsURL, setPreviousQualificationsURL] = useState(''); // Add state for previous qualifications URL


  // Regions and Districts
  const REGIONS = ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'];


  const DISTRICTS = {
    'Afdheer': ['Hargeelle', 'Dhaawac', 'Baarey', 'limey galbeed', 'Raaso', 'Dollow Bay', 'Ceelkari', 'Qooxle', 'Godgod'],
    'Daawo': ['Qadhadhumo', 'Hudet', 'Mooyale', 'Mubarak',],
    'Doolo': ['Daraatole', 'Wardheer- Xarunta Gobalka', 'Danood', 'Galxumur', 'Galaadi', 'Bookh', 'Lehel-yucub'],
    'Erar': ['Fiiq', 'Xamaro', 'Waangay', 'Lagahida', 'Yoxob', 'Salaxaad', 'Mayu-Muluqo', 'Qubi'],
    'Faafan': ['Tuliguuled', 'Goljano', 'Harooreys', 'Shabeleey', 'Harawo', 'Mula', 'Qabribayax', 'Xarshin', 'Gursum', 'Babili', 'Awbare',],
    'Jarar': ['Daroor', 'Aware', 'Dhagax-buur', 'Dhagax-madow', 'Gunagado', 'Gashamo', 'Birqod', 'Dig', 'Bilcil buur', 'Araarso', 'Yoocaale',],
    'Liibaan': ['Filtu', 'Dollo Adow', 'Qarsadula', 'Gura-dhamoole', 'Goora-Baqaqsa', 'Boqol maayo', 'Dekasuftu',],
    'Nogob': ['Dhuxun', 'Gerbo', 'Xaraarey', 'Ayun', 'Hor-shagah', 'Segeg', 'Ceelweyne',],
    'Qoraxay': ['Qabridahar', 'Shilaabo', 'Dhobaweyn', 'Shaygoosh', 'Marsin', 'Ceel-ogaden', 'Las-dharkeynle', 'Boodaley', 'Higlooley', 'Goglo/kudunbuur',],
    'Shabelle': ['Dhanan', 'Godey', 'Qalafe', 'Beer caano', 'Feerfer', 'Iimey bari', 'Mustaxiil', 'Elele', 'Cadaadle', 'Abaqarow',],
    'Sitti': ['Afdem', 'Ayshaca', 'Mieso', 'Dembel', 'Erar', 'Shiniile', 'Hadhagale', 'Biki', 'Geblalu', 'Dhuunya',],
  };

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
  const subjectsList = subjects.map(subject => subject.name);

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
    nativeStatus: '',
    teacherType: '',
    joiningDate: '',
    birthDate: '',
    subjectsLearned: '',
    subjectsTech: '',
    salary: '',
    description: '',
    healthStatus: '',
    healthNote: '',
    transferReason: '',
    updateReason: '',
    transfer: '',
    specialNeed: '', // New field to capture special need details
    qualifications: '', // URL of the qualifications file
    // ... other existing fields

  });

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Function to fetch teacher data for update
  const fetchTeacherData = async () => {
    if (!id) return; // If no ID, exit early

    try {
      const response = await fetch(`https://finalbakend.vercel.app/${id}`); // Adjust the endpoint as needed
      if (!response.ok) throw new Error('Failed to fetch teacher data');

      const data = await response.json();
      setFormData(data);
      setPreviousPictureURL(data.picture); // Kaydi URL-ka sawirka hore
      setPreviousDistrict(data.district); // Set previous district
      setPreviousBirthDate(data.birthDate); // Set previous birth date
      setPreviousJoiningDate(data.joiningDate); // Set previous joining date
      setPreviousJoiningDate(data.joiningDate);
    } catch (error) {
      // console.error('Error fetching teacher data:', error);
      setError('Error fetching teacher data.');
    }
  };

  useEffect(() => {
    fetchTeacherData(); // Fetch teacher data on component mount
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Hubi in `name` uu saxan yahay
    }));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        picture: file,
      });
      // Create a FileReader to read the file and set the preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result); // Set the preview state
      };
      reader.readAsDataURL(file);
    } else {
      setPicturePreview(previousPictureURL); // Haddii aan sawir la dooran, dib ugu noqo sawirka hore

    }
  };
  const handleQualificationsChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        qualifications: file,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        qualifications: null,
      }));
    } else {
      // console.warn('No qualifications file selected.');
    }
  };


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
      healthStatus: '',
      healthNote: '',
      transferReason: '',
      updateReason: '',
      transfer: false,
      specialNeed: ''
    });
    navigate('/teachersList');
    setDistricts([]);
    setErrors({});
    setSuccess('');
    setError('');
  };

  const validate = () => {
    const newErrors = {};
    // Add validation logic here...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSalary = (educationLevel, experience) => {
    if (SALARY_RANGES[educationLevel] && SALARY_RANGES[educationLevel][experience]) {
      return SALARY_RANGES[educationLevel][experience];
    } else {
      return 'Salary data not available for this combination.';
    }
  };

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

  useEffect(() => {
    if (formData.region) {
      setDistricts(DISTRICTS[formData.region] || []);
      setFormData(prevData => ({
        ...prevData,
        // district: formData.district/t,
      }));
    } else {
      setDistricts([]);
    }
  }, [formData.region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submission initiated");

    if (!validate()) {
      // console.log("Validation failed with errors:", errors);
      return; // Exit if validation fails
    }

    setLoading(true);
    setError('');
    setSuccess('');

    let pictureURL = previousPictureURL;
    let qualificationsURL = previousQualificationsURL;

    try {
      if (formData.picture instanceof File) {
        // console.log("Uploading new picture:", formData.picture.name);
        const pictureRef = ref(storage, `images/${formData.picture.name}`);
        await uploadBytes(pictureRef, formData.picture);
        pictureURL = await getDownloadURL(pictureRef);
        // console.log("Picture uploaded successfully:", pictureURL);
      } else {
        // console.log("No new picture provided, using previous picture URL.");
      }

      if (formData.qualifications instanceof File) {
        // console.log("Uploading new qualifications file:", formData.qualifications.name);
        const qualificationsRef = ref(storage, `qualifications/${formData.qualifications.name}`);
        await uploadBytes(qualificationsRef, formData.qualifications);
        qualificationsURL = await getDownloadURL(qualificationsRef);
        // console.log("Qualifications uploaded successfully:", qualificationsURL);
      } else {
        // console.log("No new qualifications file provided, using previous qualifications URL.");
      }

      const dataToSend = {
        ...formData,
        picture: pictureURL,
        qualifications: qualificationsURL,
        updatedBy: currentUser._id,
        district: formData.district || previousDistrict,
        birthDate: formData.birthDate || previousBirthDate,
        joiningDate: formData.joiningDate || previousJoiningDate,
      };
      // console.log("Data prepared for submission:", dataToSend);

      const response = await fetch(`https://finalbakend.vercel.app/${id || ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        // console.log("Form submission successful:", responseData);
        setSuccess('Form submitted successfully!');
        resetForm();
      } else {
        const responseText = await response.text();
        // console.error("Error response from API:", responseText);
        setError('Error submitting form.');
      }
    } catch (error) {
      // console.error("Error during form submission:", error);
      setError('Error processing form data.');
    } finally {
      // console.log("Form submission complete, loading state reset.");
      setLoading(false);
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
    <div className="max-w-7xl mx-auto p-8  ">


      <h1 className="text-4xl font-bold mb-6 flex gap-4 items-center">

        < SiReacthookform />
        Teacher Form Updating
      </h1>

      {loading && <div className="min-h-screen flex items-center justify-center -mt-6">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 border-4 border-transparent text-[#f27405] text-4xl md:text-5xl lg:text-6xl animate-spin flex items-center justify-center border-t-[#f27405] rounded-full">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-4 border-transparent text-2xl md:text-3xl lg:text-4xl animate-spin flex items-center justify-center border-t-gray-800 rounded-full" />
          </div>
        </div>
      </div>}


      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}
      <form onSubmit={handleSubmit}>
        {/* Shaqsiga (Personal Information): */}
        {/* Name Field */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 '>
          <div className="space-y-6">
            {/* Full Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-2 text-gray-700">
                Full Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full uppercase px-4 py-3 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out`}
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold mb-2 text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out`}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mobile Field */}
            <div className="mb-4">
              <label htmlFor="mobile" className="block font-semibold mb-2 text-gray-700">
                Mobile:
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out`}
                value={formData.mobile}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
            </div>

            {/* Transfer Field */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">Transfer:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="transfer"
                    value="yes"
                    checked={formData.transfer === true}
                    onChange={() => setFormData({ ...formData, transfer: true })}
                    className="form-radio h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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
                    onChange={() => setFormData({ ...formData, transfer: false })}
                    className="form-radio h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    disabled={loading}
                  />
                  <span>No</span>
                </label>
              </div>

              {/* Conditional Transfer Reason */}
              {formData.transfer === true && (
                <div className="mt-2">
                  <label htmlFor="transferReason" className="block font-semibold mb-2 text-gray-700">
                    Transfer Reason:
                  </label>
                  <input
                    type="text"
                    id="transferReason"
                    name="transferReason"
                    value={formData.transferReason}
                    onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={loading}
                  />
                  {errors.transferReason && <p className="text-red-600 text-sm mt-1">{errors.transferReason}</p>}
                </div>
              )}
            </div>

            {/* Region Dropdown */}
            <div className="mb-4">
              <label htmlFor="region" className="block font-semibold mb-2 text-gray-700">
                Zone:
              </label>
              <select
                id="region"
                name="region"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.region}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a Zone</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
            </div>

            {/* District Dropdown */}
            <div className="mb-4">
              <label htmlFor="district" className="block font-semibold mb-2 text-gray-700">
                District:
              </label>
              <select
                id="district"
                name="district"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.district}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
            </div>

            {/* Sex Radio Buttons */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">Sex:</label>
              <div className="flex items-center gap-6">
                {sexOptions.map((sex) => (
                  <label key={sex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sex"
                      value={sex}
                      checked={formData.sex === sex}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span>{sex}</span>
                  </label>
                ))}
              </div>
              {errors.sex && <p className="text-red-600 text-sm mt-1">{errors.sex}</p>}
            </div>

            {/* Native Status Radio Buttons */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">Native Status:</label>
              <div className="flex items-center gap-6">
                {nativeStatusOptions.map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="nativeStatus"
                      value={status}
                      checked={formData.nativeStatus === status}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
              {errors.nativeStatus && <p className="text-red-600 text-sm mt-1">{errors.nativeStatus}</p>}
            </div>

 {/* Health Status Field */}
<div className="mb-4">
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
</div>

{/* Special Needs and Health Note Fields - Render only if healthStatus is "No" */}
{formData.healthStatus === 'No' && (
  <>
    {/* Special Needs Field */}
    <div className="mt-4">
      <label
        htmlFor="specialNeeds"
        className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1"
      >
        Special Needs:
      </label>
      <select
        name="specialNeeds"
        id="specialNeeds"
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        value={formData.specialNeeds}
        onChange={handleChange}
      >
        <option value="">Select an option</option>
        {SPECIAL_NEED_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>

    {/* Health Note Field */}
    <div className="mt-4">
      <label
        htmlFor="healthNote"
        className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1"
      >
        Health Note:
      </label>
      <textarea
        name="healthNote"
        id="healthNote"
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        value={formData.healthNote}
        onChange={handleChange}
        placeholder="Enter any relevant health notes..."
        rows="4"
      />
    </div>
  </>
)}


            <div className="space-y-6">
              {/* Birth Date Field */}
              <div className="mb-4">
                <label htmlFor="birthDate" className="block font-semibold mb-2 text-gray-700">
                  Birth Date:
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                  value={formData.birthDate}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.birthDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div className="mb-4">
                <label htmlFor="picture" className="block font-semibold mb-2 text-gray-700">
                  Profile Picture:
                </label>
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  accept="image/*"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {errors.picture && (
                  <p className="text-red-600 text-sm mt-1">{errors.picture}</p>
                )}
              </div>

              {/* Display picture preview if available */}
              {picturePreview || previousPictureURL ? (
                <div className="mt-4 flex justify-center">
                  <img
                    src={picturePreview || previousPictureURL}
                    alt="Preview"
                    className="rounded-full w-[120px] h-[120px] object-cover border-4 border-blue-500 shadow-md"
                  />
                </div>
              ) : null}
            </div>

          </div>


          {/* Xirfadeedka (Professional Information): */}

          <div className="space-y-6">
            {/* Education Level Dropdown */}
            <div className="mb-4">
              <label htmlFor="educationLevel" className="block font-semibold mb-2 text-gray-700">
                Education Level:
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                value={formData.educationLevel}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select education level</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.educationLevel && (
                <p className="text-red-600 text-sm mt-1">{errors.educationLevel}</p>
              )}
            </div>

            {/* Experience Dropdown */}
            <div className="mb-4">
              <label htmlFor="experience" className="block font-semibold mb-2 text-gray-700">
                Years of Experience:
              </label>
              <select
                id="experience"
                name="experience"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                value={formData.experience}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select experience</option>
                {Object.keys(SALARY_RANGES[formData.educationLevel] || {}).map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              {errors.experience && (
                <p className="text-red-600 text-sm mt-1">{errors.experience}</p>
              )}
            </div>

            {/* Teacher Type Dropdown */}
            <div className="mb-4">
              <label htmlFor="teacherType" className="block font-semibold mb-2 text-gray-700">
                Teacher Type:
              </label>
              <select
                id="teacherType"
                name="teacherType"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                value={formData.teacherType}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select teacher type</option>
                {teacherTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.teacherType && (
                <p className="text-red-600 text-sm mt-1">{errors.teacherType}</p>
              )}
            </div>

            {/* Joining Date Field */}
            <div className="mb-4">
              <label htmlFor="joiningDate" className="block font-semibold mb-2 text-gray-700">
                Joining Year:
              </label>
              <select
                name="joiningDate"
                id="joiningDate"
                value={formData.joiningDate || previousJoiningDate   }
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label htmlFor="subjectsLearned" className="block font-semibold mb-2 text-gray-700">
                Subjects Learned:
              </label>
              <select
                id="subjectsLearned"
                name="subjectsLearned"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                value={formData.subjectsLearned}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select subjects learned</option>
                {subjectsList.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subjectsLearned && (
                <p className="text-red-600 text-sm mt-1">{errors.subjectsLearned}</p>
              )}
            </div>

            {/* Subjects Taught Dropdown */}
            <div className="mb-4">
              <label htmlFor="subjectsTech" className="block font-semibold mb-2 text-gray-700">
                Subjects Taught:
              </label>
              <select
                id="subjectsTech"
                name="subjectsTech"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                value={formData.subjectsTech}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select subjects taught</option>
                {subjectsList.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subjectsTech && (
                <p className="text-red-600 text-sm mt-1">{errors.subjectsTech}</p>
              )}
            </div>

            {/* Salary Field (Read-Only) */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">Salary:</label>
              <input
                type="text"
                name="salary"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                value={formData.salary}
                readOnly
              />
              {errors.salary && (
                <p className="text-red-600 text-sm mt-1">{errors.salary}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="mb-5">
              <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Entry Description"
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
              />
            </div>

            {/* Qualifications Upload Field */}
            <div className="mb-4">
              <label htmlFor="qualifications" className="block font-semibold mb-2 text-gray-700">
                Upload Qualifications:
              </label>
              <input
                value={previousQualificationsURL}
                type="file"
                id="qualifications"
                name="qualifications"
                accept=".pdf, .doc, .docx" // Specify acceptable file types
                onChange={handleQualificationsChange} // Call your change handler
                className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
              />
              {errors.qualifications && (
                <p className="text-red-600 text-sm mt-1">{errors.qualifications}</p>
              )}
            </div>
          </div>

        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex justify-between space-x-4">
          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
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

export default UpdateTeacherForm;