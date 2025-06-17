"use client";

import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import React from "react";

const SliderArrow = ({ onClick, direction }) => {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      className={`absolute z-10 p-2 flex justify-center items-center cursor-pointer rounded-full 
        top-1/2 -translate-y-1/2 
        ${isLeft ? "left-0 md:left-6" : "right-0 md:right-6"}`}
      aria-label={isLeft ? "Previous Slide" : "Next Slide"}
    >
      {isLeft ? (
        <FaArrowLeftLong size={15} color="#fff" />
      ) : (
        <FaArrowRight size={15} color="#fff" />
      )}
    </button>
  );
};

export default SliderArrow;
