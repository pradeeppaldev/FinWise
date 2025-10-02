import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
  };
  
  const sizeClasses = {
    sm: 'py-1 px-2 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled || loading ? 'opacity-75 cursor-not-allowed' : ''}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <span className="loading-spinner mr-2 h-4 w-4 border-t-2 border-b-2"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;