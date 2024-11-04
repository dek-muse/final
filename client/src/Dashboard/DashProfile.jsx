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
      console.log("Selected file:", file); // Log selected file
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    console.log("Current image file:", imageFile); // Log the current image file
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    console.log("Starting image upload"); // Log upload start
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
        console.log("Upload progress:", progress); // Log upload progress
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.error("Upload error:", error); // Log upload error
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Image uploaded successfully. Download URL:", downloadURL); // Log successful upload URL
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
    console.log("Form field changed:", e.target.id, e.target.value); // Log form changes
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    console.log("Form Data before submit:", formData); // Log form data before submission

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
        console.error("Update failed:", data.message); // Log error on update failure
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        console.log("Update successful:", data); // Log successful update
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      console.error("Error during update:", error.message); // Log unexpected error
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
        console.error("Delete failed:", data.message); // Log error on delete failure
        dispatch(deleteUserFailure(data.message));
      } else {
        console.log("User deleted successfully:", data); // Log successful deletion
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      console.error("Error during delete:", error.message); // Log unexpected error
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
        console.error("Sign out failed:", data.message); // Log error on sign out failure
        return data.message;
      } else {
        console.log("User signed out successfully"); // Log successful sign out
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error("Error during sign out:", error.message); // Log unexpected error
      return error.message;
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
          disabled
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
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          value={formData.username}
          onChange={handleChange}
           
          disabled
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <TextInput
          type='text'
          id='region'
          placeholder='region'
          value={formData.region}
          onChange={handleChange}
          disabled
        />
        <button
          type='submit'
          outline
          disabled={loading || imageFileUploading}
          className='bg-gray-700 rounded-lg p-4 text-white'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <Link to='/'>
          <span onClick={handleSignout} className='cursor-pointer'>
            
          </span>
        </Link>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-3'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-3'>
          <div className='flex items-center'>
            <HiOutlineExclamationCircle className='mr-2' />
            {updateUserError}
          </div>
        </Alert>
      )}
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
        
        </span>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalBody>
          <div className='text-center'>
            <h2 className='text-lg font-bold'>Are you sure you want to delete your profile?</h2>
            <div className='flex justify-center mt-4'>
              <Button onClick={handleDeleteUser} color='failure'>
                Confirm
              </Button>
              <Button onClick={() => setShowModal(false)} color='gray' className='ml-2'>
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
