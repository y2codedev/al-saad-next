import React from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export const SampleArrow = ({ direction, onClick }) => {
  const isNext = direction === "next";
  return (
    <div
      className={`arrow ${isNext ? "nextArrow" : "prevArrow"}`}
      onClick={onClick}
    >
      {isNext ? (
        <ChevronRight sx={{ fontSize: 30 }} />
      ) : (
        <ChevronLeft sx={{ fontSize: 30 }} />
      )}
    </div>
  );
};

export const SampleNextArrow = (props) => (
  <SampleArrow direction="next" {...props} />
);

export const SamplePrevArrow = (props) => (
  <SampleArrow direction="prev" {...props} />
);
