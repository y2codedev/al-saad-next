"use client";

import React from "react";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

const FilterChip = ({ label, isSelected, onClick, direction }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 6px",
        borderRadius: "4px",
        backgroundColor: isSelected ? "#bb1f2a" : "#eee",
        color: isSelected ? "#fff" : "#000",
        cursor: "pointer",
        fontWeight: 400,
        userSelect: "none",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? "#bb1f2a" : "#ddd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? "#bb1f2a" : "#eee";
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        {isSelected ? (
          <CheckCircle
            sx={{ fontSize: "15px", color: isSelected ? "#fff" : "#292b2c" }}
          />
        ) : (
          <RadioButtonUnchecked sx={{ fontSize: "15px", color: "#292b2c" }} />
        )}
      </span>
      <p
        style={{
          margin: 0,
          padding: "0px 4px",
          fontSize: "14px",
          ...(direction && { direction: direction }),
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default FilterChip;
