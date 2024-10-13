import React from 'react';
import { useSelector } from 'react-redux';

const CommentComponent = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Ensure currentUser is defined before rendering
  if (!currentUser) {
    return null; // or a loading spinner/message
  }

  return (
    <div className='flex items-center mb-1'>
      <span className='font-bold mr-1 text-xs truncate'>
        <span className='text-blue-500'>@{currentUser.username} (You)</span>
        <span className='text-blue-500'>@{currentUser.email} (You)</span>

      </span>
      {/* You can add additional user info if needed */}
    </div>
  );
};

export default CommentComponent;
