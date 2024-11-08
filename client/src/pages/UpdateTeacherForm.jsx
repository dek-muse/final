import React, { useState, useEffect } from 'react';
import { storage } from '../firebase'; // Ensure the import path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateTeacherForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using react-router for dynamic routing
  const [previousPictureURL, setPreviousPictureURL] = useState('');
  const [previousDistrict, setPreviousDistrict] = useState('');
  const [previousBirthDate, setPreviousBirthDate] = useState('');
  const [previousJoiningDate, setPreviousJoiningDate] = useState('');
  const [picturePreview, setPicturePreview] = useState(null); // State for picture preview

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
  const nativeStatusOptions = ['Native', 'Non-native'];
  const teacherTypes = ['Kg', 'Primary', 'Secondary', 'Preparatory', 'University/Colleges'];

  // Qeexitaanka Mawduucyada
  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'English' },
    { id: 4, name: 'History' },
    // Ku dar mawduucyo kale sida loo baahan yahay
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
    transfer: false,
    
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
    setFormData({
      ...formData,
      [name]: value,
    });
    // console.log(`Updated ${name}:`, value);
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
    }else{
      setPicturePreview(previousPictureURL); // Haddii aan sawir la dooran, dib ugu noqo sawirka hore

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
    // console.log('Form submission initiated with data:', formData);

    if (!validate()) {
      // console.log('Validation failed with errors:', errors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    let pictureURL = previousPictureURL; // Isticmaal URL-ka hore haddii sawir cusub aan la dooran

    if (formData.picture && formData.picture instanceof File) {
      const storageRef = ref(storage, `images/${formData.picture.teacher.name}`);
      // console.log('Uploading picture to Firebase Storage...');

      try {
        await uploadBytes(storageRef, formData.picture);
        // console.log('Picture uploaded successfully:', formData.picture.name);
        pictureURL = await getDownloadURL(storageRef);
        // console.log('Picture download URL:', pictureURL);
      } catch (error) {
        // console.error('Error uploading picture:', error);
        setError('Error uploading picture.');
        setLoading(false);
        return;
      }
    }

    const dataToSend = {
      ...formData,
      picture: pictureURL, // Ku dar URL-ka sawirka
      updatedBy: currentUser._id,
      district: formData.district || previousDistrict, // Use previous district if not provided
      birthDate: formData.birthDate || previousBirthDate, // Use previous birth date if not provided
      joiningDate: formData.joiningDate || previousJoiningDate, // Use previous joining date if not provided
    };

    try {
      const response = id
        ? await fetch(`https://finalbakend.vercel.app/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
        : await fetch('https://finalbakend.vercel.app/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

      if (response.ok) {
        const responseData = await response.json();
        // console.log('Data successfully sent:', responseData);
        setSuccess('Form submitted successfully!');
        resetForm();
      } else {
        const responseText = await response.text();
        // console.error('Response error message:', responseText);
        setError('Error sending data to API.');
      }

      // console.log('API response status:', response.status);
    } catch (error) {
      // console.error('Error sending data to API:', error);
      setError('Error sending data to API.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-8  rounded-lg   shadow-2xl border shadow-[#b19d60] border-[#b19d60]">


      <h1 className="  text-3xl font-bold  mb-6">Teacher Form Updating</h1>

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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full uppercase px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading} // Disable input while loading
              />
              {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>} {/* Display validation error */}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.mobile}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {errors.mobile && <p style={{ color: 'red' }}>{errors.mobile}</p>}
            </div>

            {/* Region Dropdown */}
            <div className="mb-4">
              <label htmlFor="region" className="block font-semibold mb-1">
                Region:
              </label>
              <select
                id="region"
                name="region"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.region}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a region</option>
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.district}
                onChange={handleChange}
                disabled={loading} // Disable if no region selected or loading
              >
                <option value="">Select a district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && <p style={{ color: 'red' }}>{errors.district}</p>}
            </div>

            {/* Sex Dropdown */}
            <div className="mb-4">
              <label htmlFor="sex" className="block font-semibold mb-1">
                Sex:
              </label>
              <select
                id="sex"
                name="sex"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.sex}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select sex</option>
                {sexOptions.map((sex) => (
                  <option key={sex} value={sex}>
                    {sex}
                  </option>
                ))}
              </select>
              {errors.sex && <p style={{ color: 'red' }}>{errors.sex}</p>}
            </div>

            {/* Native Status Dropdown */}
            <div className="mb-4">
              <label htmlFor="nativeStatus" className="block font-semibold mb-1">
                Native Status:
              </label>
              <select
                id="nativeStatus"
                name="nativeStatus"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.nativeStatus}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select native status</option>
                {nativeStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.nativeStatus && <p style={{ color: 'red' }}>{errors.nativeStatus}</p>}
            </div>
 {/* Health Status Checkboxes */}
 <div className="mb-4">
                <label className="block font-semibold mb-1">Health Status:</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="healthStatus"
                            value="yes"
                            checked={formData.healthStatus === 'yes'}
                            onChange={() => setFormData((prev) => ({
                                ...prev,
                                healthStatus: 'yes',
                                healthNote: '', // Reset note if user selects "Yes"
                            }))}
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            disabled={loading}
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="healthStatus"
                            value="no"
                            checked={formData.healthStatus === 'no'}
                            onChange={() => setFormData((prev) => ({
                                ...prev,
                                healthStatus: 'no',
                                healthNote: '', // Reset note if user selects "No"
                            }))}
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            disabled={loading}
                        />
                        <span>No</span>
                    </label>
                </div>
                {errors.healthStatus && <p style={{ color: 'red' }}>{errors.healthStatus}</p>}
            </div>

            {/* Health Note Field (Conditional) */}
            {formData.healthStatus === 'no' && (
                <div className="mb-4">
                    <label htmlFor="healthNote" className="block font-semibold mb-1">
                        Health Note:
                    </label>
                    <textarea
                        id="healthNote"
                        name="healthNote"
                        placeholder="Enter your health notes here (optional)"
                        value={formData.healthNote}
                        onChange={(e) => setFormData((prev) => ({ ...prev, healthNote: e.target.value }))}
                        className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>
            )}

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
                            placeholder="Enter reason for transfer"
                            value={formData.transferReason}
                            onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                            className={`w-full px-4 py-2.5 dark:bg-gray-700 transition duration-200 ease-in-out transform hover:scale-105 border rounded-lg shadow-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={loading}
                        />
                        {errors.transferReason && <p style={{ color: 'red' }}>{errors.transferReason}</p>}
                    </div>
                )}
            </div>


            {/* Birth Date Field */}
            <div className="mb-4">
              <label htmlFor="birthDate" className="block font-semibold mb-1">
                Birth Date:
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.birthDate}
                onChange={handleChange}
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
                className="w-full"
                onChange={handleFileChange}
                disabled={loading}
              />
              {errors.picture && <p style={{ color: 'red' }}>{errors.picture}</p>}
            </div>
             {/* Display picture preview if available */}
       {/* Display picture preview if available */}
       {picturePreview && (
        <div className="picture-preview">
          <img src={picturePreview || previousPictureURL} alt="Preview" className=' rounded-full w-[120px]' />
        </div>
      )}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
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
              {errors.teacherType && <p style={{ color: 'red' }}>{errors.teacherType}</p>}
            </div>

            {/* Joining Date Field */}
            <div className="mb-4">
              <label htmlFor="joiningDate" className="block font-semibold mb-1">
                Joining Date:
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.joiningDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Subjects Learned Dropdown */}
            <div className="mb-4">
              <label htmlFor="subjectsLearned" className="block font-semibold mb-1">
                Subjects Learned:
              </label>
              <select
                id="subjectsLearned"
                name="subjectsLearned"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}
                value={formData.salary}
                readOnly
              />
              {errors.salary && <p style={{ color: 'red' }}>{errors.salary}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="description" className="block  text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder='Entry Description'
                className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out  `}

              />
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

export default UpdateTeacherForm;