import React from 'react';

const FormInput = ({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  error, 
  placeholder,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;