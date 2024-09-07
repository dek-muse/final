// Upload.jsx
import React, { useState } from 'react';
import { storage } from '../firebase'; // Adjust the path as necessary
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(''); // Message state
  const [preview, setPreview] = useState(''); // Image preview state

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Check if the selected file is an image
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setMessage(''); // Clear previous messages
      
      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(selectedFile); // Read the file as a data URL
    } else {
      setMessage('Please select a valid image file.');
      setFile(null);
      setPreview(''); // Clear preview if file is invalid
    }
  };

  const handleUpload = () => {
    if (file) {
      const fileRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytes(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          setMessage('Uploading...'); // Set message during upload
        },
        (error) => {
          // Error function
          console.error('Upload failed:', error);
          setMessage('Upload failed, please try again.');
        },
        async () => {
          // Complete function
          try {
            const downloadURL = await getDownloadURL(fileRef);
            setUrl(downloadURL);
            setMessage('Image uploaded successfully!'); // Success message
          } catch (error) {
            console.error('Failed to get download URL:', error);
            setMessage('Failed to get file URL.');
          }
        }
      );
    } else {
      setMessage('No file selected.');
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>
      <div>Progress: {progress}%</div>
      {preview && (
        <div>
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" style={{ width: '200px', height: 'auto' }} />
        </div>
      )}
      {url && (
        <div>
          <h3>Image Uploaded Successfully</h3>
          <img src={url} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
        </div>
      )}
      {message && <div style={{ color: 'blue' }}>{message}</div>} {/* Display message */}
    </div>
  );
};

export default Upload;
