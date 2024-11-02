import React from 'react';

function DotIndicator({ isNewMessage }) {
  return (
    <div className={isNewMessage ? 'absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse' : 'hidden'}>
    </div>
  );
}

export default DotIndicator;