import React, { useState } from 'react';
import { storage } from '../firebase'; // Import your firebase configuration
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const TeacherUpload = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    // Check if a file is selected and is an image
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;

      // Validate file type and size
      if (!fileType.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }

      if (fileSize > 5 * 1024 * 1024) { // Limit file size to 5MB
        setError('File size exceeds 5MB. Please select a smaller file.');
        return;
      }

      setImage(selectedFile);
      setError(''); // Reset error
    }
  };

  const handleUpload = () => {
    if (!image) {
      setError('Please upload an image before submitting.');
      return;
    }

    if (!name || !email || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error(error);
        setError('Error uploading image. Please try again.');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Image uploaded successfully. Image URL:", downloadURL); // Debugging
          setImageUrl(downloadURL);
          sendImageDataToAPI(downloadURL);  // Send the image URL to the API
        });
      }
    );
  };

  const sendImageDataToAPI = (imageUrl) => {
    const apiEndpoint = 'https://finalbakend.vercel.app/';  // Replace with your actual API endpoint

    const formData = new FormData();
    formData.append('picture', imageUrl); // API expects 'picture' as per your Mongo schema
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', phone); // Use 'mobile' here as per your schema

    console.log('Form Data:', {
      picture: imageUrl,
      name: name,
      email: email,
      mobile: phone
    }); // Debugging

    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('API response:', data); // Debugging
        setError(''); // Clear error on success
      })
      .catch((error) => {
        console.error('Error sending data to the API:', error); // Debugging
        setError('Error sending data to the API. Please try again.');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      {error && <p className="text-red-500">{error}</p>} {/* Show error messages */}
      <div className="mb-4">
        <input
          type="file"
          onChange={handleImageChange}
          className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
        />
      </div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Upload Teacher
      </button>

      {progress > 0 && (
        <div className="mt-4 w-full max-w-xs">
          <progress
            value={progress}
            max="100"
            className="w-full bg-gray-200 rounded"
          />
          <p className="text-center text-sm">{progress}%</p>
        </div>
      )}

      {imageUrl && (
        <div className="mt-6">
          <p className="text-green-500">Image uploaded successfully!</p>
          <img src={imageUrl} alt="Uploaded" className="mt-2 w-64 h-64 object-cover rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default TeacherUpload;
