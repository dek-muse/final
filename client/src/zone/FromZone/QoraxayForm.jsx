/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Alert } from 'flowbite-react';
// import { storage } from '../firebase'; // Adjust the path as necessary
  

const subjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'English' },
  { id: 4, name: 'History' },
  // Add more subjects as needed
];

// Constants for education levels and salary ranges
const EDUCATION_LEVELS = ['High School', 'Master\'s Degree', 'Doctorate'];
const SALARY_RANGES = {
  'High School': [7000, 8000],
  'Master\'s Degree': [9000, 10000],
  'Doctorate': [11000, 12000],
};


const REGIONS = ["Qoraxay"];
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

const subjectsList = [
  'Mathematics',
  'Science',
  'English',
  'History',
  // Add more subjects as needed
];




const sexOptions = ['Male', 'Female'];
const nativeStatusOptions = ['Native', 'Non-native'];
const teacherType = ['Kg','Primary', 'Secondary', 'Preparatory' , 'University/Colleges']

const TeacherForm = () => {
  
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
      teacherType: '',
      picture: null,
      joiningDate: '',
      educationLevel: '', // New field
      salary: '', // New field
      birthDate: ''
    });
  

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [picturePreview, setPicturePreview] = useState('');
  const [districts, setDistricts] = useState([]);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
      //   match /b/{bucket}/o {
      //     match /{allPaths=**} {
      //       allow read;
      //       allow write: if
      //       request.resource.size < 2 * 1024 * 1024 &&
      //       request.resource.contentType.matches('image/.*')
      //     }
      //   }
      // }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError(
            'Could not upload image (File must be less than 2MB)'
          );
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
            setImageFileUploading(false);
          });
        }
      );
  }
  


  useEffect(() => {
    if (teacher.region) {
      setDistricts(DISTRICTS[teacher.region] || []);
    }
  }, [teacher.region])
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture') {
      setTeacher({ ...teacher, [name]: files[0] });
      setPicturePreview(URL.createObjectURL(files[0]));
    } else {
      setTeacher({ ...teacher, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  

    const validate = () => {
      const newErrors = {};
      if (!teacher.name) newErrors.name = 'Name is required';
    if (!teacher.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(teacher.email)) newErrors.email = 'Email is invalid';
    if (!teacher.mobile) newErrors.mobile = 'Mobile is required';
    // if (!teacher.city) newErrors.city = 'City is required';
    if (!teacher.address) newErrors.address = 'Address is required';
    if (!teacher.teacherType) newErrors.teacherType = 'Teacher Type is required';
    if (!teacher.region) newErrors.region = 'Region is required';
    if (!teacher.district) newErrors.district = 'District is required';
    if (!teacher.subjectsLearned) newErrors.subjectsLearned = 'Subjects Learned are required';
    if (!teacher.subjectsTech) newErrors.subjectsTech = 'Subjects Tech are required';
    if (!teacher.description) newErrors.description = 'Description is required';
    if (!teacher.sex) newErrors.sex = 'Sex is required';  // Validation for new field
    if (!teacher.nativeStatus) newErrors.nativeStatus = 'Native Status is required';  // Validation for new field
    // if (!teacher.picture) newErrors.picture = 'Picture is required';  // Validation for new field
    if (!teacher.educationLevel) newErrors.educationLevel = 'Education Level is required'; // Validation for new field
    if (!teacher.salary) newErrors.salary = 'Salary Range is required'; // Validation for new field
    if (!teacher.birthDate) newErrors.birthDate = 'Birth Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsLoading(true);
  
    try {
      let pictureURL = '';
  
      if (teacher.picture) {
        const pictureRef = storage.ref(`pictures/${teacher.picture.name}`);
        await pictureRef.put(teacher.picture);
        pictureURL = await pictureRef.getDownloadURL();
      }
  
      const teacherData = { ...teacher, picture: pictureURL };
  
      // Exclude picture field in the form submission if it's not needed
      const { picture, ...dataToSend } = teacherData;
  
      const response = await axios.post('https://finalbakend.vercel.app/', dataToSend);
      console.log(response.data);
  
      setIsSubmitted(true);
      setTeacher({
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
        teacherType: '',
        picture: null,
        joiningDate: ''
      });
      navigate('/teachersList');
    } catch (error) {
      console.error('There was an error creating the teacher!', error);
      alert(`Error: ${error.response.data.error}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleReset = () => {
    setTeacher({
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
      sex: '',  // Reset new field
      nativeStatus: '',  // Reset new field
      teacherType: '',
      picture: null
    });
    setErrors({});
    setIsSubmitted(false); // Reset the submitted status
  };
  

  return (
    <div className="max-w-4xl mx-auto p-8  rounded-lg   shadow-2xl border shadow-[#b19d60] border-[#b19d60]">
      <h2 className="text-3xl font-bold  mb-6">Create Teacher</h2>
      {isSubmitted ? (
        <div className="text-green-600 text-center mb-6 text-lg font-medium">
          Teacher has been created successfully!
          </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div>
              <h3 className="text-xl font-medium mb-4">
                {/* Teacher Personal Details */}
              </h3>
              <div className="mb-5">
                <label htmlFor="name" className="block   text-sm font-medium mb-2">Teacher Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={teacher.name}
                  onChange={handleChange}
                  required
                  placeholder='Enter Full Name'
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm  dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block  text-sm font-medium mb-2">Teacher Email ID</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={teacher.email}
                  onChange={handleChange}
                  required
                  placeholder='Enter Email'
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm  dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-600  text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="mobile" className="block  text-sm font-medium mb-2">Teacher Mobile Number</label>
                <input
                  id="mobile"
                  type=" "
                  name="mobile"
                  value={teacher.mobile}
                  onChange={handleChange}
                  required
                  placeholder='Entry Mobile Number'
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm  dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="address" className="block  text-sm font-medium mb-2">Teacher Address</label>
                <input
                  id="address"
                  name="address"
                  value={teacher.address}
                  onChange={handleChange}
                  required
                  placeholder='Entry Address'
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm  dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
              </div>
              <div className="mb-5">
                <label className="block  text-sm font-medium mb-2">Sex</label>
                {sexOptions.map(option => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      id={option}
                      type="checkbox"
                      name="sex"
                      value={option}
                      checked={teacher.sex.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor={option} className="">{option}</label>
                  </div>
                ))}
                {errors.sex && <p className="text-red-600 text-xs mt-1">{errors.sex}</p>}
              </div>
              <div className="mb-5">
                <label className="block  text-sm font-medium mb-2">Native Status</label>
                {nativeStatusOptions.map(option => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      id={option}
                      type="checkbox"
                      name="nativeStatus"
                      value={option}
                      checked={teacher.nativeStatus.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor={option} className="">{option}</label>
                  </div>
                ))}
                {errors.nativeStatus && <p className="text-red-600 text-xs mt-1">{errors.nativeStatus}</p>}
              </div>
                      {/* date birth */}
            <div className="mb-5">
  <label htmlFor="birthDate" className="block text-sm font-medium mb-2">Teacher Birth Date</label>
  <input
    type="date"
    id="birthDate"
    name="birthDate"
    value={teacher.birthDate}
    onChange={handleChange}
    required
    className={`w-full px-4 py-3 border rounded-lg shadow-sm dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
  />
  {errors.birthDate && <p className="text-red-600 text-xs mt-1">{errors.birthDate}</p>}
</div>
             {/*  */}
              <div>
              <input
               type='file'
               accept='image/*'
               onChange={handleImageChange}
               ref={filePickerRef}
              //  hidden
      />
      <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
      onClick={() => filePickerRef.current.click()}>
        {imageFileUploadProgress && (
          <CircularProgressbar
          value={imageFileUploadProgress || 0}
          text={`${imageFileUploadProgress}%`}
          strokeWidth={5}
          styles={{
            root: {
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            },
            path: {
              stroke: `rgba(62, 152, 199, ${
                imageFileUploadProgress / 100
              })`,
            },
          }}
        />
        )}
        {/* <img
          src={imageFileUrl || currentUser.profilePicture}
          alt='user'
          className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
            imageFileUploadProgress &&
            imageFileUploadProgress < 100 &&
            'opacity-60'
          }`}
        /> */}
      </div>
            </div>
            {imageFileUploadError && (
              <Alert color='failure'>{imageFileUploadError}</Alert>
            )}

     
            </div>



            {/* Professional Details */}
            <div>

              <h3 className="text-xl font-medium mb-4">
                {/* Teacher Professional Details */}
                </h3>
                   {/* Education Level Field */}
      <div className="mb-5">
        <label htmlFor="educationLevel" className="block text-sm font-medium mb-2">Teacher Education Levels</label>
        <select
          id="educationLevel"
          name="educationLevel"
          value={teacher.educationLevel}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 border rounded-lg shadow-sm ${errors.educationLevel ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select Education Level</option>
          {EDUCATION_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {errors.educationLevel && <p className="text-red-600 text-xs mt-1">{errors.educationLevel}</p>}
      </div>

      {/* Salary Range Field */}
      <div className="mb-5">
        <label htmlFor="salaryRange" className="block text-sm font-medium mb-2">Teacher Salary Ranges</label>
        <select
          id="salaryRange"
          name="salary"
          value={teacher.salary}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 border rounded-lg ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select Salary Range</option>
          {teacher.educationLevel && SALARY_RANGES[teacher.educationLevel]?.map((salary, index) => (
            <option key={index} value={salary}>{salary}</option>
          ))}
        </select>
        {errors.salary && <p className="text-red-600 text-xs mt-1">{errors.salary}</p>}
      </div>
              <div className="mb-5">

                <label htmlFor="region" className="block  text-sm font-medium mb-2">Select Teacher Type</label>
                <select
                  id="teacherType"
                  name="teacherType"
                  value={teacher.teacherType}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.teacherType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Teacher Type</option>
                  {teacherType.map(teacherType => (
                    <option key={teacherType} value={teacherType}>{teacherType}</option>
                  ))}
                </select>
                {errors.teacherType && <p className="text-red-600 text-xs mt-1">{errors.teacherType}</p>}
              </div>


              <div className="mb-5">
                <label htmlFor="region" className="block  text-sm font-medium mb-2">Teacher Region</label>
                <select
                  id="region"
                  name="region"
                  value={teacher.region}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.region ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Region</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-red-600 text-xs mt-1">{errors.region}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="district" className="block  text-sm font-medium mb-2">Teacher District</label>
                <select
                  id="district"
                  name="district"
                  value={teacher.district}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.district ? 'border-red-500' : 'border-gray-300'}`}

                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-600 text-xs mt-1">{errors.district}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="subjectsLearned" className="block  text-sm font-medium mb-2">Subjects Learned</label>
                <select
                  id="subjectsLearned"
                  name="subjectsLearned"
                  value={teacher.subjectsLearned}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.subjectsLearned ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Subjects</option>
                  {subjectsList.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subjectsLearned && <p className="text-red-600 text-xs mt-1">{errors.subjectsLearned}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="subjectsTech" className="block  text-sm font-medium mb-2">Subjects Tech</label>
                <select
                  id="subjectsTech"
                  name="subjectsTech"
                  value={teacher.subjectsTech}
                  onChange={handleChange}
                  required
              className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.subjectsTech ? 'border-red-500' : 'border-gray-300'}`}

                >
                  <option value="">Select Subjects</option>
                  {subjectsList.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subjectsTech && <p className="text-red-600 text-xs mt-1">{errors.subjectsTech}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="description" className="block  text-sm font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={teacher.description}
                  onChange={handleChange}
                  required
                  placeholder='Entry Description'
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            
                />
                {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="joiningDate" className="block  text-sm font-medium mb-2">Joining Date</label>
                <input
                  id="joiningDate"
                  type="date"
                  name="joiningDate"
                  value={teacher.joiningDate}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm   dark:text-white bg-gray-200 dark:bg-gray-700 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'}`}
                   />
                {errors.joiningDate && <p className="text-red-600 text-xs mt-1">{errors.joiningDate}</p>}
              </div>
            </div>
            
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherForm; 