import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  className = '' 
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;