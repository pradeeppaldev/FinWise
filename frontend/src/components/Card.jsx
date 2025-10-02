import React from 'react';

const Card = ({ 
  children, 
  header, 
  footer, 
  className = '', 
  headerClassName = '', 
  bodyClassName = '', 
  footerClassName = '',
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {header && (
        <div className={`card-header ${headerClassName}`}>
          {typeof header === 'string' ? <h3 className="text-lg font-semibold">{header}</h3> : header}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className={`card-footer ${footerClassName}`}>
          {typeof footer === 'string' ? <p>{footer}</p> : footer}
        </div>
      )}
    </div>
  );
};

export default Card;