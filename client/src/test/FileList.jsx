// src/FileList.js
import React, { useEffect, useState } from 'react';
import { storage, ref, listAll, getDownloadURL } from '../firebase';

function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const listRef = ref(storage, 'files/');
        const res = await listAll(listRef);

        const urls = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url };
          })
        );

        setFiles(urls);
      } catch (error) {
        console.error("Error fetching files: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.url.endsWith('.pdf') ? (
              <iframe src={file.url} style={{ width: '100px', height: '100px' }} title={file.name} />
            ) : (
              <img src={file.url} alt={file.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            )}
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
