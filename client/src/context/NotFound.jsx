// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-xl mb-4 text-gray-600">Page Not Found</p>
      <p className="text-lg mb-6 text-gray-500">
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="text-blue-500 hover:underline text-lg">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
