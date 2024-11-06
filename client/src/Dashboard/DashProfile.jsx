import {
  Alert,
  Button,
  Modal,
  ModalBody,
  TextInput,
} from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    region: currentUser.region || '',
    profilePicture: currentUser.profilePicture || '',
  });
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // console.log("Selected file:", file); // Log selected file
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // console.log("Current image file:", imageFile); // Log the current image file
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // console.log("Starting image upload"); // Log upload start
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload progress:", progress); // Log upload progress
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // console.error("Upload error:", error); // Log upload error
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("Image uploaded successfully. Download URL:", downloadURL); // Log successful upload URL
          setImageFileUrl(downloadURL);
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: downloadURL,
          }));
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    // console.log("Form field changed:", e.target.id, e.target.value); // Log form changes
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    // console.log("Form Data before submit:", formData); // Log form data before submission

    if (Object.keys(formData).length === 0 && !imageFile) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`https://tuserapi.vercel.app/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        // console.error("Update failed:", data.message); // Log error on update failure
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        // console.log("Update successful:", data); // Log successful update
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      // console.error("Error during update:", error.message); // Log unexpected error
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://tuserapi.vercel.app/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        // console.error("Delete failed:", data.message); // Log error on delete failure
        dispatch(deleteUserFailure(data.message));
      } else {
        // console.log("User deleted successfully:", data); // Log successful deletion
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      // console.error("Error during delete:", error.message); // Log unexpected error
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('https://tuserapi.vercel.app/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        // console.error("Sign out failed:", data.message); // Log error on sign out failure
        return data.message;
      } else {
        // console.log("User signed out successfully"); // Log successful sign out
        dispatch(signoutSuccess());
      }
    } catch (error) {
      // console.error("Error during sign out:", error.message); // Log unexpected error
      return error.message;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 w-full  ">
    {/* Profile Heading */}
    <h1 className="text-3xl font-semibold text-center mb-6 text-indigo-700">Profile</h1>
    
    {/* Form Section */}
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* File Input for Profile Picture */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={filePickerRef}
        hidden
      />
      <div
        className="relative w-[200px] h-[200px] self-center cursor-pointer shadow-xl rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
        onClick={() => filePickerRef.current.click()}
      >
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
                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
              },
            }}
          />
        )}
        <img
          src={imageFileUrl || currentUser.profilePicture}
          alt="user"
          className={`rounded-full w-full h-full object-cover border-4 border-lightgray ${
            imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
          }`}
        />
      </div>
      {imageFileUploadError && (
        <Alert color="failure" className="mt-3">{imageFileUploadError}</Alert>
      )}
      
      {/* Username (Disabled) */}
      <TextInput
        type="text"
        id="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        disabled
        className="bg-gray-100 cursor-not-allowed"
      />
      
      {/* Email */}
      <TextInput
        type="email"
        id="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      {/* Password */}
      <TextInput
        type="password"
        id="password"
        placeholder="Password"
        onChange={handleChange}
        className="bg-gray-100"
      />
      
      {/* Region (Disabled) */}
      <TextInput
        type="text"
        id="region"
        placeholder="Region"
        value={formData.region}
        onChange={handleChange}
        disabled
        className="bg-gray-100 cursor-not-allowed"
      />
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || imageFileUploading}
        className="bg-indigo-600 text-white rounded-lg py-3 mt-4 hover:bg-indigo-700 transition duration-300"
      >
        {loading ? 'Loading...' : 'Update'}
      </button>
    </form>
  
    {/* Sign Out Link */}
    <div className="flex justify-between mt-5">
      <Link to="/">
        <span onClick={handleSignout} className="text-red-500 cursor-pointer hover:text-red-700 transition duration-300">
        
        </span>
      </Link>
    </div>
  
    {/* Success/Failure Alert */}
    {updateUserSuccess && (
      <Alert color="success" className="mt-3">
        {updateUserSuccess}
      </Alert>
    )}
    {updateUserError && (
      <Alert color="failure" className="mt-3">
        <div className="flex items-center">
          <HiOutlineExclamationCircle className="mr-2" />
          {updateUserError}
        </div>
      </Alert>
    )}
  
    {/* Delete Profile Modal Trigger */}
    <div className="flex justify-between mt-5">
      <span onClick={() => setShowModal(true)} className="text-red-500 cursor-pointer hover:text-red-700 transition duration-300">
         
      </span>
    </div>
  
    {/* Delete Profile Modal */}
    <Modal show={showModal} onClose={() => setShowModal(false)}>
      <ModalBody>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Are you sure you want to delete your profile?</h2>
          <div className="flex justify-center gap-4">
            <Button onClick={handleDeleteUser} color="failure">
              Confirm
            </Button>
            <Button onClick={() => setShowModal(false)} color="gray">
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  </div>
  

  );
};

export default DashProfile;
