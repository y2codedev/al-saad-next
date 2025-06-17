"use client";

import React from "react";
import classNames from "classnames";

const Button = ({
  label,
  price,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  icon,
  ariaLabel,
  loading,
}) => {
  const baseStyle = "flex items-center justify-center cursor-pointer text-sm transition-colors duration-200 rounded-md";
  const variants = {
    primary: "bg-[#d7e2da] text-black hover:bg-[#c9d8ce] py-2.5 px-4 w-full",
    secondary: "bg-black text-white hover:bg-neutral-800 py-2.5 px-4 w-full",
    ghost:
      "bg-transparent text-black border border-black hover:bg-neutral-100 py-2.5 px-4 w-full",
    custom: "rounded-md",
  };

  return (
    <button
      disabled={loading}
      style={{ borderRadius: "8px" }}
      type={type}
      onClick={!loading ? onClick : undefined}
      className={classNames(
        baseStyle,
        variants[variant],
        {
          "opacity-50 cursor-not-allowed": loading,
        },
        className
      )}
      aria-label={ariaLabel || label}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="animate-spin border-2 border-solid border-white border-r-transparent rounded-full w-4 h-4"></span>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {price && <span>{price}</span>}
          {price && <span>|</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default Button;