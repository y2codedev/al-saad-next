import React from "react";

const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  touched,
  type = "text",
  className,
  ...rest
}) => (
  <div className="">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 px-3 py-2 rounded w-full ${className}`}
      {...rest}
    />
    {touched && error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default InputField;
