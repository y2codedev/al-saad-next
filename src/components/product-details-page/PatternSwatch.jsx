"use client";

import Image from 'next/image'
import React from 'react'

const PatternSwatch = ({ isActive, image, onClick, index }) => {
  return (
    <div
    onClick={onClick}
    className={`w-[25px] h-[25px] rounded-full border border-gray-300 cursor-pointer flex-shrink-0 
      overflow-hidden p-0 ${isActive ? "ring-2 ring-[#bb1f2a]" : ""}`}
  >
    <Image
      src={image}
      alt={`Pattern ${index}`}
      width={30}
      height={30}
      className="rounded-full object-cover"
      draggable={false}
    />
  </div>
  )
}

export default PatternSwatch
