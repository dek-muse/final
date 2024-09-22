// src/FileUpload.js
import React, { useState } from 'react';
import { storage, ref, uploadBytes, getDownloadURL } from './firebase-config';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileType(e.target.files[0].type);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);

    setUploading(true);

    uploadBytes(storageRef, file).then(() => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setUrl(downloadURL);
        setUploading(false);
      });
    }).catch((error) => {
      console.error(error);
      setUploading(false);
    });
  };

  const renderFile = () => {
    if (!url) return null;

    if (fileType.startsWith('image/')) {
      return <img src={url} alt="Uploaded file" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
    } else if (fileType === 'application/pdf') {
      return <iframe src={url} style={{ width: '100%', height: '500px' }} title="Uploaded PDF" />;
    } else {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      );
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {renderFile()}
    </div>
  );
}

export default FileUpload;
