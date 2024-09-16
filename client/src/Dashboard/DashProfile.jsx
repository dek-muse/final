import { Alert, Button, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { useDispatch } from 'react-redux';
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
  const [formData, setFormData] = useState({});
  const [passwordError, setPasswordError] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setImageFileUploadError('Only image files are allowed.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageFileUploadError('File size must be less than 2MB.');
        return;
      }
      
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null); // Clear any previous errors
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
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
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // Handle and display specific error messages
        switch (error.code) {
          case 'storage/unauthorized':
            setImageFileUploadError('User does not have permission to upload.');
            break;
          case 'storage/canceled':
            setImageFileUploadError('Upload canceled by user.');
            break;
          case 'storage/unknown':
            setImageFileUploadError('Unknown error occurred.');
            break;
          default:
            setImageFileUploadError('An error occurred during upload.');
        }
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
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    setPasswordError(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    if (formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setPasswordError(passwordError);
        return;
      }
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

      if (!res.ok) {
        const data = await res.json();
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        const data = await res.json();
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
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

      if (!res.ok) {
        const data = await res.json();
        dispatch(deleteUserFailure(data.message));
      } else {
        const data = await res.json();
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        return data.message;
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      return error.message;
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex bg-white text-black flex-col gap-4 p-6 rounded-lg shadow-md'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full border-4 border-gray-300'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            </div>
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`w-full h-full object-cover rounded-full border-4 border-gray-300 ${
              imageFileUploadProgress && imageFileUploadProgress < 100 ? 'opacity-60' : ''
            }`}
          />
        </div>
        {imageFileUploadError && (
          <div className='text-red-500 text-sm'>{imageFileUploadError}</div>
        )}
        <input
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
          className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
          className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        {passwordError && (
          <div className='text-red-500 text-sm'>{passwordError}</div>
        )}
        <button
          type='submit'
          disabled={loading || imageFileUploading}
          className='p-3 rounded-lg shadow-md hover:bg-gray-600 bg-gray-400 disabled:opacity-50'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          
        </span>
        
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5 bg-green-300 text-green-600'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5 bg-red-300 text-red-600'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
