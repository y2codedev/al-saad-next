import React from "react";

const SelectField = ({
  value,
  name,
  options,
  onChange,
  error,
  touched,
  placeholder,
  disabled,
}) => {
  return (
    <div className="">
      <div className="relative">
        <select
          disabled={disabled}
          name={name}
          value={value}
          onChange={onChange}
          className={`border border-gray-300 px-3 py-2 rounded w-full ${error && touched ? "border-red-500" : ""}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && touched && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SelectField;
