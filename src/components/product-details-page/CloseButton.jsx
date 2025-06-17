'use client';

import { FiX } from 'react-icons/fi';
import React from 'react';

const CloseButton = ({
  onClick,
  className = '',
  size = 18,
  iconColor = '#333',
}) => {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      className={`absolute top-2 right-2 z-10 rounded-full  cursor-pointer  flex items-center justify-center bg-gray-200  hover:bg-gray-300 transition duration-150 ${className}`}
    >
      <FiX size={size} color={iconColor} />
    </button>
  );
};

export default CloseButton;
